import { Router } from "express";
import { z } from "zod";

import { searchYouTubeSongs } from "../../lib/youtube.js";

const SearchQuerySchema = z.object({
  q: z.string().trim().min(1).max(200),
});

const searchCache = new Map<string, { expiresAtMs: number; results: Array<{ videoId: string; title: string; thumbnail: string | null }> }>();
const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000;

export const searchRouter = Router();

searchRouter.get("/", async (req, res, next) => {
  try {
    const { q } = SearchQuerySchema.parse(req.query);
    const normalized = q.toLowerCase();
    const now = Date.now();
    const cached = searchCache.get(normalized);
    if (cached && cached.expiresAtMs > now) {
      res.json({ results: cached.results });
      return;
    }

    const results = await searchYouTubeSongs(q, 5);
    const mapped = results.map((item) => ({
      videoId: item.videoId,
      title: item.title,
      thumbnail: item.thumbnailUrl,
    }));
    searchCache.set(normalized, { expiresAtMs: now + SEARCH_CACHE_TTL_MS, results: mapped });
    res.json({ results: mapped });
  } catch (err) {
    next(err);
  }
});
