import { env } from "../config/env.js";

export type YouTubeMetadata = {
  title: string;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
};

const VIDEO_ID_REGEX = /^[A-Za-z0-9_-]{11}$/;

const URL_PATTERNS: RegExp[] = [
  /(?:youtube\.com\/watch\?[^#]*[?&]v=)([A-Za-z0-9_-]{11})/,
  /(?:youtube\.com\/(?:embed|shorts|v|live)\/)([A-Za-z0-9_-]{11})/,
  /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
];

export function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (VIDEO_ID_REGEX.test(trimmed)) return trimmed;
  for (const re of URL_PATTERNS) {
    const match = re.exec(trimmed);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function parseIso8601Duration(iso: string): number | null {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return null;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}

type YouTubeApiResponse = {
  items?: Array<{
    snippet?: {
      title?: string;
      thumbnails?: Record<string, { url?: string }>;
    };
    contentDetails?: { duration?: string };
  }>;
};

export async function fetchYouTubeMetadata(videoId: string): Promise<YouTubeMetadata | null> {
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("id", videoId);
  url.searchParams.set("key", env.YOUTUBE_API_KEY);

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as YouTubeApiResponse;
  const item = data.items?.[0];
  if (!item) return null;

  const thumbnails = item.snippet?.thumbnails ?? {};
  const thumbnail =
    thumbnails["maxres"]?.url ??
    thumbnails["high"]?.url ??
    thumbnails["medium"]?.url ??
    thumbnails["default"]?.url ??
    null;

  return {
    title: item.snippet?.title ?? videoId,
    durationSeconds: item.contentDetails?.duration
      ? parseIso8601Duration(item.contentDetails.duration)
      : null,
    thumbnailUrl: thumbnail,
  };
}
