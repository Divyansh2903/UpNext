"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Armchair, Bird, Camera, Disc3, Mic2, Play, Share2, ThumbsUp, Tv } from "lucide-react";
import { LandingQueueEvolve } from "./components/LandingQueueEvolve";
import { LandingSessionFeedCard, type LandingQueueTrack } from "./components/LandingSessionFeedCard";
import "./landing.css";

const HERO_QUEUE_TRACKS: LandingQueueTrack[] = [
  {
    id: "h1",
    title: "Midnight Drive",
    artist: "Neon Pulsar",
    art: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
    votes: 124,
  },
  {
    id: "h2",
    title: "Glass Horizon",
    artist: "Static Bloom",
    art: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&q=80",
    votes: 98,
  },
  {
    id: "h3",
    title: "Velvet Runway",
    artist: "Noir District",
    art: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&q=80",
    votes: 76,
  },
  {
    id: "h4",
    title: "Low Orbit",
    artist: "Signal Lost",
    art: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&q=80",
    votes: 54,
  },
];

const HOW_STEPS = [
  {
    n: "01",
    title: "Create",
    body: "Start a session and connect to your sound system.",
    icon: Play,
  },
  {
    n: "02",
    title: "Share",
    body: "Friends join instantly via link—no app required.",
    icon: Share2,
  },
  {
    n: "03",
    title: "Vote",
    body: "The crowd upvotes, and the most popular song plays next automatically.",
    icon: ThumbsUp,
  },
] as const;

const ATMOSPHERE = [
  {
    title: "Modern Lounges",
    body: "Set the mood without micromanaging the aux—guests shape the room in real time.",
    icon: Armchair,
  },
  {
    title: "Private Parties",
    body: "Share one link and let the crowd build the playlist while you host the night.",
    icon: Disc3,
  },
  {
    title: "Creative Studios",
    body: "Keep sessions flowing with a democratic queue that stays on beat with the work.",
    icon: Mic2,
  },
] as const;

