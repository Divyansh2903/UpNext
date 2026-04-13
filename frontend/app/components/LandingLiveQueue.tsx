"use client";

import {
  Cog,
  Home,
  LayoutGrid,
  Music2,
  Play,
  Settings,
  Share2,
  ThumbsUp,
} from "lucide-react";

type QueueRow = {
  id: string;
  title: string;
  artist: string;
  votes: number;
  art: string;
  active: boolean;
  progress?: number;
};

const queueRows: QueueRow[] = [
  {
    id: "1",
    title: "Everything You Are",
    artist: "Hindia",
    votes: 142,
    art: "linear-gradient(145deg, #5c2a18 0%, #1a0a06 100%)",
    active: true,
    progress: 0.42,
  },
  {
    id: "2",
    title: "Live Queue",
    artist: "UpNext",
    votes: 98,
    art: "linear-gradient(145deg, #1e3a5c 0%, #060d18 100%)",
    active: false,
  },
  {
    id: "3",
    title: "Kita Ke Sana",
    artist: "Various",
    votes: 88,
    art: "linear-gradient(145deg, #3d2060 0%, #12081f 100%)",
    active: false,
  },
  {
    id: "4",
    title: "Kita Ke Sana",
    artist: "Hindia",
    votes: 77,
    art: "linear-gradient(145deg, #2a4a38 0%, #081210 100%)",
    active: false,
  },
  {
    id: "5",
    title: "Membasuh",
    artist: "Hindia",
    votes: 56,
    art: "linear-gradient(145deg, #4a3020 0%, #140c08 100%)",
    active: false,
  },
];

function AvatarStack({ seed }: { seed: number }) {
  const hues = [12, 200, 145];
  return (
    <div className="landing-lq-avatars" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="landing-lq-avatar"
          style={{
            background: `linear-gradient(135deg, hsl(${hues[(i + seed) % 3]}, 55%, 48%), hsl(${(hues[(i + seed) % 3] + 40) % 360}, 40%, 22%))`,
            zIndex: 3 - i,
          }}
        />
      ))}
    </div>
  );
}

export function LandingLiveQueueSection() {
  return (
    <section className="landing-live" id="features" aria-labelledby="landing-live-heading">
      <div className="landing-live-streak-wrap" aria-hidden>
        <div className="landing-live-streak landing-live-streak--ambient" />
        <div className="landing-live-streak landing-live-streak--beam" />
        <div className="landing-live-streak landing-live-streak--sheen" />
      </div>

      <div className="landing-live-inner">
        <div id="how" style={{ height: 0, scrollMarginTop: 72 }} aria-hidden />

        <header className="landing-live-columns">
          <div className="landing-live-col landing-live-col--primary">
            <p>Instant updates for</p>
            <p>No refreshing needed.</p>
            <p>The highest voted song</p>
            <p>automatically plays next.</p>
          </div>
          <div className="landing-live-col landing-live-col--muted">
            <p>high-fidelity-app to dirands</p>
            <p>everyats of thee wawving.</p>
            <p>The highest voted song</p>
            <p>automatically plays next.</p>
          </div>
        </header>

        <div className="landing-lq-window">
          <aside className="landing-lq-sidebar" aria-label="App navigation">
            <div className="landing-lq-traffic" aria-hidden>
              <span className="landing-lq-dot landing-lq-dot--red" />
              <span className="landing-lq-dot landing-lq-dot--yellow" />
              <span className="landing-lq-dot landing-lq-dot--green" />
            </div>
            <nav className="landing-lq-nav">
              <button type="button" className="landing-lq-nav-btn landing-lq-nav-btn--active" aria-current="page">
                <span className="landing-lq-nav-glow" aria-hidden />
                <span className="landing-lq-nav-dot" aria-hidden />
                <Home strokeWidth={1.75} size={20} />
              </button>
              <button type="button" className="landing-lq-nav-btn" aria-label="Grid">
                <LayoutGrid strokeWidth={1.75} size={20} />
              </button>
              <button type="button" className="landing-lq-nav-btn" aria-label="Music">
                <Music2 strokeWidth={1.75} size={20} />
              </button>
              <button type="button" className="landing-lq-nav-btn" aria-label="Play">
                <Play strokeWidth={1.75} size={20} />
              </button>
              <button type="button" className="landing-lq-nav-btn" aria-label="Settings">
                <Settings strokeWidth={1.75} size={20} />
              </button>
            </nav>
          </aside>

          <div className="landing-lq-main">
            <div className="landing-lq-toolbar">
              <h2 className="landing-lq-title" id="landing-live-heading">
                Live Queue
              </h2>
              <div className="landing-lq-toolbar-actions">
                <button type="button" className="landing-lq-icon-square" aria-label="Settings">
                  <Cog size={17} strokeWidth={1.75} />
                </button>
                <button type="button" className="landing-lq-icon-square" aria-label="Share">
                  <Share2 size={16} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <ul className="landing-lq-list">
              {queueRows.map((row, index) => (
                <li key={row.id} className={row.active ? "landing-lq-row landing-lq-row--active" : "landing-lq-row"}>
                  <div className="landing-lq-art" style={{ background: row.art }} />
                  <div className="landing-lq-meta">
                    <div className="landing-lq-text">
                      <span className="landing-lq-song">{row.title}</span>
                      <span className="landing-lq-artist">{row.artist}</span>
                    </div>
                    {row.active && row.progress != null && (
                      <div className="landing-lq-progress" role="presentation">
                        <span
                          className="landing-lq-progress-fill"
                          style={{ width: `${Math.round(row.progress * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="landing-lq-actions">
                    <span className="landing-lq-vote">
                      <ThumbsUp size={14} strokeWidth={2} aria-hidden />
                      <span>{row.votes}</span>
                    </span>
                    <AvatarStack seed={index} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
