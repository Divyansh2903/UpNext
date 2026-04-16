import { config } from "./config";
import type { ClientMessage, ServerMessage } from "./types";

type MessageHandler = (message: ServerMessage) => void;
type CloseHandler = () => void;

export class SessionSocketClient {
  private socket: WebSocket | null = null;
  private handlers = new Set<MessageHandler>();
  private closeHandlers = new Set<CloseHandler>();

  connect() {
    if (this.socket && this.socket.readyState <= WebSocket.OPEN) {
      return;
    }

    this.socket = new WebSocket(config.wsUrl);
    this.socket.addEventListener("message", (event) => {
      try {
        const payload = JSON.parse(event.data) as ServerMessage;
        this.handlers.forEach((handler) => handler(payload));
      } catch {
        this.handlers.forEach((handler) => handler({ type: "ERROR", code: "InvalidServerPayload" }));
      }
    });
    this.socket.addEventListener("close", () => {
      this.closeHandlers.forEach((handler) => handler());
    });
    this.socket.addEventListener("error", () => {
      this.handlers.forEach((handler) => handler({ type: "ERROR", code: "SocketError" }));
    });
  }

  onMessage(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  onClose(handler: CloseHandler) {
    this.closeHandlers.add(handler);
    return () => {
      this.closeHandlers.delete(handler);
    };
  }

  send(message: ClientMessage) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("SocketNotOpen");
    }
    this.socket.send(JSON.stringify(message));
  }

  waitUntilOpen() {
    const socket = this.socket;
    if (!socket) return Promise.reject(new Error("SocketNotInitialized"));
    if (socket.readyState === WebSocket.OPEN) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      const onOpen = () => {
        socket.removeEventListener("open", onOpen);
        socket.removeEventListener("error", onError);
        resolve();
      };
      const onError = () => {
        socket.removeEventListener("open", onOpen);
        socket.removeEventListener("error", onError);
        reject(new Error("SocketOpenFailed"));
      };
      socket.addEventListener("open", onOpen, { once: true });
      socket.addEventListener("error", onError, { once: true });
    });
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }
}
