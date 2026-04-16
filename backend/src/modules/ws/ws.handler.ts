import { WebSocketServer, type WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "../../config/env.js";
import { prisma } from "../../db/prisma.js";
import { ADD_SONG_LIMIT, tryConsume } from "../../lib/rateLimiter.js";
import { extractVideoId, fetchYouTubeMetadata } from "../../lib/youtube.js";
import {
  ClientMessage,
  JoinSessionMessage,
  type AddSongMessage,
  type SongEndedMessage,
  type SyncPlaybackMessage,
  type UpdateNameMessage,
  type VoteMessage,
} from "./ws.messages.js";
import {
  promoteNextSong,
  tryClaimInitialPlayback,
} from "./ws.playback.js";
import {
  addToRoom,
  broadcast,
  removeFromRoom,
  sendTo,
  type Role,
  type SocketContext,
} from "./ws.rooms.js";
import { buildQueue, buildSessionState, fetchParticipants } from "./ws.state.js";

export function startWebSocketServer(): WebSocketServer {
  const wss = new WebSocketServer({ port: env.WS_PORT, host: env.HOST });

  wss.on("connection", (socket: WebSocket) => {
    let ctx: SocketContext | null = null;

    socket.on("message", async (raw) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw.toString());
      } catch {
        return sendTo(socket, { type: "ERROR", code: "InvalidJson" });
      }

      if (!ctx) {
        const joinResult = JoinSessionMessage.safeParse(parsed);
        if (!joinResult.success) {
          sendTo(socket, { type: "ERROR", code: "MustJoinFirst" });
          socket.close(1008, "MustJoinFirst");
          return;
        }
        const next = await handleJoin(socket, joinResult.data);
        if (next) ctx = next;
        return;
      }

      const msgResult = ClientMessage.safeParse(parsed);
      if (!msgResult.success) {
        return sendTo(socket, { type: "ERROR", code: "InvalidMessage" });
      }

      try {
        await dispatch(ctx, msgResult.data);
      } catch (err) {
        console.error("ws handler failed", err);
        sendTo(ctx.socket, { type: "ERROR", code: "InternalError" });
      }
    });

    socket.on("close", () => {
      if (ctx) removeFromRoom(ctx);
    });

    socket.on("error", (err) => {
      console.warn("websocket error", err);
    });
  });

  return wss;
}

async function handleJoin(
  socket: WebSocket,
  msg: z.infer<typeof JoinSessionMessage>,
): Promise<SocketContext | null> {
  const now = new Date();
  const session = await prisma.session.findUnique({
    where: { id: msg.sessionId },
    select: { id: true, hostId: true, expiresAt: true },
  });
  if (!session) {
    sendTo(socket, { type: "ERROR", code: "SessionNotFound" });
    socket.close(1008, "SessionNotFound");
    return null;
  }
  if (session.expiresAt <= now) {
    sendTo(socket, { type: "ERROR", code: "SessionExpired" });
    socket.close(1008, "SessionExpired");
    return null;
  }

  let role: Role = "PARTICIPANT";
  if (msg.token) {
    try {
      const decoded = jwt.verify(msg.token, env.JWT_SECRET) as { sub: string };
      if (decoded.sub === session.hostId) {
        role = "HOST";
      } else {
        sendTo(socket, { type: "ERROR", code: "HostAccessDenied" });
        socket.close(1008, "HostAccessDenied");
        return null;
      }
    } catch {
      sendTo(socket, { type: "ERROR", code: "InvalidToken" });
      socket.close(1008, "InvalidToken");
      return null;
    }
  }

  await prisma.participant.upsert({
    where: {
      sessionId_userId: { sessionId: msg.sessionId, userId: msg.userId },
    },
    update: { name: msg.name },
    create: {
      sessionId: msg.sessionId,
      userId: msg.userId,
      name: msg.name,
    },
  });

  const ctx: SocketContext = {
    socket,
    sessionId: msg.sessionId,
    userId: msg.userId,
    role,
  };
  addToRoom(ctx);

  const state = await buildSessionState(prisma, msg.sessionId);
  sendTo(socket, state);

  const participants = await fetchParticipants(prisma, msg.sessionId);
  broadcast(msg.sessionId, { type: "PARTICIPANTS_UPDATED", participants });

  return ctx;
}

async function dispatch(
  ctx: SocketContext,
  msg: z.infer<typeof ClientMessage>,
): Promise<void> {
  if (msg.sessionId !== ctx.sessionId) {
    return sendTo(ctx.socket, { type: "ERROR", code: "SessionMismatch" });
  }

  switch (msg.type) {
    case "JOIN_SESSION":
      return sendTo(ctx.socket, { type: "ERROR", code: "AlreadyJoined" });
    case "ADD_SONG":
      return handleAddSong(ctx, msg);
    case "VOTE":
      return handleVote(ctx, msg);
    case "SONG_ENDED":
      return handleSongEnded(ctx, msg);
    case "SYNC_PLAYBACK":
      return handleSyncPlayback(ctx, msg);
    case "UPDATE_NAME":
      return handleUpdateName(ctx, msg);
  }
}

