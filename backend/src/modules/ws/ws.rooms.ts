import type { WebSocket } from "ws";

import type { ServerMessage } from "./ws.messages.js";

export type Role = "HOST" | "PARTICIPANT";

export type SocketContext = {
  socket: WebSocket;
  sessionId: string;
  userId: string;
  role: Role;
};

const rooms = new Map<string, Set<SocketContext>>();

export function addToRoom(ctx: SocketContext): void {
  let room = rooms.get(ctx.sessionId);
  if (!room) {
    room = new Set();
    rooms.set(ctx.sessionId, room);
  }
  room.add(ctx);
}

export function removeFromRoom(ctx: SocketContext): void {
  const room = rooms.get(ctx.sessionId);
  if (!room) return;
  room.delete(ctx);
  if (room.size === 0) rooms.delete(ctx.sessionId);
}

export function broadcast(sessionId: string, message: ServerMessage): void {
  const room = rooms.get(sessionId);
  if (!room) return;
  const payload = JSON.stringify(message);
  for (const { socket } of room) {
    if (socket.readyState === socket.OPEN) {
      socket.send(payload);
    }
  }
}

export function sendTo(socket: WebSocket, message: ServerMessage): void {
  if (socket.readyState === socket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}
