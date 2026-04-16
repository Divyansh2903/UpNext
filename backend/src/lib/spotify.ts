import { env } from "../config/env.js";

const SPOTIFY_TRACK_REGEX = /(?:open\.spotify\.com\/track\/|spotify:track:)([A-Za-z0-9]{22})/i;

type SpotifyTokenResponse = {
  access_token: string;
  expires_in: number;
};

type SpotifyTrackResponse = {
  name?: string;
  artists?: Array<{ name?: string }>;
};

type CachedToken = {
  value: string;
  expiresAtMs: number;
};

type CachedTrackLookup = {
  title: string;
  artist: string;
  cachedAtMs: number;
};

let cachedToken: CachedToken | null = null;
const trackLookupCache = new Map<string, CachedTrackLookup>();
const TRACK_CACHE_TTL_MS = 30 * 60 * 1000;

export function extractSpotifyTrackId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const match = SPOTIFY_TRACK_REGEX.exec(trimmed);
  return match?.[1] ?? null;
}

function assertSpotifyConfigured(): void {
  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) {
    throw new Error("SpotifyNotConfigured");
  }
}

async function getSpotifyAccessToken(): Promise<string> {
  assertSpotifyConfigured();
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAtMs - 30_000 > now) {
    return cachedToken.value;
  }

  const body = new URLSearchParams();
  body.set("grant_type", "client_credentials");
  body.set("client_id", env.SPOTIFY_CLIENT_ID!);
  body.set("client_secret", env.SPOTIFY_CLIENT_SECRET!);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!response.ok) {
    throw new Error("SpotifyTokenFailed");
  }
  const payload = (await response.json()) as SpotifyTokenResponse;
  cachedToken = {
    value: payload.access_token,
    expiresAtMs: now + payload.expires_in * 1000,
  };
  return payload.access_token;
}

export async function fetchSpotifyTrackMetadata(
  trackId: string,
): Promise<{ title: string; artist: string } | null> {
  const cached = trackLookupCache.get(trackId);
  const now = Date.now();
  if (cached && now - cached.cachedAtMs < TRACK_CACHE_TTL_MS) {
    return { title: cached.title, artist: cached.artist };
  }

  const token = await getSpotifyAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    return null;
  }
  const payload = (await response.json()) as SpotifyTrackResponse;
  const title = payload.name?.trim();
  const artist = payload.artists?.[0]?.name?.trim();
  if (!title || !artist) return null;
  trackLookupCache.set(trackId, { title, artist, cachedAtMs: now });
  return { title, artist };
}
