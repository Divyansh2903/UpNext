import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import bcrypt from "bcrypt";

import { CredentialsSchema, type AuthResponse } from "./auth.schemas.js";

const BCRYPT_ROUNDS = 12;

export const authPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post("/signup", async (req, reply) => {
    const { email, password } = CredentialsSchema.parse(req.body);

    const existing = await app.prisma.user.findUnique({ where: { email } });
    if (existing) {
      return reply.status(409).send({ error: "EmailAlreadyInUse" });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await app.prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true },
    });

    const token = app.jwt.sign({ sub: user.id });
    const response: AuthResponse = { token, user };
    return reply.status(201).send(response);
  });

  app.post("/login", async (req, reply) => {
    const { email, password } = CredentialsSchema.parse(req.body);

    const user = await app.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ error: "InvalidCredentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return reply.status(401).send({ error: "InvalidCredentials" });
    }

    const token = app.jwt.sign({ sub: user.id });
    const response: AuthResponse = {
      token,
      user: { id: user.id, email: user.email },
    };
    return reply.send(response);
  });

  app.get("/me", { preHandler: [app.requireHost] }, async (req) => {
    const user = await app.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { id: true, email: true, createdAt: true },
    });
    return { user };
  });
};
