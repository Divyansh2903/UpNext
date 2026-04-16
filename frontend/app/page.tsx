"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { UpNextWordmark } from "./components/UpNextWordmark";
import { extractJoinCodeFromInput } from "./lib/joinCode";
import { HOME_HERO_MOCK } from "./mocks/home";

export default function Home() {
  const router = useRouter();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinCodeError, setJoinCodeError] = useState<string | null>(null);

  const goGetStarted = () => {
    router.push("/session/demo/host");
  };

  const openJoinModal = () => {
    setJoinCodeInput("");
    setJoinCodeError(null);
    setJoinModalOpen(true);
  };

  const submitJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    const code = extractJoinCodeFromInput(joinCodeInput);
    if (!code) {
      setJoinCodeError("Enter a 6-character room code or paste your invite link.");
      return;
    }
    setJoinCodeError(null);
    router.push(`/session/${code}/join`);
    setJoinModalOpen(false);
  };

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] font-headline tracking-tight">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <UpNextWordmark />
          <div className="hidden md:flex items-center gap-10">
            <button type="button" className="text-neutral-400 hover:text-neutral-100 transition-colors font-medium">Features</button>
            <button type="button" className="text-neutral-400 hover:text-neutral-100 transition-colors font-medium">How It Works</button>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={goGetStarted}
              className="cta-gradient text-on-primary-fixed px-6 py-2.5 rounded-full font-extrabold text-sm scale-95 active:scale-90 transition-transform shadow-lg shadow-primary/10">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden hero-gradient">
          <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 z-10">
              <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                Play what the <br/> <span className="text-primary italic">crowd</span> wants.
              </h1>
              <p className="text-on-surface-variant text-xl max-w-xl mb-10 leading-relaxed font-body">
                Democratic audio for modern spaces. A real-time collaborative queue where every listener is a curator. 
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={goGetStarted}
                  className="cta-gradient text-on-primary-fixed px-10 py-4 rounded-full font-black text-lg hover:brightness-110 transition-all shadow-xl shadow-primary/20 font-headline">
                  Get Started
                </button>
                <button
                  type="button"
                  onClick={openJoinModal}
                  className="bg-surface-container-highest border border-outline-variant/15 text-on-surface px-10 py-4 rounded-full font-bold text-lg hover:bg-surface-container-high transition-all font-headline"
                >
                  Join Link
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              {/* Collaborative Audio Card Mockup */}
              <div className="glass-panel p-6 rounded-3xl shadow-2xl relative z-10 transform lg:rotate-3 border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-headline font-black text-secondary uppercase tracking-wider">{HOME_HERO_MOCK.liveSessionLabel}</span>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-surface-container bg-tertiary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-surface-container bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-surface-container bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">{HOME_HERO_MOCK.listenerBadge}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-primary/10 border border-primary/20">
                    <div className="w-16 h-16 rounded-xl bg-neutral-800 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-full h-full object-cover"
                        alt="Album artwork for the now playing track"
                        src={HOME_HERO_MOCK.nowPlaying.imageUrl}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black truncate font-headline">{HOME_HERO_MOCK.nowPlaying.title}</p>
                      <p className="text-xs text-on-surface-variant font-medium">{HOME_HERO_MOCK.nowPlaying.status}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      <span className="text-xs font-bold text-primary">{HOME_HERO_MOCK.nowPlaying.votes}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 rounded-2xl bg-surface-container-low border border-outline-variant/10 opacity-80">
                    <div className="w-16 h-16 rounded-xl bg-neutral-800 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="w-full h-full object-cover" alt="close up of a professional dj deck with glowing led lights in a dark nightclub setting" src={HOME_HERO_MOCK.upNext.imageUrl}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black truncate font-headline">{HOME_HERO_MOCK.upNext.title}</p>
                      <p className="text-xs text-on-surface-variant font-medium text-body">{HOME_HERO_MOCK.upNext.status}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="material-symbols-outlined text-on-surface-variant">favorite</span>
                      <span className="text-xs font-bold text-on-surface-variant">{HOME_HERO_MOCK.upNext.votes}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary/10 rounded-full blur-[80px]"></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-tertiary/10 rounded-full blur-[60px]"></div>
            </div>
          </div>
        </section>

        {/* Redesigned Bento Grid Features */}
        <section className="py-32 px-8 max-w-7xl mx-auto relative overflow-visible">
          <div className="volumetric-streak right-[5%] top-20 h-[800px] z-0 opacity-40"></div>
          
          <div className="mb-20 text-center relative z-10">
            <h2 className="font-public text-4xl md:text-5xl font-black mb-4 tracking-tight">Built for the Vibe.</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg font-medium font-body">Simplified tools designed to keep the energy high and the music moving.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            {/* The Crowd Decides */}
            <div className="md:col-span-8 heavy-glass rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden relative group hover:border-white/20 transition-all duration-500">
              <div className="flex items-start justify-between relative z-10">
                <div className="max-w-md">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-primary text-3xl icon-glow-primary">groups</span>
                  </div>
                  <h3 className="text-3xl font-public font-black mb-4 tracking-tight">The Crowd Decides</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed font-body">The vibe evolves based on what everyone loves right now. Guests vote on the queue, and tracks with the most hype naturally rise to the top.</p>
                </div>
                <div className="hidden lg:flex flex-col gap-3 w-48 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="h-10 w-full bg-primary/20 rounded-full border border-primary/30"></div>
                  <div className="h-10 w-[85%] bg-white/5 rounded-full border border-white/10"></div>
                  <div className="h-10 w-[70%] bg-white/5 rounded-full border border-white/10"></div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Zero Friction */}
            <div className="md:col-span-4 heavy-glass rounded-[2.5rem] p-10 flex flex-col justify-between relative group hover:border-white/20 transition-all duration-500">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-secondary text-3xl icon-glow-secondary">bolt</span>
                </div>
                <h3 className="text-2xl font-public font-black mb-4 tracking-tight">Zero Friction</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed font-body">Guests are in the mix in seconds. No apps to download, no accounts to set up—just scan and curate.</p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-secondary tracking-widest uppercase font-label">
                <span className="w-1 h-1 rounded-full bg-secondary"></span>
                Instant Access
              </div>
            </div>

            {/* Endless Choice */}
            <div className="md:col-span-4 heavy-glass rounded-[2.5rem] p-10 flex flex-col justify-between relative group hover:border-white/20 transition-all duration-500">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center mb-8">
                  <span className="material-symbols-outlined text-tertiary text-3xl icon-glow-tertiary">smart_display</span>
                </div>
                <h3 className="text-2xl font-public font-black mb-4 tracking-tight">Endless Choice</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed font-body">Full YouTube integration means millions of tracks are at your fingertips. If it&apos;s on YouTube, it&apos;s on UpNext.</p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-8 w-8 bg-white/5 rounded flex items-center justify-center border border-white/10 opacity-50 font-label">YT</div>
                <div className="h-8 w-24 bg-white/5 rounded-full border border-white/10"></div>
              </div>
            </div>

            {/* Total Control */}
            <div className="md:col-span-8 heavy-glass rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden relative group hover:border-white/20 transition-all duration-500">
              <div className="flex items-start justify-between relative z-10">
                <div className="max-w-md">
                  <div className="w-14 h-14 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center mb-8">
                    <span className="material-symbols-outlined text-error text-3xl icon-glow-error">shield_person</span>
                  </div>
                  <h3 className="text-3xl font-public font-black mb-4 tracking-tight">Total Control</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed font-body">You&apos;re the ultimate moderator. Set session boundaries, skip tracks, and maintain the perfect vibe while the crowd handles the energy.</p>
                </div>
                <div className="hidden lg:block relative">
                  <div className="w-40 h-40 bg-error/10 rounded-full flex items-center justify-center border border-error/20">
                    <span className="material-symbols-outlined text-6xl text-error/30">tune</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-error/5 rounded-full blur-[100px]"></div>
            </div>
          </div>
        </section>

        {/* Redesigned Join the Vibe Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="volumetric-streak left-[10%] top-[-100px] h-[1000px] z-0 opacity-20"></div>
          
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="relative rounded-[3rem] overflow-hidden heavy-glass shadow-2xl border-white/5 group">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 md:p-20 flex flex-col justify-center">
                  <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-primary/30 w-fit font-label">Host-Driven Audio</span>
                  <h2 className="font-public text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white leading-[1.1]">Take the lead. <br/> Start your room.</h2>
                  <p className="text-lg text-neutral-400 font-medium max-w-lg mb-12 font-body">Launch a private session and invite your group to curate the soundtrack. Real-time democratic audio for your exclusive space.</p>
                  
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/5">
                      <div className="p-3 bg-primary rounded-xl">
                        <span className="material-symbols-outlined text-black font-black">add</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-label">Host Mode</p>
                        <p className="font-public font-black text-white">READY TO LAUNCH</p>
                      </div>
                    </div>
                    <button 
                      onClick={goGetStarted}
                      className="text-white font-bold hover:text-primary transition-colors flex items-center gap-2 group/btn font-headline">
                      Get Started <span className="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                    </button>
                  </div>
                </div>
                <div className="relative h-80 lg:h-auto overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="A premium, high-quality visual of a collaborative music queue interface with atmospheric lighting." src="https://lh3.googleusercontent.com/aida/ADBb0ugzwnpijLP4m1gpTnknODuG3x-jaJDDh6_l-uJfIzvjf617eWJoQXLfnRL6M8YCLBVrxPHG-x0lSM8RAGqPDuT_4c2iG7PwK1LMfTWgdj4kmXnhY_i56sI_86FDSPpgPdZjOIwofZxLsZxugJIWVRGKowYN0swcXfFZ1Jv_SYS5WgbkSAmWoFImH1OM7il6VFi2-7I2aEVBmPzNnBWSBGSUD9szQQvCBk3cN5fcrXKnOMutu_1-23lFZI9r"/>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works (Transitioned with Streaks) */}
        <section className="py-32 bg-surface-container-lowest relative overflow-hidden">
          <div className="volumetric-streak right-[15%] bottom-[-200px] h-[800px] opacity-30"></div>
          
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-24">
              <h2 className="font-public text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">From Setup to Session in 30 Seconds.</h2>
              <p className="text-on-surface-variant text-lg max-w-2xl mx-auto font-medium font-body">The simplest way to bring democratic audio to your space.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Step 1 */}
              <div className="relative group">
                <div className="text-8xl font-public font-black text-outline-variant/10 absolute -top-12 -left-4 group-hover:text-primary/20 transition-colors">1</div>
                <div className="relative z-10 pt-8">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center mb-8 shadow-xl">
                    <span className="material-symbols-outlined text-primary text-3xl icon-glow-primary">add_circle</span>
                  </div>
                  <h4 className="text-2xl font-public font-black mb-4 tracking-tight">Create</h4>
                  <p className="text-on-surface-variant font-medium leading-relaxed font-body">Launch your live session room with a single click. No host registration or complex setup required to start.</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative group">
                <div className="text-8xl font-public font-black text-outline-variant/10 absolute -top-12 -left-4 group-hover:text-secondary/20 transition-colors">2</div>
                <div className="relative z-10 pt-8">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center mb-8 shadow-xl">
                    <span className="material-symbols-outlined text-secondary text-3xl icon-glow-secondary">share</span>
                  </div>
                  <h4 className="text-2xl font-public font-black mb-4 tracking-tight">Share</h4>
                  <p className="text-on-surface-variant font-medium leading-relaxed font-body">Instantly generate a unique link or QR code. Guests join the session anonymously from their own devices.</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative group">
                <div className="text-8xl font-public font-black text-outline-variant/10 absolute -top-12 -left-4 group-hover:text-tertiary/20 transition-colors">3</div>
                <div className="relative z-10 pt-8">
                  <div className="w-16 h-16 rounded-2xl bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center mb-8 shadow-xl">
                    <span className="material-symbols-outlined text-tertiary text-3xl icon-glow-tertiary">thumbs_up_down</span>
                  </div>
                  <h4 className="text-2xl font-public font-black mb-4 tracking-tight">Vote</h4>
                  <p className="text-on-surface-variant font-medium leading-relaxed font-body">Watch the queue evolve in real-time as your friends add tracks and vote. The best music always wins.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-8 text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="font-public text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">Ready to host your next <span className="text-primary italic">masterpiece?</span></h2>
            <p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto font-medium font-body">Join thousands of hosts using UpNext to transform the way they listen together.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={goGetStarted}
                className="cta-gradient text-on-primary-fixed px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition-transform shadow-2xl shadow-primary/30 font-headline">
                Get Started
              </button>
              <button className="bg-surface-container-highest border border-outline-variant/15 text-on-surface px-12 py-5 rounded-full font-black text-xl hover:bg-surface-container-high transition-all font-headline">
                View Demo
              </button>
            </div>
          </div>
          {/* Animated background pulses */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 w-full py-12 px-8 border-t border-neutral-800/15 font-body text-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="flex items-center font-headline font-black text-neutral-100">
            <UpNextWordmark variant="footer" as="span" />
          </div>
          <div className="flex gap-8 font-medium">
            <button type="button" className="text-neutral-500 hover:text-orange-300 transition-colors">Privacy</button>
            <button type="button" className="text-neutral-500 hover:text-orange-300 transition-colors">Terms</button>
            <button type="button" className="text-neutral-500 hover:text-orange-300 transition-colors">Support</button>
            <button type="button" className="text-neutral-500 hover:text-orange-300 transition-colors">Twitter</button>
            <button type="button" className="text-neutral-500 hover:text-orange-300 transition-colors">Instagram</button>
          </div>
          <div className="text-neutral-500 font-medium">
            © 2026 UpNext.
          </div>
        </div>
      </footer>

      {joinModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-surface-container-low p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-headline text-2xl font-black">Join a room</h2>
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-neutral-300 hover:bg-surface-container-highest"
                onClick={() => setJoinModalOpen(false)}
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[22px] leading-none">close</span>
              </button>
            </div>
            <p className="mb-4 text-sm text-neutral-400">Type the 6-character room code, or paste a link.</p>
            <form onSubmit={submitJoinRoom} className="space-y-4">
              <input
                autoFocus
                className="w-full rounded-md border border-outline-variant/20 bg-surface-container-high px-3 py-3 font-mono text-lg uppercase tracking-widest text-on-surface outline-none focus:border-primary/50"
                placeholder="e.g. ABC123"
                maxLength={12}
                value={joinCodeInput}
                onChange={(e) => {
                  setJoinCodeInput(e.target.value);
                  setJoinCodeError(null);
                }}
                aria-invalid={Boolean(joinCodeError)}
                aria-describedby={joinCodeError ? "join-code-error" : undefined}
              />
              {joinCodeError ? (
                <p id="join-code-error" className="text-xs text-error">
                  {joinCodeError}
                </p>
              ) : null}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="rounded-md bg-surface-container-high px-4 py-2 text-sm font-semibold hover:bg-surface-container-highest transition-colors"
                  onClick={() => setJoinModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white hover:brightness-110 transition-colors"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
