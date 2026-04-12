import Fastify, {
  type FastifyError,
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import websocket from "@fastify/websocket";
import { ZodError } from "zod";

import { env } from "./config/env.js";
import { prisma } from "./db/prisma.js";
import { authPlugin } from "./modules/auth/auth.plugin.js";
import { sessionRoutes } from "./modules/session/session.routes.js";
import { wsPlugin } from "./modules/ws/ws.plugin.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: typeof prisma;
    requireHost: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string };
    user: { sub: string };
  }
}

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "development" ? "info" : "warn",
    },
  });

  app.decorate("prisma", prisma);

  app.setErrorHandler<FastifyError>((error, _req, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "ValidationError",
        issues: error.issues,
      });
    }
    if (error.statusCode && error.statusCode < 500) {
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
      });
    }
    app.log.error(error);
    return reply.status(500).send({ error: "InternalServerError" });
  });

  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  app.decorate("requireHost", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });

  await app.register(websocket);

  await app.register(authPlugin, { prefix: "/auth" });
  await app.register(sessionRoutes, { prefix: "/sessions" });
  await app.register(wsPlugin);

  app.get("/health", async () => ({ status: "ok" }));

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  return app;
}
