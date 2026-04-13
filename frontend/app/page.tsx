"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LandingLiveQueueSection } from "./components/LandingLiveQueue";
import "./landing.css";

function LandingSwoosh() {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="landing-hero-swoosh"
      viewBox="0 0 520 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <filter
          id="landing-swoosh-glow"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient
          id="landing-swoosh-grad"
          x1="420"
          y1="340"
          x2="40"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff3a00" stopOpacity="0" />
          <stop offset="0.35" stopColor="#ff6a2d" stopOpacity="0.95" />
          <stop offset="0.72" stopColor="#ffb48a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff4e8" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        d="M 455 352 C 340 318 260 248 198 168 C 152 108 118 52 86 14"
        stroke="url(#landing-swoosh-grad)"
        strokeWidth="2.25"
        strokeLinecap="round"
        filter="url(#landing-swoosh-glow)"
      />
    </motion.svg>
  );
}

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const manParallaxY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroCopyY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const heroCopyOpacity = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.8, 0]);

  const goSession = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/session/${id}`);
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav" aria-label="Primary">
        <div className="landing-logo">
          UpNext
          <span className="landing-logo-dot" aria-hidden />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem, 2.5vw, 1.75rem)" }}>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
            <span className="landing-nav-divider" aria-hidden />
            <button type="button" className="link">
              Sign In
            </button>
          </div>
          <button type="button" className="landing-btn-pill landing-btn-pill--sm" onClick={goSession}>
            Get Started
          </button>
        </div>
      </nav>

      <section ref={heroRef} className="landing-hero" aria-label="Hero">
        <motion.div 
          className="landing-hero-glow-main" 
          initial={{ opacity: 0, scale: 0.8 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }} 
          aria-hidden 
        />
        <motion.div 
          className="landing-hero-glow-soft" 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.5 }} 
          aria-hidden 
        />
        <LandingSwoosh />

        <div className="landing-hero-stage">
          <motion.div className="landing-hero-man-wrap" style={{ y: manParallaxY }} aria-hidden>
            <motion.div
              initial={{ opacity: 0, y: 80, filter: "blur(12px)", scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              style={{ display: "flex", height: "100%", width: "100%", alignItems: "flex-end" }}
            >
              <Image
                src="/man.png"
                alt=""
                width={300}
                height={429}
                priority
                sizes="(max-width: 900px) 55vw, 520px"
                className="landing-hero-man"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="landing-hero-inner"
            style={{ y: heroCopyY, opacity: heroCopyOpacity }}
          >
            <motion.h1
              className="landing-hero-title"
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <span className="title-bionic">Bionic</span>
              <br />
              <span className="listening-line">
                <span className="char-l">l</span>
                <span className="char-rest">istening</span>
              </span>
            </motion.h1>

            <motion.p
              className="landing-hero-sub"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            >
              The real-time collaborative music queue. Connect to speakers, share the link, and let your friends
              upvote what plays next.
            </motion.p>

            <motion.div
              className="landing-hero-cta"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            >
              <button type="button" className="landing-btn-pill landing-btn-pill--lg" onClick={goSession}>
                Host a Session
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <LandingLiveQueueSection />
    </div>
  );
}
