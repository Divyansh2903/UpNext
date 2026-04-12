import { env } from "./config/env.js";
import { prisma } from "./db/prisma.js";
import { startWebSocketServer } from "./modules/ws/ws.handler.js";

const wss = startWebSocketServer();

console.log(`WebSocket server listening on ${env.HOST}:${env.WS_PORT}`);

const shutdown = async (signal: string) => {
  console.log(`${signal} received, shutting down WS server`);
  wss.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
