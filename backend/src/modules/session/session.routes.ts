import { Router } from "express";
import { z } from "zod";

import { prisma } from "../../db/prisma.js";
import { requireHost } from "../../middleware/requireHost.js";
import { generateJoinCode } from "../../lib/joinCode.js";

const CodeParamsSchema = z.object({
  code: z.string().length(6).regex(/^[A-Z2-9]+$/),
});

const MAX_CODE_ATTEMPTS = 5;

export const sessionRouter = Router();

sessionRouter.get("/host/mine", requireHost, async (req, res, next) => {
  try {
    const hostId = req.user!.sub;
    const now = new Date();
    // List recent rooms for the dashboard, including ended/expired sessions.
    const sessions = await prisma.session.findMany({
      where: { hostId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        joinCode: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        _count: { select: { participants: true } },
      },
    });

    res.json({
      sessions: sessions.map((session) => ({
        id: session.id,
        joinCode: session.joinCode,
        status: session.status,
        createdAt: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        active: session.expiresAt > now,
        participantsCount: session._count.participants,
      })),
    });
  } catch (err) {
    next(err);
  }
});

sessionRouter.post("/", requireHost, async (req, res, next) => {
  try {
    const hostId = req.user!.sub;
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);
    const hostExists = await prisma.user.findUnique({
      where: { id: hostId },
      select: { id: true },
    });
    if (!hostExists) {
      res.status(401).json({ error: "HostNotFound" });
      return;
    }

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const joinCode = generateJoinCode();
      const existing = await prisma.session.findUnique({ where: { joinCode } });
      if (existing) continue;

      const session = await prisma.session.create({
        data: { joinCode, hostId, expiresAt },
        select: {
          id: true,
          joinCode: true,
          status: true,
          createdAt: true,
          expiresAt: true,
        },
      });
      res.status(201).json({ session });
      return;
    }

    res.status(503).json({ error: "CouldNotAllocateJoinCode" });
  } catch (err) {
    next(err);
  }
});

const SessionIdParamsSchema = z.object({
  sessionId: z.string().uuid(),
});

sessionRouter.get("/by-id/:sessionId/summary", requireHost, async (req, res, next) => {
  try {
    const hostId = req.user!.sub;
    const { sessionId } = SessionIdParamsSchema.parse(req.params);
    const now = new Date();

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        id: true,
        hostId: true,
        joinCode: true,
        createdAt: true,
        expiresAt: true,
        participants: {
          orderBy: { joinedAt: "asc" },
          select: {
            id: true,
            userId: true,
            name: true,
            joinedAt: true,
          },
        },
        songs: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            addedBy: true,
            createdAt: true,
            _count: { select: { votes: true } },
          },
        },
      },
    });
    if (!session) {
      res.status(404).json({ error: "SessionNotFound" });
      return;
    }
    if (session.hostId !== hostId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const participantNameByUserId = new Map(session.participants.map((participant) => [participant.userId, participant.name]));

    res.json({
      session: {
        id: session.id,
        joinCode: session.joinCode,
        createdAt: session.createdAt.toISOString(),
        expiresAt: session.expiresAt.toISOString(),
        active: session.expiresAt > now,
      },
      participants: session.participants.map((participant) => ({
        id: participant.id,
        userId: participant.userId,
        name: participant.name,
        joinedAt: participant.joinedAt.toISOString(),
      })),
      songs: session.songs.map((song) => ({
        id: song.id,
        title: song.title,
        thumbnailUrl: song.thumbnailUrl,
        addedBy: participantNameByUserId.get(song.addedBy) ?? song.addedBy,
        votes: song._count.votes,
        createdAt: song.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    next(err);
  }
});

sessionRouter.post("/by-id/:sessionId/stop", requireHost, async (req, res, next) => {
  try {
    const hostId = req.user!.sub;
    const { sessionId } = SessionIdParamsSchema.parse(req.params);

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true, hostId: true },
    });
    if (!session) {
      res.status(404).json({ error: "SessionNotFound" });
      return;
    }
    if (session.hostId !== hostId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const now = new Date();
    await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: now },
    });

    res.json({ ok: true, expiresAt: now.toISOString() });
  } catch (err) {
    next(err);
  }
});

sessionRouter.get("/:code", async (req, res, next) => {
  try {
    const { code } = CodeParamsSchema.parse(req.params);
    const now = new Date();

    const session = await prisma.session.findUnique({
      where: { joinCode: code },
      select: {
        id: true,
        joinCode: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        host: { select: { id: true, displayName: true } },
      },
    });

    if (!session) {
      res.status(404).json({ error: "SessionNotFound" });
      return;
    }
    if (session.expiresAt <= now) {
      res.status(410).json({ error: "SessionExpired" });
      return;
    }

    res.json({ session });
  } catch (err) {
    next(err);
  }
});
