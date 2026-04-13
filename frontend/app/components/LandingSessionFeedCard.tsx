"use client";

import { Heart } from "lucide-react";
import Image from "next/image";

export type LandingQueueTrack = {
  id: string;
  title: string;
  artist: string;
  art: string;
  votes: number;
  playing?: boolean;
};

const DEFAULT_TRACKS: LandingQueueTrack[] = [
  {
    id: "1",
    title: "Midnight City (Remix)",
    artist: "M83",
    art: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&q=80",
    playing: true,
    votes: 48,
  },
  {
    id: "2",
    title: "Hyperlight Drifter",
    artist: "Disasterpeace",
    art: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=80",
    votes: 31,
  },
];

type Props = {
  title?: string;
  tracks?: LandingQueueTrack[];
  /** When false, omit the pulsing live dot (e.g. static mock). */
  showLivePulse?: boolean;
  className?: string;
};

export function LandingSessionFeedCard({
  title = "Live session feed",
  tracks = DEFAULT_TRACKS,
  showLivePulse = true,
  className,
}: Props) {
  const rootClass = ["landing-feed-card", className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      <div className="landing-feed-card__header">
        {showLivePulse ? <span className="landing-feed-card__live" aria-hidden /> : null}
        <span className="landing-feed-card__title">{title}</span>
      </div>
      <ul className="landing-feed-card__list">
        {tracks.map((t) => (
          <li key={t.id} className={t.playing ? "landing-feed-row landing-feed-row--active" : "landing-feed-row"}>
            <div className="landing-feed-row__art">
              <Image src={t.art} alt="" width={56} height={56} className="landing-feed-row__img" sizes="56px" />
            </div>
            <div className="landing-feed-row__meta">
              <span className="landing-feed-row__title">{t.title}</span>
              <span className="landing-feed-row__artist">{t.playing ? "Playing now" : t.artist}</span>
            </div>
            <button type="button" className="landing-feed-row__vote" aria-label={`Upvote ${t.title}`}>
              <Heart className="landing-feed-row__heart" strokeWidth={1.75} size={18} />
              <span>{t.votes}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
