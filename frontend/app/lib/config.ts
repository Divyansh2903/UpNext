const DEFAULT_API_URL = "http://localhost:4000";
const DEFAULT_WS_URL = "ws://localhost:4001";

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL ?? DEFAULT_WS_URL,
};
