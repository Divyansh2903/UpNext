"use client";

import { Heart, MoreHorizontal, Pause, SkipBack, SkipForward } from "lucide-react";

const QUEUE_ITEMS = [
  { id: "1", title: "Midnight Drive", artist: "Neon Pulsar", votes: 142, hue: "var(--landing-mock-art-1-from)" },
  { id: "2", title: "Glass Horizon", artist: "Static Bloom", votes: 98, hue: "var(--landing-mock-art-2-from)" },
  { id: "3", title: "Signal Lost", artist: "Low Orbit", votes: 88, hue: "var(--landing-mock-art-3-from)" },
  { id: "4", title: "Velvet Runway", artist: "Noir District", votes: 77, hue: "var(--landing-mock-art-4-from)" },
] as const;

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, hsl(var(--landing-avatar-hue-1) 55% 48%), hsl(var(--landing-avatar-hue-1-dim) 40% 22%))",
  "linear-gradient(135deg, hsl(var(--landing-avatar-hue-2) 55% 48%), hsl(var(--landing-avatar-hue-2-dim) 40% 22%))",
  "linear-gradient(135deg, hsl(var(--landing-avatar-hue-3) 55% 48%), hsl(var(--landing-avatar-hue-3-dim) 40% 22%))",
] as const;

export function LandingQueueEvolve() {
  return (
    <div className="landing-evolve-stack">
      <div className="landing-evolve-listeners" aria-hidden>
        <div className="landing-evolve-listeners__avatars">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="landing-evolve-listeners__avatar"
              style={{
                background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                zIndex: 4 - i,
              }}
            />
          ))}
        </div>
        <span className="landing-evolve-listeners__count">+19</span>
      </div>
      <div className="landing-evolve-back glass-panel">
        <div className="landing-evolve-back__head">
          <span className="landing-evolve-back__title">Collaborative Queue</span>
        </div>
        <ul className="landing-evolve-back__list">
          {QUEUE_ITEMS.map((row) => (
            <li key={row.id} className="landing-evolve-row">
              <div
                className="landing-evolve-row__art"
                style={{
                  background: `linear-gradient(145deg, ${row.hue} 0%, var(--landing-mock-art-1-to) 100%)`,
                }}
              />
              <div className="landing-evolve-row__meta">
                <span className="landing-evolve-row__song">{row.title}</span>
                <span className="landing-evolve-row__artist">{row.artist}</span>
              </div>
              <span className="landing-evolve-row__vote">
                <Heart size={15} strokeWidth={1.85} aria-hidden />
                {row.votes}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="landing-evolve-front glass-panel">
        <div className="landing-evolve-player__toolbar">
          <h3 className="landing-evolve-player__heading">Now Playing</h3>
          <button type="button" className="landing-evolve-icon-btn" aria-label="Menu">
            <MoreHorizontal size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="landing-evolve-player__video">
          <div
            className="landing-evolve-player__thumb"
            style={{
              background:
                "linear-gradient(160deg, color-mix(in srgb, var(--color-upnext-primary) 35%, var(--color-surface-canvas)) 0%, var(--color-surface-container-highest) 55%, var(--color-surface-canvas) 100%)",
            }}
          >
            <span className="landing-evolve-player__thumb-label">Midnight Drive</span>
            <span className="landing-evolve-player__thumb-artist">Neon Pulsar</span>
          </div>
        </div>

        <div className="landing-evolve-player__progress" role="presentation">
          <span className="landing-evolve-player__progress-fill" style={{ width: "42%" }} />
        </div>

        <div className="landing-evolve-player__controls">
          <button type="button" className="landing-evolve-skip" aria-label="Previous">
            <SkipBack size={22} strokeWidth={1.5} />
          </button>
          <button type="button" className="landing-evolve-play" aria-label="Pause">
            <Pause size={24} strokeWidth={2.25} />
          </button>
          <button type="button" className="landing-evolve-skip" aria-label="Next">
            <SkipForward size={22} strokeWidth={1.5} />
          </button>
          <div className="landing-evolve-player__avatars" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="landing-evolve-player__avatar"
                style={{
                  background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                  zIndex: 3 - i,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
