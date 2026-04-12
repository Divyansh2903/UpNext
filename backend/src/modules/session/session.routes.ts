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

sessionRouter.post("/", requireHost, async (req, res, next) => {
  try {
    const hostId = req.user!.sub;

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const joinCode = generateJoinCode();
      const existing = await prisma.session.findUnique({ where: { joinCode } });
      if (existing) continue;

      const session = await prisma.session.create({
        data: { joinCode, hostId },
        select: {
          id: true,
          joinCode: true,
          status: true,
          createdAt: true,
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

sessionRouter.get("/:code", async (req, res, next) => {
  try {
    const { code } = CodeParamsSchema.parse(req.params);

    const session = await prisma.session.findUnique({
      where: { joinCode: code },
      select: {
        id: true,
        joinCode: true,
        status: true,
        createdAt: true,
        host: { select: { id: true } },
      },
    });

    if (!session) {
      res.status(404).json({ error: "SessionNotFound" });
      return;
    }

    res.json({ session });
  } catch (err) {
    next(err);
  }
});