async function handleAddSong(
  ctx: SocketContext,
  msg: z.infer<typeof AddSongMessage>,
): Promise<void> {
  const rateKey = `add_song:${ctx.sessionId}:${ctx.userId}`;
  if (!tryConsume(rateKey, ADD_SONG_LIMIT)) {
    return sendTo(ctx.socket, { type: "ERROR", code: "RateLimited" });
  }

  const videoId = extractVideoId(msg.videoId);
  if (!videoId) {
    return sendTo(ctx.socket, { type: "ERROR", code: "InvalidVideoId" });
  }

  const existing = await prisma.song.findUnique({
    where: { sessionId_videoId: { sessionId: ctx.sessionId, videoId } },
    select: { id: true },
  });
  if (existing) {
    return sendTo(ctx.socket, { type: "ERROR", code: "SongAlreadyQueued" });
  }

  let metadata: Awaited<ReturnType<typeof fetchYouTubeMetadata>> = null;
  try {
    metadata = await fetchYouTubeMetadata(videoId);
  } catch (err) {
    console.warn("youtube metadata fetch failed", { err, videoId });
  }

  const song = await prisma.song.create({
    data: {
      sessionId: ctx.sessionId,
      videoId,
      originalUrl: msg.videoId !== videoId ? msg.videoId : null,
      title: metadata?.title ?? videoId,
      durationSeconds: metadata?.durationSeconds ?? null,
      thumbnailUrl: metadata?.thumbnailUrl ?? null,
      addedBy: ctx.userId,
    },
    select: { id: true, videoId: true, title: true, thumbnailUrl: true, durationSeconds: true, addedBy: true, _count: { select: { votes: true } } },
  });

  const claimed = await tryClaimInitialPlayback(prisma, ctx.sessionId, song.id);

  if (claimed) {
    broadcast(ctx.sessionId, {
      type: "PLAY_SONG",
      song: {
        id: song.id,
        videoId: song.videoId,
        title: song.title,
        thumbnailUrl: song.thumbnailUrl,
        durationSeconds: song.durationSeconds,
        addedBy: song.addedBy,
        votes: song._count.votes,
      },
    });
  }

  const session = await prisma.session.findUnique({
    where: { id: ctx.sessionId },
    select: { currentSongId: true },
  });
  const queue = await buildQueue(prisma, ctx.sessionId, session?.currentSongId ?? null);
  broadcast(ctx.sessionId, { type: "QUEUE_UPDATED", queue });
}

async function handleVote(
  ctx: SocketContext,
  msg: z.infer<typeof VoteMessage>,
): Promise<void> {
  if (msg.userId !== ctx.userId) {
    return sendTo(ctx.socket, { type: "ERROR", code: "UserMismatch" });
  }

  const song = await prisma.song.findUnique({
    where: { id: msg.songId },
    select: { id: true, sessionId: true, currentInSession: { select: { id: true } } },
  });
  if (!song || song.sessionId !== ctx.sessionId) {
    return sendTo(ctx.socket, { type: "ERROR", code: "SongNotInSession" });
  }
  if (song.currentInSession.length > 0) {
    return sendTo(ctx.socket, { type: "ERROR", code: "CannotVoteCurrent" });
  }

  await prisma.vote.upsert({
    where: { songId_userId: { songId: msg.songId, userId: ctx.userId } },
    update: {},
    create: { songId: msg.songId, userId: ctx.userId },
  });

  const session = await prisma.session.findUnique({
    where: { id: ctx.sessionId },
    select: { currentSongId: true },
  });
  const queue = await buildQueue(prisma, ctx.sessionId, session?.currentSongId ?? null);
  broadcast(ctx.sessionId, { type: "QUEUE_UPDATED", queue });
}

async function handleSongEnded(
  ctx: SocketContext,
  _msg: z.infer<typeof SongEndedMessage>,
): Promise<void> {
  if (ctx.role !== "HOST") {
    return sendTo(ctx.socket, { type: "ERROR", code: "HostOnly" });
  }

  const session = await prisma.session.findUnique({
    where: { id: ctx.sessionId },
    select: { currentSongId: true },
  });

  if (session?.currentSongId) {
    await prisma.session.update({
      where: { id: ctx.sessionId },
      data: { currentSongId: null },
    });
    await prisma.song.delete({ where: { id: session.currentSongId } });
  }

  const next = await promoteNextSong(prisma, ctx.sessionId);

  if (next) {
    broadcast(ctx.sessionId, {
      type: "PLAY_SONG",
      song: {
        id: next.id,
        videoId: next.videoId,
        title: next.title,
        thumbnailUrl: next.thumbnailUrl,
        durationSeconds: next.durationSeconds,
        addedBy: next.addedBy,
        votes: next.votes,
      },
    });
  }

  const currentSongId = next?.id ?? null;
  const queue = await buildQueue(prisma, ctx.sessionId, currentSongId);
  broadcast(ctx.sessionId, { type: "QUEUE_UPDATED", queue });
}

async function handleUpdateName(
  ctx: SocketContext,
  msg: z.infer<typeof UpdateNameMessage>,
): Promise<void> {
  if (msg.userId !== ctx.userId) {
    return sendTo(ctx.socket, { type: "ERROR", code: "UserMismatch" });
  }

  await prisma.participant.update({
    where: {
      sessionId_userId: { sessionId: ctx.sessionId, userId: ctx.userId },
    },
    data: { name: msg.name },
  });

  const participants = await fetchParticipants(prisma, ctx.sessionId);
  broadcast(ctx.sessionId, { type: "PARTICIPANTS_UPDATED", participants });
}

async function handleSyncPlayback(
  ctx: SocketContext,
  msg: z.infer<typeof SyncPlaybackMessage>,
): Promise<void> {
  if (ctx.role !== "HOST") {
    return sendTo(ctx.socket, { type: "ERROR", code: "HostOnly" });
  }

  broadcast(ctx.sessionId, {
    type: "PLAYBACK_SYNC",
    elapsedSeconds: msg.elapsedSeconds,
    paused: msg.paused,
  });
}