export default function Home() {
  const router = useRouter();

  const goSession = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/session/${id}`);
  };

  return (
    <div className="landing-page landing-page--reference">
      <div className="landing-bg-streaks" aria-hidden>
        <div className="landing-bg-streak landing-bg-streak--a" />
        <div className="landing-bg-streak landing-bg-streak--b" />
      </div>

      <nav className="landing-nav" aria-label="Primary">
        <a href="/" className="landing-logo landing-logo--light">
          <span className="landing-logo-mark">UpNext</span>
          <span className="landing-logo-plus" aria-hidden>
            +
          </span>
        </a>

        <div className="landing-nav-right">
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How to</a>
            <a href="#account">Account</a>
          </div>
          <button type="button" className="landing-btn-pill landing-btn-pill--sm" onClick={goSession}>
            Get UpNext
          </button>
        </div>
      </nav>

      <main>
        <section className="landing-hero landing-hero--refgrid" aria-label="Hero">
          <div className="landing-hero-ref__figure" aria-hidden>
            <div className="landing-hero-ref__figure-glow" />
            <Image
              src="/hero_img.png"
              alt=""
              width={720}
              height={900}
              className="landing-hero-ref__img"
              priority
              sizes="(max-width: 960px) 100vw, 52vw"
            />
          </div>

          <div className="landing-hero-ref__main">
            <div className="landing-hero-ref__copy">
              <h1 className="landing-hero-title landing-hero-title--refgrid">
                Your Crowd,
                <br />
                Your Playlist.
              </h1>
              <p className="landing-hero-sub landing-hero-sub--refgrid">
                Empower your guests to collectively curate the soundtrack. Share a link, add songs, and watch the
                next track instantly rise to the top.
              </p>
              <div className="landing-hero-cta landing-hero-cta--row landing-hero-cta--refgrid">
                <button type="button" className="landing-btn-pill landing-btn-pill--lg" onClick={goSession}>
                  Launch a Session
                </button>
              </div>
            </div>
            <div className="landing-hero-ref__queue">
              <LandingSessionFeedCard
                title="Collaborative Queue"
                tracks={HERO_QUEUE_TRACKS}
                showLivePulse={false}
                className="landing-hero-queue-card"
              />
            </div>
          </div>
        </section>

        <section className="landing-section landing-evolve" id="features" aria-labelledby="landing-evolve-heading">
          <div className="landing-evolve-streaks" aria-hidden>
            <div className="landing-evolve-streak landing-evolve-streak--one" />
            <div className="landing-evolve-streak landing-evolve-streak--two" />
          </div>
          <div className="landing-section-inner">
            <h2 id="landing-evolve-heading" className="landing-section-title landing-section-title--center">
              Watch the Queue Evolve
            </h2>
            <LandingQueueEvolve />
          </div>
        </section>

        <section className="landing-section landing-how-redesign" id="how" aria-labelledby="landing-how-heading">
          <div className="landing-section-inner">
            <h2 id="landing-how-heading" className="landing-section-title landing-section-title--center">
              How It Works
            </h2>
            <div className="landing-how-two-col">
              <div className="landing-how-two-col__nums" aria-hidden>
                {HOW_STEPS.map((step) => (
                  <span key={step.n} className="landing-how-two-col__big-num">
                    {step.n}.
                  </span>
                ))}
              </div>
              <ol className="landing-how-two-col__steps">
                {HOW_STEPS.map((step) => (
                  <li key={step.n} className="landing-how-two-col__card">
                    <div className="landing-how-two-col__card-copy">
                      <h3 className="landing-how-two-col__card-title">
                        {step.n}. {step.title}:
                      </h3>
                      <p className="landing-how-two-col__card-body">{step.body}</p>
                    </div>
                    <div className="landing-how-two-col__card-icon glass-panel-icon">
                      <step.icon strokeWidth={1.5} size={26} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="landing-section landing-atmosphere" aria-labelledby="landing-atmosphere-heading">
          <div className="landing-atmosphere-streak-wrap" aria-hidden>
            <div className="landing-atmosphere-streak landing-atmosphere-streak--ambient" />
            <div className="landing-atmosphere-streak landing-atmosphere-streak--beam" />
          </div>
          <div className="landing-section-inner">
            <h2 id="landing-atmosphere-heading" className="landing-section-title landing-section-title--center">
              Elevate Any Atmosphere
            </h2>
            <div className="landing-atmosphere-grid">
              {ATMOSPHERE.map(({ title, body, icon: Icon }) => (
                <article key={title} className="landing-atmosphere-card glass-panel">
                  <div className="landing-atmosphere-card__icon">
                    <Icon strokeWidth={1.4} size={28} />
                  </div>
                  <h3 className="landing-atmosphere-card__title">{title}</h3>
                  <p className="landing-atmosphere-card__body">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-cta-band landing-cta-band--reference" aria-labelledby="landing-cta-heading">
          <div className="landing-cta-band-inner">
            <h2 id="landing-cta-heading" className="landing-cta-band-title">
              Take Control of the Soundtrack
            </h2>
            <div className="landing-hero-cta landing-hero-cta--row landing-cta-band-actions">
              <button type="button" className="landing-btn-pill landing-btn-pill--lg" onClick={goSession}>
                Launch a Session
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer landing-footer--reference" id="account">
        <div className="landing-footer-inner landing-footer-inner--reference">
          <nav className="landing-footer-links landing-footer-links--primary" aria-label="Footer">
            <a href="#features">Features</a>
            <a href="#how">How To</a>
            <a href="#account">Account</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </nav>
          <div className="landing-footer-social" aria-label="Social">
            <a href="https://twitter.com" className="landing-footer-social__link" aria-label="Twitter">
              <Bird size={20} strokeWidth={1.75} />
            </a>
            <a href="https://instagram.com" className="landing-footer-social__link" aria-label="Instagram">
              <Camera size={20} strokeWidth={1.75} />
            </a>
            <a href="https://youtube.com" className="landing-footer-social__link" aria-label="YouTube">
              <Tv size={20} strokeWidth={1.75} />
            </a>
          </div>
        </div>
        <p className="landing-footer-copy landing-footer-copy--center">© 2026 UpNext. All rights reserved.</p>
      </footer>
    </div>
  );
}
