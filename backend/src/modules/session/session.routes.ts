import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";

import { generateJoinCode } from "../../lib/joinCode.js";

const CodeParamsSchema = z.object({
  code: z.string().length(6).regex(/^[A-Z2-9]+$/),
});

const MAX_CODE_ATTEMPTS = 5;

export const sessionRoutes: FastifyPluginAsync = async (app) => {
  app.post("/", { preHandler: [app.requireHost] }, async (req, reply) => {
    const hostId = req.user.sub;

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const joinCode = generateJoinCode();
      const existing = await app.prisma.session.findUnique({ where: { joinCode } });
      if (existing) continue;

      const session = await app.prisma.session.create({
        data: { joinCode, hostId },
        select: {
          id: true,
          joinCode: true,
          status: true,
          createdAt: true,
        },
      });
      return reply.status(201).send({ session });
    }

    return reply.status(503).send({ error: "CouldNotAllocateJoinCode" });
  });

  app.get("/:code", async (req, reply) => {
    const { code } = CodeParamsSchema.parse(req.params);

    const session = await app.prisma.session.findUnique({
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
      return reply.status(404).send({ error: "SessionNotFound" });
    }

    return { session };
  });
};
