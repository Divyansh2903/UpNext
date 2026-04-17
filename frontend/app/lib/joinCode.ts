/**
 * Accepts a raw 6-character join code or a pasted URL containing:
 * - `/session/{code}/join` (participant invite)
 * - `?code={code}` or `&code={code}` (e.g. host dashboard link)
 * Returns normalized uppercase code, or null.
 */
export function extractJoinCodeFromInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const fromJoinPath = trimmed.match(/\/session\/([A-Za-z0-9]{6})\/join/i);
  if (fromJoinPath?.[1]) {
    return fromJoinPath[1].toUpperCase();
  }

  const fromQuery = trimmed.match(/[?&]code=([A-Za-z0-9]{6})(?:&|#|$|\s)/i);
  if (fromQuery?.[1]) {
    return fromQuery[1].toUpperCase();
  }

  const compact = trimmed.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (compact.length === 6) return compact;
  return null;
}
