"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLElement, config: unknown) => YTPlayer;
      PlayerState: {
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  destroy: () => void;
  playVideo?: () => void;
  pauseVideo?: () => void;
  setVolume?: (volume: number) => void;
  getCurrentTime?: () => number;
  getDuration?: () => number;
};

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<void>((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve();

    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);
  });

  return youtubeApiPromise;
}

type YouTubePlayerProps = {
  videoId: string;
  className?: string;
  onEnded?: () => void;
  controls?: boolean;
  paused?: boolean;
  volume?: number;
  onProgress?: (payload: { elapsedSeconds: number; durationSeconds: number; paused: boolean }) => void;
};

export function YouTubePlayer({
  videoId,
  className,
  onEnded,
  controls = true,
  paused = false,
  volume = 70,
  onProgress,
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi()
      .then(() => {
        if (cancelled || !containerRef.current || !window.YT?.Player) return;

        playerRef.current?.destroy();
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: 1,
            controls: controls ? 1 : 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onStateChange: (event: { data: number }) => {
              if (event.data === window.YT?.PlayerState.ENDED) {
                onEnded?.();
              }
            },
          },
        });
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [controls, onEnded, videoId]);

  useEffect(() => {
    if (!playerRef.current) return;
    if (paused) {
      if (typeof playerRef.current.pauseVideo === "function") {
        playerRef.current.pauseVideo();
      }
    } else {
      if (typeof playerRef.current.playVideo === "function") {
        playerRef.current.playVideo();
      }
    }
  }, [paused]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || typeof player.setVolume !== "function") return;
    player.setVolume(Math.max(0, Math.min(100, Math.round(volume))));
  }, [volume, videoId]);

  useEffect(() => {
    if (!onProgress) return;
    const tick = () => {
      const player = playerRef.current;
      if (!player) return;
      if (typeof player.getCurrentTime !== "function" || typeof player.getDuration !== "function") return;
      let elapsedSeconds = 0;
      let durationSeconds = 0;
      try {
        elapsedSeconds = Math.max(0, Math.floor(player.getCurrentTime() || 0));
        durationSeconds = Math.max(0, Math.floor(player.getDuration() || 0));
      } catch {
        return;
      }
      onProgress({
        elapsedSeconds,
        durationSeconds,
        paused,
      });
    };

    tick();
    const intervalId = window.setInterval(tick, 500);
    return () => window.clearInterval(intervalId);
  }, [onProgress, paused, videoId]);

  return <div ref={containerRef} className={className} />;
}
