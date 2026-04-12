import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import type { WebSocket } from "ws";
import { z } from "zod";

import { ADD_SONG_LIMIT, tryConsume } from "../../lib/rateLimiter.js";
import { extractVideoId, fetchYouTubeMetadata } from "../../lib/youtube.js";
import {
  ClientMessage,
  JoinSessionMessage,
  type AddSongMessage,
  type SongEndedMessage,
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

export const wsPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/ws", { websocket: true }, (socket, _req) => {
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
        const next = await handleJoin(app, socket, joinResult.data);
        if (next) ctx = next;
        return;
      }

      const msgResult = ClientMessage.safeParse(parsed);
      if (!msgResult.success) {
        return sendTo(socket, { type: "ERROR", code: "InvalidMessage" });
      }

      try {
        await dispatch(app, ctx, msgResult.data);
      } catch (err) {
        app.log.error({ err }, "ws handler failed");
        sendTo(ctx.socket, { type: "ERROR", code: "InternalError" });
      }
    });

    socket.on("close", () => {
      if (ctx) removeFromRoom(ctx);
    });

    socket.on("error", (err) => {
      app.log.warn({ err }, "websocket error");
    });
  });
};

async function handleJoin(
  app: FastifyInstance,
  socket: WebSocket,
  msg: z.infer<typeof JoinSessionMessage>,
): Promise<SocketContext | null> {
  const session = await app.prisma.session.findUnique({
    where: { id: msg.sessionId },
    select: { id: true, hostId: true },
  });
  if (!session) {
    sendTo(socket, { type: "ERROR", code: "SessionNotFound" });
    socket.close(1008, "SessionNotFound");
    return null;
  }

  let role: Role = "PARTICIPANT";
  if (msg.token) {
    try {
      const decoded = app.jwt.verify<{ sub: string }>(msg.token);
      if (decoded.sub === session.hostId) {
        role = "HOST";
      }
    } catch {
      sendTo(socket, { type: "ERROR", code: "InvalidToken" });
    }
  }

  await app.prisma.participant.upsert({
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

  const state = await buildSessionState(app.prisma, msg.sessionId);
  sendTo(socket, state);

  const participants = await fetchParticipants(app.prisma, msg.sessionId);
  broadcast(msg.sessionId, { type: "PARTICIPANTS_UPDATED", participants });

  return ctx;
}

async function dispatch(
  app: FastifyInstance,
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
      return handleAddSong(app, ctx, msg);
    case "VOTE":
      return handleVote(app, ctx, msg);
    case "SONG_ENDED":
      return handleSongEnded(app, ctx, msg);
    case "UPDATE_NAME":
      return handleUpdateName(app, ctx, msg);
  }
}

async function handleAddSong(
  app: FastifyInstance,
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

  const existing = await app.prisma.song.findUnique({
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
    app.log.warn({ err, videoId }, "youtube metadata fetch failed");
  }

  const song = await app.prisma.song.create({
    data: {
      sessionId: ctx.sessionId,
      videoId,
      originalUrl: msg.videoId !== videoId ? msg.videoId : null,
      title: metadata?.title ?? videoId,
      durationSeconds: metadata?.durationSeconds ?? null,
      thumbnailUrl: metadata?.thumbnailUrl ?? null,
      addedBy: ctx.userId,
    },
    select: { id: true, videoId: true },
  });

  const claimed = await tryClaimInitialPlayback(app.prisma, ctx.sessionId, song.id);

  if (claimed) {
    broadcast(ctx.sessionId, { type: "PLAY_SONG", videoId: song.videoId });
  }

  const session = await app.prisma.session.findUnique({
    where: { id: ctx.sessionId },
    select: { currentSongId: true },
  });
  const queue = await buildQueue(app.prisma, ctx.sessionId, session?.currentSongId ?? null);
  broadcast(ctx.sessionId, { type: "QUEUE_UPDATED", queue });
}

async function handleVote(
  app: FastifyInstance,
  ctx: SocketContext,
  msg: z.infer<typeof VoteMessage>,
): Promise<void> {
  if (msg.userId !== ctx.userId) {
    return sendTo(ctx.socket, { type: "ERROR", code: "UserMismatch" });
  }

  const song = await app.prisma.song.findUnique({
    where: { id: msg.songId },
    select: { id: true, sessionId: true, currentInSession: { select: { id: true } } },
  });
  if (!song || song.sessionId !== ctx.sessionId) {
    return sendTo(ctx.socket, { type: "ERROR", code: "SongNotInSession" });
  }
  if (song.currentInSession.length > 0) {
    return sendTo(ctx.socket, { type: "ERROR", code: "CannotVoteCurrent" });
  }

  await app.prisma.vote.upsert({
    where: { songId_userId: { songId: msg.songId, userId: ctx.userId } },
    update: {},
    create: { songId: msg.songId, userId: ctx.userId },
  });

  const session = await app.prisma.session.findUnique({
    where: { id: ctx.sessionId },
    select: { currentSongId: true },
  });
  const queue = await buildQueue(app.prisma, ctx.sessionId, session?.currentSongId ?? null);
  broadcast(ctx.sessionId, { type: "QUEUE_UPDATED", queue });
}

async function handleSongEnded(
  app: FastifyInstance,
  ctx: SocketContext,
  _msg: z.infer<typeof SongEndedMessage>,
): Promise<void> {
  if (ctx.role !== "HOST") {
    return sendTo(ctx.socket, { type: "ERROR", code: "HostOnly" });
  }

  const session = await app.prisma.session.findUnique({
    where: { id: ctx.sessionId },
    select: { currentSongId: true },
  });

  if (session?.currentSongId) {
    await app.prisma.session.update({
      where: { id: ctx.sessionId },
      data: { currentSongId: null },
    });
    await app.prisma.song.delete({ where: { id: session.currentSongId } });
  }

  const next = await promoteNextSong(app.prisma, ctx.sessionId);

  if (next) {
    broadcast(ctx.sessionId, { type: "PLAY_SONG", videoId: next.videoId });
  }

  const currentSongId = next?.id ?? null;
  const queue = await buildQueue(app.prisma, ctx.sessionId, currentSongId);
  broadcast(ctx.sessionId, { type: "QUEUE_UPDATED", queue });
}

async function handleUpdateName(
  app: FastifyInstance,
  ctx: SocketContext,
  msg: z.infer<typeof UpdateNameMessage>,
): Promise<void> {
  if (msg.userId !== ctx.userId) {
    return sendTo(ctx.socket, { type: "ERROR", code: "UserMismatch" });
  }

  await app.prisma.participant.update({
    where: {
      sessionId_userId: { sessionId: ctx.sessionId, userId: ctx.userId },
    },
    data: { name: msg.name },
  });

  const participants = await fetchParticipants(app.prisma, ctx.sessionId);
  broadcast(ctx.sessionId, { type: "PARTICIPANTS_UPDATED", participants });
}
