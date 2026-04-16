import type { PrismaClient } from "@prisma/client";

export type PromotedSong = {
  id: string;
  platform: "youtube" | "spotify";
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  addedBy: string;
  votes: number;
};

export async function promoteNextSong(
  prisma: PrismaClient,
  sessionId: string,
): Promise<PromotedSong | null> {
  const candidates = await prisma.song.findMany({
    where: { sessionId, currentInSession: { none: {} } },
    select: {
      id: true,
      platform: true,
      videoId: true,
      title: true,
      thumbnailUrl: true,
      durationSeconds: true,
      addedBy: true,
      createdAt: true,
      _count: { select: { votes: true } },
    },
  });

  if (candidates.length === 0) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { currentSongId: null, status: "idle" },
    });
    return null;
  }

  candidates.sort((a, b) => {
    if (b._count.votes !== a._count.votes) return b._count.votes - a._count.votes;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  const next = candidates[0]!;
  await prisma.session.update({
    where: { id: sessionId },
    data: { currentSongId: next.id, status: "playing" },
  });

  return {
    id: next.id,
    platform: next.platform,
    videoId: next.videoId,
    title: next.title,
    thumbnailUrl: next.thumbnailUrl,
    durationSeconds: next.durationSeconds,
    addedBy: next.addedBy,
    votes: next._count.votes,
  };
}

export async function tryClaimInitialPlayback(
  prisma: PrismaClient,
  sessionId: string,
  songId: string,
): Promise<boolean> {
  const result = await prisma.session.updateMany({
    where: { id: sessionId, currentSongId: null },
    data: { currentSongId: songId, status: "playing" },
  });
  return result.count === 1;
}
