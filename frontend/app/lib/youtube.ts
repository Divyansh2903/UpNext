const VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export function extractYouTubeVideoId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;

  if (VIDEO_ID_REGEX.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const v = url.searchParams.get("v");
      if (v && VIDEO_ID_REGEX.test(v)) {
        return v;
      }
    }

    if (hostname === "youtu.be") {
      const shortId = url.pathname.replace("/", "");
      if (VIDEO_ID_REGEX.test(shortId)) {
        return shortId;
      }
    }
  } catch {
    return null;
  }

  return null;
}
