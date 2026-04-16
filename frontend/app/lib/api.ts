import { config } from "./config";
import type {
  ApiErrorPayload,
  AuthResponse,
  HostSessionSummaryResponse,
  HostSessionsResponse,
  SessionResponse,
} from "./types";

type HttpMethod = "GET" | "POST";

async function request<T>(path: string, options: { method?: HttpMethod; body?: unknown; token?: string } = {}): Promise<T> {
  const response = await fetch(`${config.apiUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let payload: ApiErrorPayload | null = null;
    try {
      payload = (await response.json()) as ApiErrorPayload;
    } catch {
      payload = null;
    }
    throw new Error(payload?.error ?? payload?.message ?? `RequestFailed:${response.status}`);
  }

  return (await response.json()) as T;
}

export const api = {
  signup(email: string, password: string, displayName: string) {
    return request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: { email, password, displayName },
    });
  },
  login(email: string, password: string) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },
  me(token: string) {
    return request<{ user: { id: string; email: string; displayName: string | null; createdAt: string } | null }>("/auth/me", {
      token,
    });
  },
  createSession(token: string) {
    return request<SessionResponse>("/sessions/", {
      method: "POST",
      token,
    });
  },
  getHostSessions(token: string) {
    return request<HostSessionsResponse>("/sessions/host/mine", {
      token,
    });
  },
  getSessionByCode(code: string) {
    return request<SessionResponse>(`/sessions/${code.toUpperCase()}`);
  },
  stopSession(token: string, sessionId: string) {
    return request<{ ok: boolean; expiresAt: string }>(`/sessions/by-id/${sessionId}/stop`, {
      method: "POST",
      token,
    });
  },
  getHostSessionSummary(token: string, sessionId: string) {
    return request<HostSessionSummaryResponse>(`/sessions/by-id/${sessionId}/summary`, {
      token,
    });
  },
};
