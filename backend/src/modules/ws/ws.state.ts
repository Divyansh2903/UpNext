import type { PrismaClient } from "@prisma/client";

import type {
  CurrentSong,
  ParticipantDTO,
  QueueEntry,
  ServerMessage,
} from "./ws.messages.js";

export async function buildQueue(
  prisma: PrismaClient,
  sessionId: string,
  excludeSongId: string | null,
): Promise<QueueEntry[]> {
  const songs = await prisma.song.findMany({
    where: {
      sessionId,
      ...(excludeSongId ? { id: { not: excludeSongId } } : {}),
    },
    select: {
      id: true,
      videoId: true,
      title: true,
      thumbnailUrl: true,
      durationSeconds: true,
      addedBy: true,
      createdAt: true,
      _count: { select: { votes: true } },
    },
  });

  return songs
    .map((s) => ({
      id: s.id,
      videoId: s.videoId,
      title: s.title,
      thumbnailUrl: s.thumbnailUrl,
      durationSeconds: s.durationSeconds,
      addedBy: s.addedBy,
      votes: s._count.votes,
      createdAt: s.createdAt.toISOString(),
    }))
    .sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return a.createdAt.localeCompare(b.createdAt);
    });
}

export async function buildSessionState(
  prisma: PrismaClient,
  sessionId: string,
): Promise<Extract<ServerMessage, { type: "SESSION_STATE" }>> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: {
      currentSongId: true,
      currentSong: {
        select: {
          id: true,
          videoId: true,
          title: true,
          thumbnailUrl: true,
          durationSeconds: true,
        },
      },
    },
  });

  const [queue, participants] = await Promise.all([
    buildQueue(prisma, sessionId, session?.currentSongId ?? null),
    fetchParticipants(prisma, sessionId),
  ]);

  const currentSong: CurrentSong | null = session?.currentSong
    ? {
        id: session.currentSong.id,
        videoId: session.currentSong.videoId,
        title: session.currentSong.title,
        thumbnailUrl: session.currentSong.thumbnailUrl,
        durationSeconds: session.currentSong.durationSeconds,
      }
    : null;

  return {
    type: "SESSION_STATE",
    queue,
    currentSong,
    participants,
  };
}

export async function fetchParticipants(
  prisma: PrismaClient,
  sessionId: string,
): Promise<ParticipantDTO[]> {
  const participants = await prisma.participant.findMany({
    where: { sessionId },
    select: { id: true, userId: true, name: true, joinedAt: true },
    orderBy: { joinedAt: "asc" },
  });
  return participants.map((p) => ({
    id: p.id,
    userId: p.userId,
    name: p.name,
    joinedAt: p.joinedAt.toISOString(),
  }));
}
