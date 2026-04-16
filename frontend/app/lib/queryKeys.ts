export const queryKeys = {
  authMe: ["auth", "me"] as const,
  hostSessions: ["host", "sessions"] as const,
  sessionByCode: (code: string) => ["session", "code", code] as const,
  hostSessionSummary: (sessionId: string) => ["host", "session", "summary", sessionId] as const,
};
