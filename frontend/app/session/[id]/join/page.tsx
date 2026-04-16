"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UpNextWordmark } from "../../../components/UpNextWordmark";
import { use, useMemo, useState, FormEvent } from "react";
import { api } from "../../../lib/api";
import { queryKeys } from "../../../lib/queryKeys";
import { getOrCreateGuestUserId, setStoredDisplayName } from "../../../lib/sessionIdentity";

export default function JoinRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState("");
  const joinCode = id.toUpperCase();
  const sessionQuery = useQuery({
    queryKey: queryKeys.sessionByCode(joinCode),
    queryFn: () => api.getSessionByCode(joinCode),
    enabled: joinCode.length === 6,
  });

  const handleJoin = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !sessionQuery.data?.session.id) return;

    setStoredDisplayName(trimmed);
    getOrCreateGuestUserId();
    router.push(`/session/${sessionQuery.data.session.id}`);
  };

  const view = useMemo(
    () => ({
      listenerCount: 0,
      hostName: sessionQuery.data?.session.host?.displayName?.trim() || "Host",
      roomName: `Room ${joinCode}`,
      ...sessionQuery.data?.session,
    }),
    [joinCode, sessionQuery.data?.session],
  );

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col items-center justify-center relative overflow-hidden selection:bg-primary selection:text-on-primary">
      {/* Digital Nebula Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary blur-[120px] opacity-40 pointer-events-none"></div>
        <div className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] rounded-full bg-secondary blur-[120px] opacity-40 pointer-events-none"></div>
        <div className="absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] rounded-full bg-primary-container blur-[120px] opacity-40 pointer-events-none"></div>
      </div>

      {/* Top Bar (Shared Component Reference) */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-8">
        <UpNextWordmark className="font-headline" />
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-neutral-400">group</span>
          <span className="text-neutral-400 text-sm font-medium">{view.listenerCount} Listeners online</span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="relative z-10 w-full max-w-2xl px-8 flex flex-col items-center text-center">
        {/* Live Indicator */}
        <div className="flex items-center gap-2 mb-8 bg-surface-container-highest/40 backdrop-blur-xl px-4 py-2 rounded-full border border-outline-variant/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-bold tracking-widest uppercase text-on-surface-variant font-label">Happening Now</span>
        </div>

        {/* Editorial Title */}
        <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter mb-12 text-on-surface leading-[0.9]">
          The session <br />is <span className="text-primary">live.</span>
        </h1>

        {/* Host Context Card (Asymmetric Layout) */}
        <div className="w-full flex justify-end mb-16">
          <div className="bg-surface-container-low/60 backdrop-blur-2xl p-6 rounded-lg flex items-center gap-4 max-w-xs text-left transform translate-x-4 rotate-1">
            <div className="relative">
              <img 
                alt="Host Avatar" 
                className="w-14 h-14 rounded-full object-cover" 
                src="/host_img.png" 
              />
              <div className="absolute -bottom-1 -right-1 bg-primary w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-[10px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              </div>
            </div>
            <div>
              <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-label mb-1">Session Host</p>
              <p className="font-headline text-lg font-bold leading-none">{view.roomName}</p>
              <p className="text-neutral-500 text-xs">Curated by {view.hostName}</p>
            </div>
          </div>
        </div>

        {/* Entry Form */}
        <form onSubmit={handleJoin} className="w-full max-w-md space-y-6">
          <div className="relative group">
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-none text-center text-2xl font-body placeholder:text-neutral-400 text-on-surface focus:ring-0 focus:shadow-[0_0_20px_-5px_rgba(255,144,109,0.3)] transition-all duration-300 py-4 outline-none" 
              placeholder="Enter your name to join" 
              type="text" 
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-outline-variant/30 group-focus-within:w-full group-focus-within:bg-primary transition-all duration-700"></div>
          </div>
          <button 
            type="submit"
            disabled={sessionQuery.isPending || !sessionQuery.data}
            className="w-full py-5 rounded-md font-headline font-bold text-lg text-on-primary-container bg-gradient-to-br from-[#ff906d] to-[#ee8361] shadow-[0_10px_40px_-10px_rgba(255,144,109,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            {sessionQuery.isPending ? "Checking room..." : "Enter the Gallery"}
          </button>
          {sessionQuery.error ? (
            <p className="text-xs font-label uppercase tracking-widest text-error">Session not found for code {joinCode}</p>
          ) : null}
          <p className="text-neutral-500 text-xs font-label uppercase tracking-widest pt-4">
            No account required to listen
          </p>
        </form>
      </main>

      {/* Footer Decoration (Atmospheric Tonal Transition) */}
      <footer className="fixed bottom-0 w-full h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none z-0"></footer>

      {/* Bottom Action Hint */}
      <div className="fixed bottom-12 flex flex-col items-center gap-2 text-neutral-600 z-20">
        <span className="text-[10px] font-label uppercase tracking-[0.3em]">Experience Immersive Audio</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-neutral-600 to-transparent"></div>
      </div>
    </div>
  );
}
