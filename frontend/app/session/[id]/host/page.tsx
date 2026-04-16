"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { YouTubePlayer } from "../../../components/YouTubePlayer";
import { UpNextWordmark } from "../../../components/UpNextWordmark";
import { api } from "../../../lib/api";
import { queryKeys } from "../../../lib/queryKeys";
import type { HostSessionSummaryResponse } from "../../../lib/types";
import {
  clearStoredHostAuth,
  getStoredHostDisplayName,
  getStoredHostToken,
  setStoredHostAuth,
} from "../../../lib/sessionIdentity";
import { cn } from "../../../lib/utils";
import { SessionProvider, useSessionState } from "../SessionProvider";

type PlayedSong = {
  key: string;
  title: string;
  author: string;
  thumbnail: string;
  playedAt: string;
};

export default function HostViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [hostDisplayName, setHostDisplayName] = useState("Host");
  const [isHydrated, setIsHydrated] = useState(false);
  const joinCodeFromQuery = searchParams.get("code")?.toUpperCase() ?? "";
  const joinCodeFromStorage =
    typeof window !== "undefined" ? window.localStorage.getItem(`upnext.host.joinCode.${id}`)?.toUpperCase() ?? "" : "";
  const resolvedJoinCode = joinCodeFromQuery || joinCodeFromStorage || id.slice(0, 6).toUpperCase();
  const joinCodeOk = resolvedJoinCode.length === 6;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(getStoredHostToken());
    setHostDisplayName(getStoredHostDisplayName() || "Host");
    setIsHydrated(true);
  }, []);

  const publicSessionQuery = useQuery({
    queryKey: queryKeys.sessionByCode(resolvedJoinCode),
    queryFn: () => api.getSessionByCode(resolvedJoinCode),
    enabled: isHydrated && Boolean(token) && id !== "demo" && joinCodeOk,
    retry: false,
  });

  const needHostSummary =
    Boolean(token) &&
    id !== "demo" &&
    (!joinCodeOk || (joinCodeOk && publicSessionQuery.isFetched && publicSessionQuery.isError));

  const summaryQuery = useQuery({
    queryKey: queryKeys.hostSessionSummary(id),
    queryFn: () => api.getHostSessionSummary(token!, id),
    enabled: isHydrated && needHostSummary,
    staleTime: 5 * 60 * 1000,
  });

  if (!isHydrated) {
    return <HostBootState />;
  }

  if (id === "demo") {
    return <HostEntryPage token={token} onAuth={setToken} />;
  }

  if (!token) {
    return <HostAuthGate onAuth={setToken} errorMessage="Please login as host to access this dashboard." />;
  }

  if (joinCodeOk && publicSessionQuery.isPending) {
    return <HostBootState message="Opening room…" />;
  }

  if (joinCodeOk && publicSessionQuery.isSuccess) {
    return (
      <SessionProvider
        sessionId={id}
        joinCode={resolvedJoinCode}
        hostName="Host"
        roomName="Host Room"
        token={token}
        initialDisplayName={hostDisplayName}
      >
        <HostViewPageInner id={id} token={token} joinCode={resolvedJoinCode} />
      </SessionProvider>
    );
  }

  if (summaryQuery.isPending && !summaryQuery.data) {
    return <HostBootState message="Opening room…" />;
  }

  if (summaryQuery.isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-on-surface">
        <p className="mb-4 text-center text-sm text-neutral-400">Could not load this session.</p>
        <button
          type="button"
          onClick={() => router.replace("/session/demo/host")}
          className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-white"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  if (summaryQuery.data && !summaryQuery.data.session.active) {
    return <EndedHostSessionRecap summary={summaryQuery.data} />;
  }

  return (
    <SessionProvider
      sessionId={id}
      joinCode={resolvedJoinCode}
      hostName="Host"
      roomName="Host Room"
      token={token}
      initialDisplayName={hostDisplayName}
    >
      <HostViewPageInner id={id} token={token} joinCode={resolvedJoinCode} />
    </SessionProvider>
  );
}

function HostBootState({ message }: { message?: string } = {}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
      <div className="rounded-xl bg-surface-container-low p-8 text-center">
        <p className="text-sm text-neutral-400 mb-3">{message ?? "Loading host dashboard…"}</p>
        <div className="h-6 w-6 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );
}

function EndedHostSessionRecap({ summary }: { summary: HostSessionSummaryResponse }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <main className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
        <section className="rounded-xl border border-outline-variant/10 bg-surface-container-low/60 p-6 backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Session Ended</p>
              <h1 className="mt-2 font-headline text-3xl font-black tracking-tight">Room {summary.session.joinCode}</h1>
              <p className="mt-1 text-sm text-neutral-400">Ended at {new Date(summary.session.expiresAt).toLocaleString()}</p>
            </div>
            <button
              type="button"
              onClick={() => router.replace("/session/demo/host")}
              className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Back to dashboard
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-outline-variant/10 bg-surface-container-low/60 p-6 backdrop-blur-2xl">
          <h2 className="font-headline text-xl font-black">Members Joined</h2>
          {summary.participants.length ? (
            <div className="mt-4 space-y-2">
              {summary.participants.map((participant, idx) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between rounded-lg bg-surface-container-high/60 px-4 py-3"
                >
                  <p className="flex min-w-0 items-baseline gap-2 text-sm font-semibold text-on-surface">
                    <span className="shrink-0 tabular-nums font-normal text-neutral-500">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 truncate">{participant.name}</span>
                  </p>
                  <span className="text-xs text-neutral-500">
                    {new Date(participant.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-neutral-500">No participants joined this session.</p>
          )}
        </section>

        <section className="rounded-xl border border-outline-variant/10 bg-surface-container-low/60 p-6 backdrop-blur-2xl">
          <h2 className="font-headline text-xl font-black">Songs Played</h2>
          {summary.songs.length ? (
            <div className="mt-4 space-y-2">
              {summary.songs.map((song, idx) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between rounded-lg bg-surface-container-high/60 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="flex min-w-0 items-baseline gap-2 truncate text-sm font-semibold text-on-surface">
                      <span className="shrink-0 tabular-nums font-normal text-neutral-500">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 truncate">{song.title}</span>
                    </p>
                    <p className="truncate text-xs text-neutral-500">Added by {song.addedBy}</p>
                  </div>
                  <span className="shrink-0 text-xs text-neutral-400">{song.votes} votes</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-neutral-500">No songs were played in this session.</p>
          )}
        </section>
      </main>
    </div>
  );
}

function HostEntryPage({ token, onAuth }: { token: string | null; onAuth: (token: string) => void }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [createError, setCreateError] = useState<string | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const meQuery = useQuery({
    queryKey: queryKeys.authMe,
    queryFn: () => api.me(token!),
    enabled: Boolean(token),
  });
  const sessionsQuery = useQuery({
    queryKey: queryKeys.hostSessions,
    queryFn: () => api.getHostSessions(token!),
    enabled: Boolean(token),
    retry: 1,
  });
  const createSessionMutation = useMutation({
    mutationFn: (hostToken: string) => api.createSession(hostToken),
    onSuccess: (response) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`upnext.host.joinCode.${response.session.id}`, response.session.joinCode.toUpperCase());
      }
      router.replace(`/session/${response.session.id}/host?code=${response.session.joinCode}`);
    },
    onError: (err) => {
      const message = (err as Error).message;
      if (message === "HostNotFound" || message === "Unauthorized") {
        clearStoredHostAuth();
        onAuth("");
        setCreateError("Your host session expired. Please login again.");
        return;
      }
      setDashboardError("Could not create a session. Please retry.");
    },
  });

  useEffect(() => {
    if (!token || !sessionsQuery.data?.sessions?.length) return;
    for (const s of sessionsQuery.data.sessions) {
      if (!s.active) {
        void queryClient.prefetchQuery({
          queryKey: queryKeys.hostSessionSummary(s.id),
          queryFn: () => api.getHostSessionSummary(token, s.id),
          staleTime: 5 * 60 * 1000,
        });
      }
    }
  }, [token, sessionsQuery.data?.sessions, queryClient]);

  if (!token) {
    return <HostAuthGate onAuth={onAuth} errorMessage={createError} />;
  }

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col relative overflow-hidden selection:bg-primary selection:text-on-primary">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary blur-[120px] opacity-30 pointer-events-none" />
        <div className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] rounded-full bg-secondary blur-[120px] opacity-30 pointer-events-none" />
      </div>

      <header className="relative z-10 border-b border-outline-variant/10">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <UpNextWordmark className="font-headline" />
          <button
            type="button"
            onClick={() => {
              clearStoredHostAuth();
              onAuth("");
            }}
            className="rounded-md bg-surface-container-high px-4 py-2 text-sm font-semibold hover:bg-surface-container-highest transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-10 space-y-8">
        <section className="rounded-xl bg-surface-container-low/70 p-6 md:p-8 backdrop-blur-2xl border border-outline-variant/10">
          <p className="text-xs uppercase tracking-widest font-bold text-primary mb-3">Host dashboard</p>
          <h1 className="font-headline text-3xl md:text-5xl font-black tracking-tight mb-3">
            Welcome{meQuery.data?.user?.displayName ? `, ${meQuery.data.user.displayName}` : ""}.
          </h1>
          <p className="text-sm text-neutral-400 mb-6">Launch a new room or continue from one of your previous sessions.</p>
          <button
            type="button"
            className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-white hover:brightness-110 transition-all disabled:opacity-60"
            disabled={createSessionMutation.isPending}
            onClick={() => {
              setDashboardError(null);
              createSessionMutation.mutate(token);
            }}
          >
            {createSessionMutation.isPending ? "Creating..." : "Host a session"}
          </button>
          {dashboardError ? <p className="mt-3 text-xs text-error">{dashboardError}</p> : null}
        </section>

        <section className="rounded-xl bg-surface-container-low/60 p-6 backdrop-blur-2xl border border-outline-variant/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl font-black">Previous sessions</h2>
            {sessionsQuery.isFetching ? <span className="text-xs text-neutral-500">Refreshing...</span> : null}
          </div>
          {sessionsQuery.isLoading ? (
            <div className="py-6 flex items-center justify-center">
              <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : sessionsQuery.error ? (
            <div className="space-y-3">
              <p className="text-sm text-error">Could not load previous sessions.</p>
              <button
                type="button"
                className="rounded-md bg-surface-container-high px-4 py-2 text-sm font-semibold hover:bg-surface-container-highest"
                onClick={() => sessionsQuery.refetch()}
              >
                Retry
              </button>
            </div>
          ) : sessionsQuery.data?.sessions.length ? (
            <div className="space-y-3">
              {sessionsQuery.data.sessions.map((hostSession) => (
                <div
                  key={hostSession.id}
                  className="flex flex-col gap-3 rounded-lg bg-surface-container-high/60 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-headline text-lg font-bold tracking-tight">Room {hostSession.joinCode}</p>
                      {hostSession.active ? (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                          Live
                        </span>
                      ) : (
                        <span className="rounded-full bg-neutral-700/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
                          Ended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {hostSession.participantsCount} participants • {new Date(hostSession.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-md bg-surface px-4 py-2 text-sm font-bold hover:bg-surface-container-highest transition-colors"
                    onMouseEnter={() => {
                      if (hostSession.active || !token) return;
                      void queryClient.prefetchQuery({
                        queryKey: queryKeys.hostSessionSummary(hostSession.id),
                        queryFn: () => api.getHostSessionSummary(token, hostSession.id),
                        staleTime: 5 * 60 * 1000,
                      });
                    }}
                    onClick={() => router.push(`/session/${hostSession.id}/host?code=${hostSession.joinCode}`)}
                  >
                    {hostSession.active ? "Open dashboard" : "View room"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No previous sessions yet. Start your first one.</p>
          )}
        </section>
      </main>
    </div>
  );
}

function HostAuthGate({ onAuth, errorMessage }: { onAuth: (token: string) => void; errorMessage?: string | null }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);

  const authMutation = useMutation({
    mutationFn: (variables: { email: string; password: string; displayName?: string; signup: boolean }) =>
      variables.signup
        ? api.signup(variables.email, variables.password, variables.displayName ?? "")
        : api.login(variables.email, variables.password),
    onSuccess: (response) => {
      setStoredHostAuth(response.token, response.user.email, response.user.displayName ?? "Host");
      onAuth(response.token);
      queryClient.invalidateQueries({ queryKey: queryKeys.authMe }).catch(() => undefined);
    },
  });

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col items-center justify-center relative overflow-hidden selection:bg-primary selection:text-on-primary">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] rounded-full bg-secondary blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] rounded-full bg-primary-container blur-[120px] opacity-40 pointer-events-none" />
      </div>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-8">
        <UpNextWordmark className="font-headline" />
      </header>

      <main className="relative z-10 w-full max-w-xl px-8 flex flex-col items-center text-center">
        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter mb-6 text-on-surface leading-[0.95]">
          Sign in to start <span className="text-primary">hosting.</span>
        </h1>
        <p className="text-sm text-neutral-400 mb-10">Authenticate first, then create and control your live room.</p>
        {errorMessage ? <p className="text-xs font-label uppercase tracking-widest text-error mb-6">{errorMessage}</p> : null}

        <form
          className="w-full max-w-md space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email || !password) return;
            if (isSignupMode && !displayName.trim()) return;
            authMutation.mutate({ email, password, displayName: displayName.trim(), signup: isSignupMode });
          }}
        >
          {isSignupMode ? (
            <input
              className="w-full rounded-md border border-outline-variant/20 bg-surface-container-low/60 px-4 py-3 text-sm"
              type="text"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          ) : null}
          <input
            className="w-full rounded-md border border-outline-variant/20 bg-surface-container-low/60 px-4 py-3 text-sm"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded-md border border-outline-variant/20 bg-surface-container-low/60 px-4 py-3 text-sm"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-4 rounded-md font-headline font-bold text-base text-on-primary-container bg-gradient-to-br from-[#ff906d] to-[#ee8361] shadow-[0_10px_40px_-10px_rgba(255,144,109,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
          >
            {authMutation.isPending ? "Please wait..." : isSignupMode ? "Create host account" : "Login as host"}
          </button>
          <button
            type="button"
            onClick={() => setIsSignupMode((prev) => !prev)}
            className="w-full rounded-md bg-surface-container-high py-3 text-sm font-semibold hover:bg-surface-container-highest transition-colors"
          >
            {isSignupMode ? "Use existing account login" : "Need an account? Sign up"}
          </button>
          {authMutation.error ? (
            <p className="text-xs font-label uppercase tracking-widest text-error">{(authMutation.error as Error).message}</p>
          ) : null}
        </form>
      </main>
    </div>
  );
}

function HostAccessDeniedState({ sessionId, reason }: { sessionId: string; reason: string }) {
  const router = useRouter();

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col items-center justify-center relative overflow-hidden selection:bg-primary selection:text-on-primary">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 -right-1/4 w-[500px] h-[500px] rounded-full bg-secondary blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute -bottom-1/4 left-1/3 w-[700px] h-[700px] rounded-full bg-primary-container blur-[120px] opacity-40 pointer-events-none" />
      </div>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-8">
        <UpNextWordmark className="font-headline" />
      </header>

      <main className="relative z-10 w-full max-w-xl px-8 flex flex-col items-center text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-error/20 bg-error/10 px-4 py-2 backdrop-blur-xl">
          <span className="material-symbols-outlined text-sm text-error">lock</span>
          <span className="text-xs font-bold tracking-widest uppercase text-error font-label">Host Access Required</span>
        </div>

        <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter mb-6 text-on-surface leading-[0.95]">
          You are not the <span className="text-primary">host.</span>
        </h1>
        <p className="text-sm text-neutral-400 mb-10">
          This dashboard is restricted to the account that created this session.
        </p>
        <p className="text-xs font-label uppercase tracking-widest text-error mb-8">{reason}</p>

        <div className="w-full max-w-md space-y-3">
          <button
            type="button"
            onClick={() => {
              clearStoredHostAuth();
              router.replace("/session/demo/host");
            }}
            className="w-full py-4 rounded-md font-headline font-bold text-base text-on-primary-container bg-gradient-to-br from-[#ff906d] to-[#ee8361] shadow-[0_10px_40px_-10px_rgba(255,144,109,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300"
          >
            Login as host
          </button>
          <Link
            href={`/session/${sessionId}`}
            className="block w-full rounded-md bg-surface-container-high py-3 text-sm font-semibold hover:bg-surface-container-highest transition-colors"
          >
            Open participant view
          </Link>
        </div>
      </main>
    </div>
  );
}

function HostViewPageInner({
  id,
  token,
  joinCode,
}: {
  id: string;
  token: string;
  joinCode: string;
}) {
  const router = useRouter();
  const { session, participants, currentVideoId, playbackProgressPercent, sendSongEnded, sendPlaybackSync, error } =
    useSessionState();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState<"live" | "history" | "people">("live");
  const [playedSongs, setPlayedSongs] = useState<PlayedSong[]>([]);
  const hostAccessError = error === "HostAccessDenied" || error === "InvalidToken" ? error : null;
  const lastSyncRef = useRef<{ elapsedSeconds: number; paused: boolean } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPaused(false);
  }, [currentVideoId]);

  useEffect(() => {
    lastSyncRef.current = null;
  }, [currentVideoId]);

  useEffect(() => {
    const title = session.nowPlaying.title?.trim();
    if (!title || title.toLowerCase() === "now playing") return;

    const historyKey = `${session.nowPlaying.title}|${session.nowPlaying.author}|${session.nowPlaying.albumArtUrl}`;
    setPlayedSongs((prev) => {
      if (prev.length > 0 && prev[prev.length - 1]?.key === historyKey) {
        return prev;
      }
      const next = [
        ...prev,
        {
          key: historyKey,
          title: session.nowPlaying.title,
          author: session.nowPlaying.author,
          thumbnail: session.nowPlaying.albumArtUrl,
          playedAt: new Date().toISOString(),
        },
      ];
      return next.length > 60 ? next.slice(next.length - 60) : next;
    });
  }, [session.nowPlaying.albumArtUrl, session.nowPlaying.author, session.nowPlaying.title]);

  const meQuery = useQuery({
    queryKey: queryKeys.authMe,
    queryFn: () => api.me(token!),
    enabled: Boolean(token),
  });

  const queryClient = useQueryClient();

  const createSessionMutation = useMutation({
    mutationFn: (hostToken: string) => api.createSession(hostToken),
    onSuccess: (response) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`upnext.host.joinCode.${response.session.id}`, response.session.joinCode.toUpperCase());
      }
      router.replace(`/session/${response.session.id}/host?code=${response.session.joinCode}`);
    },
  });

  const stopSessionMutation = useMutation({
    mutationFn: () => api.stopSession(token, id),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(`upnext.host.joinCode.${id}`);
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.hostSessions });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessionByCode(joinCode) });
      queryClient.invalidateQueries({ queryKey: queryKeys.hostSessionSummary(id) });
      setIsSettingsOpen(false);
      router.replace("/session/demo/host");
    },
  });

  const invitePath = useMemo(() => `/session/${joinCode}/join`, [joinCode]);
  const sessionQuery = useQuery({
    queryKey: queryKeys.sessionByCode(joinCode),
    queryFn: () => api.getSessionByCode(joinCode),
    enabled: joinCode.length === 6,
  });
  const expiresAtLabel = useMemo(() => {
    const value = sessionQuery.data?.session.expiresAt;
    if (!value) return "Unknown";
    return new Date(value).toLocaleString();
  }, [sessionQuery.data?.session.expiresAt]);

  if (hostAccessError) {
    return (
      <HostAccessDeniedState
        sessionId={id}
        reason={hostAccessError === "InvalidToken" ? "Session expired. Please sign in again." : "This session belongs to another host account."}
      />
    );
  }

  const hostSidebarNav = (opts: { compact?: boolean } = {}) => {
    const { compact } = opts;
    const showSidebarLabels = compact || !sidebarCollapsed;

    const sidebarLabelCol = cn(
      "min-w-0 overflow-hidden text-left transition-[max-width,opacity] duration-300 ease-in-out motion-reduce:transition-none",
      showSidebarLabels ? "max-w-[min(13rem,calc(100vw-6rem))] opacity-100" : "max-w-0 opacity-0 pointer-events-none",
    );

    const navRowGrid = compact
      ? "grid w-full grid-cols-[2.5rem_minmax(0,1fr)] items-center rounded-r-xl py-3 pl-6 pr-4"
      : "grid w-full grid-cols-[2.5rem_minmax(0,1fr)] items-center rounded-r-xl py-3 pl-1 pr-1";

    return (
      <>
        {!compact && (
          <>
            <div className="grid w-full shrink-0 grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-3 pb-2 pl-1 pr-1 pt-3">
              <button
                type="button"
                onClick={() => setSidebarCollapsed(false)}
                className="flex h-10 w-10 items-center justify-center justify-self-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800/50 hover:text-orange-300"
                aria-expanded={!sidebarCollapsed}
                aria-label="Expand sidebar"
              >
                <span className="material-symbols-outlined text-[22px]">
                  {sidebarCollapsed ? "chevron_right" : "chevron_left"}
                </span>
              </button>
              <div className={sidebarLabelCol}>
                <Link href="/" className="block min-w-0 max-w-full" title="UpNext home">
                  <UpNextWordmark className="block truncate text-xl" />
                </Link>
              </div>
            </div>
            <div className="mb-4 shrink-0 pl-1 pr-1">
              <div className={cn(sidebarLabelCol, "space-y-0.5")}>
                <h3 className="truncate font-headline text-sm font-bold">{session.roomName}</h3>
                <p className="truncate text-xs text-neutral-500">{session.listenerCount} Listeners</p>
              </div>
            </div>
          </>
        )}

        <nav className={cn("flex flex-col gap-2", compact ? "px-2" : "px-1")}>
          <button
            type="button"
            title="Live Session"
            onClick={() => {
              setActiveView("live");
              if (compact) setMobileNavOpen(false);
            }}
            className={cn(
              navRowGrid,
              "transition-colors duration-200 ease-out",
              activeView === "live" ? "text-orange-500" : "text-neutral-500 hover:bg-neutral-800/30",
              !compact && activeView === "live" && "bg-orange-500/10",
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center justify-self-center">
              <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                sensors
              </span>
            </span>
            <span className={cn(sidebarLabelCol, "font-label text-sm font-semibold")}>Live Session</span>
          </button>
          <button
            type="button"
            title="History"
            onClick={() => {
              setActiveView("history");
              if (compact) setMobileNavOpen(false);
            }}
            className={cn(
              navRowGrid,
              "transition-colors duration-200 ease-out",
              activeView === "history" ? "text-orange-500" : "text-neutral-500 hover:bg-neutral-800/30",
              !compact && activeView === "history" && "bg-orange-500/10",
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center justify-self-center">
              <span className="material-symbols-outlined shrink-0">history</span>
            </span>
            <span className={cn(sidebarLabelCol, "font-label text-sm font-semibold")}>History</span>
          </button>
        </nav>

        <div className={cn("mt-2 flex flex-col gap-2", compact ? "px-2" : "px-1")}>
          <button
            type="button"
            title="People"
            onClick={() => {
              setActiveView("people");
              if (compact) setMobileNavOpen(false);
            }}
            className={cn(
              navRowGrid,
              "transition-colors duration-200 ease-out",
              activeView === "people" ? "text-orange-500" : "text-neutral-500 hover:bg-neutral-800/30",
              !compact && activeView === "people" && "bg-orange-500/10",
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center justify-self-center">
              <span className="material-symbols-outlined shrink-0">group</span>
            </span>
            <span className={cn(sidebarLabelCol, "font-label text-sm font-semibold")}>People</span>
          </button>
          <button
            type="button"
            title="Settings"
            onClick={() => {
              setIsSettingsOpen(true);
              if (compact) setMobileNavOpen(false);
            }}
            className={cn(navRowGrid, "text-neutral-500 transition-colors duration-200 ease-out hover:bg-neutral-800/30")}
          >
            <span className="flex h-10 w-10 items-center justify-center justify-self-center">
              <span className="material-symbols-outlined shrink-0">settings</span>
            </span>
            <span className={cn(sidebarLabelCol, "font-label text-sm font-semibold")}>Settings</span>
          </button>
        </div>

      </>
    );
  };

  return (
    <div className="relative flex min-h-screen bg-surface font-body text-on-surface selection:bg-primary selection:text-on-primary">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary opacity-15 blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-secondary opacity-15 blur-[80px]" />
      </div>

      {/* Desktop sidebar */}
      <aside
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        onMouseDown={() => setSidebarCollapsed(false)}
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-x-hidden border-r border-neutral-800/20 bg-neutral-950/60 backdrop-blur-3xl transition-[width] duration-300 ease-in-out motion-reduce:transition-none lg:flex",
          "bg-gradient-to-r from-[rgba(19,19,20,0.85)] to-transparent",
          sidebarCollapsed ? "w-16" : "w-56",
        )}
      >
        {hostSidebarNav()}
      </aside>

      <div
        className={cn(
          "relative z-10 hidden shrink-0 transition-[width] duration-300 ease-in-out motion-reduce:transition-none lg:block",
          sidebarCollapsed ? "w-16" : "w-56",
        )}
        aria-hidden
      />

      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 -translate-x-full flex-col border-r border-neutral-800/20 bg-neutral-950/95 backdrop-blur-3xl transition-transform duration-300 ease-out lg:hidden",
          mobileNavOpen && "translate-x-0",
        )}
      >
        <div className="px-6 pb-4 pt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800/50 hover:text-orange-300"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <Link href="/" className="min-w-0" title="UpNext home" onClick={() => setMobileNavOpen(false)}>
              <UpNextWordmark />
            </Link>
          </div>
          <div className="mt-4 space-y-0.5">
            <h3 className="font-headline text-sm font-bold">{session.roomName}</h3>
            <p className="text-xs text-neutral-500">{session.listenerCount} Listeners</p>
          </div>
        </div>
        {hostSidebarNav({ compact: true })}
      </aside>

      <button
        type="button"
        className="fixed left-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800/50 bg-neutral-950/90 text-neutral-400 shadow-lg backdrop-blur-sm transition-colors hover:bg-neutral-800/60 hover:text-orange-300 lg:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col pb-24 md:pb-6">
        <main className="flex-1 px-4 pb-28 pt-14 sm:px-6 sm:pb-24 md:px-12 md:pb-24 lg:pt-6">
          {activeView === "history" ? (
            <div className="mx-auto w-full max-w-5xl space-y-6 pb-10 pt-2 sm:pb-12 lg:pt-2">
              <section className="space-y-6">
                <div className="space-y-2">
                  <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">History</span>
                  <h1 className="font-headline text-3xl font-black tracking-tighter sm:text-4xl">Previously Played</h1>
                  <p className="text-sm text-on-surface-variant">Room #{joinCode.toUpperCase()}</p>
                </div>

                <div className="glass-panel rounded-lg outline outline-1 outline-outline-variant/10">
                  <div className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-4">
                    <h2 className="font-headline text-lg font-bold">Past Songs</h2>
                    <span className="text-xs font-semibold text-outline">
                      {Math.max(playedSongs.length - 1, 0)} songs played
                    </span>
                  </div>
                  <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-3">
                    {playedSongs.length > 1 ? (
                      playedSongs
                        .slice(0, -1)
                        .reverse()
                        .map((song, idx) => (
                          <div
                            key={`${song.key}-${idx}`}
                            className="group flex items-center gap-4 rounded-lg px-3 py-3 transition-all hover:bg-white/5"
                          >
                            <span className="w-8 text-sm font-bold text-outline">{String(idx + 1).padStart(2, "0")}</span>
                            <img className="h-12 w-12 rounded object-cover" src={song.thumbnail} alt={song.title} />
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-base font-semibold text-on-surface">{song.title}</h3>
                              <p className="truncate text-xs text-on-surface-variant">{song.author}</p>
                            </div>
                            <span className="text-[11px] font-medium text-outline">
                              {new Date(song.playedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        ))
                    ) : (
                      <p className="px-3 py-8 text-sm text-outline">
                        No songs played yet. Tracks will appear here after they finish.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          ) : activeView === "people" ? (
            <div className="mx-auto w-full max-w-5xl space-y-6 pb-10 pt-2 sm:pb-12 lg:pt-2">
              <section className="space-y-6">
                <div className="space-y-2">
                  <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">People</span>
                  <h1 className="font-headline text-3xl font-black tracking-tighter sm:text-4xl">Members Joined</h1>
                  <p className="text-sm text-on-surface-variant">Room #{joinCode.toUpperCase()}</p>
                </div>

                <div className="glass-panel rounded-lg outline outline-1 outline-outline-variant/10">
                  <div className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-4">
                    <h2 className="font-headline text-lg font-bold">Current Members</h2>
                    <span className="text-xs font-semibold text-outline">{participants.length} joined</span>
                  </div>
                  <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-3">
                    {participants.length > 0 ? (
                      participants.map((participant, idx) => {
                        const normalizedName = participant.name.trim().toLowerCase();
                        const normalizedHostName = session.hostName.trim().toLowerCase();
                        const isHost = normalizedName === normalizedHostName || normalizedName === "host";
                        return (
                          <div
                            key={participant.id}
                            className="group flex items-center gap-4 rounded-lg px-3 py-3 transition-all hover:bg-white/5"
                          >
                            <span className="w-8 text-sm font-bold text-outline">{String(idx + 1).padStart(2, "0")}</span>
                            <img
                              className="h-12 w-12 rounded-full object-cover"
                              src={participant.avatarUrl}
                              alt={participant.name}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate text-base font-semibold text-on-surface">{participant.name}</h3>
                                {isHost ? (
                                  <span className="shrink-0 rounded-full border border-primary/30 bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
                                    Host
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="px-3 py-8 text-sm text-outline">No members in this room yet.</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <>
          <div className="mt-2 grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="space-y-8 xl:col-span-8">
              <section className="group relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/30 to-secondary/30 opacity-25 blur transition duration-1000 group-hover:opacity-40" />
                <div className="relative overflow-hidden rounded-xl border border-white/5 bg-surface-container-low/60 shadow-2xl backdrop-blur-3xl min-h-[520px]">
                  <div className="flex flex-col items-center gap-8 p-10 md:flex-row">
                    <div className="relative h-80 w-80 shrink-0 overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:h-96 md:w-96">
                      {currentVideoId ? (
                        <YouTubePlayer
                          videoId={currentVideoId}
                          onEnded={sendSongEnded}
                          className="h-full w-full"
                          paused={isPaused}
                          volume={volume}
                          onProgress={({ elapsedSeconds, paused }) => {
                            const prev = lastSyncRef.current;
                            if (prev && prev.elapsedSeconds === elapsedSeconds && prev.paused === paused) return;
                            lastSyncRef.current = { elapsedSeconds, paused };
                            sendPlaybackSync(elapsedSeconds, paused);
                          }}
                        />
                      ) : (
                        <img
                          alt="Album Art"
                          className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                          src={session.nowPlaying.albumArtUrl}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="w-full flex-1 space-y-4 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Live Now
                      </div>
                      <h1 className="font-headline text-3xl font-black leading-[0.95] tracking-tighter md:text-5xl break-words overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]">
                        {session.nowPlaying.title}
                      </h1>
                      <p className="text-xl font-medium text-neutral-400">{session.nowPlaying.author}</p>

                      <div className="flex items-center justify-center gap-4 pt-4 md:justify-start">
                        <div className="flex -space-x-3">
                          {participants.slice(0, 3).map((participant) => (
                            <img
                              key={participant.id}
                              className="h-8 w-8 rounded-full border-2 border-surface object-cover"
                              alt={participant.name}
                              src={participant.avatarUrl}
                            />
                          ))}
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-surface-container-highest text-[10px] font-bold">
                            +{Math.max(session.listenerCount - 3, 0)}
                          </div>
                        </div>
                        <span className="text-xs font-semibold tracking-wide text-neutral-500">Listening Together</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 pb-4">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(255,144,109,0.5)]"
                        style={{ width: `${playbackProgressPercent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] font-bold tracking-tighter text-neutral-500">
                      <span>{session.nowPlaying.elapsed}</span>
                      <span>{session.nowPlaying.duration}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 items-center gap-6 rounded-xl bg-surface-container-low p-6 shadow-xl sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:p-8">
                <div className="flex justify-center sm:justify-start">
                  <div className="w-full max-w-xs rounded-lg bg-surface-container-high px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-neutral-500">volume_down</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-800
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:h-5
                          [&::-webkit-slider-thumb]:w-5
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-white
                          [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(0,0,0,0.3)]
                          [&::-moz-range-thumb]:h-5
                          [&::-moz-range-thumb]:w-5
                          [&::-moz-range-thumb]:rounded-full
                          [&::-moz-range-thumb]:border-0
                          [&::-moz-range-thumb]:bg-white"
                        style={{
                          background: `linear-gradient(to right, rgb(255, 144, 109) 0%, rgb(255, 144, 109) ${volume}%, rgb(38, 38, 42) ${volume}%, rgb(38, 38, 42) 100%)`,
                        }}
                        aria-label="Player volume"
                      />
                      <span className="material-symbols-outlined text-neutral-500">volume_up</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    disabled={!currentVideoId}
                    onClick={() => {
                      if (!currentVideoId) return;
                      setIsPaused((prev) => !prev);
                    }}
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
                  >
                    <span
                      className="material-symbols-outlined text-5xl leading-none"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {isPaused ? "play_arrow" : "pause"}
                    </span>
                  </button>
                  <div className="flex h-20 w-12 shrink-0 items-center justify-center sm:w-14">
                    <button
                      type="button"
                      disabled={!currentVideoId}
                      onClick={() => {
                        if (!currentVideoId) return;
                        setIsPaused(false);
                        sendSongEnded();
                      }}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-800"
                    >
                      <span className="material-symbols-outlined text-3xl leading-none">skip_next</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end">
                  <button
                    type="button"
                    disabled={stopSessionMutation.isPending}
                    onClick={() => stopSessionMutation.mutate()}
                    className="w-full max-w-xs rounded-lg border border-error/20 bg-error/10 px-6 py-3 text-sm font-bold text-error-dim transition-all hover:bg-error hover:text-white enabled:cursor-pointer enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:max-w-none"
                  >
                    {stopSessionMutation.isPending ? "Stopping…" : "Stop Session"}
                  </button>
                </div>
              </section>
            </div>

            <div className="space-y-8 xl:col-span-4">
              <section className="flex h-[min(480px,60vh)] flex-col overflow-hidden rounded-xl bg-surface-container-low shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 p-6">
                  <h2 className="font-headline text-lg font-bold uppercase tracking-widest text-neutral-400">Members Joined</h2>
                  <span className="text-xs font-bold text-primary">{participants.length} LISTENERS</span>
                </div>

                <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-2">
                  {participants.length ? (
                    participants.map((participant, idx) => (
                      <div
                        key={participant.id}
                        className="group flex items-center gap-4 rounded-lg p-4 transition-all hover:bg-white/5"
                      >
                        <span className="w-6 text-lg font-black text-neutral-600">{idx + 1}</span>
                        <img
                          alt={participant.name}
                          className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover"
                          src={participant.avatarUrl}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold">{participant.name}</h4>
                          <p className="truncate text-xs text-neutral-500">Listening now</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-6 text-sm text-neutral-500">No participants joined yet.</p>
                  )}
                </div>
              </section>
              <section className="group relative overflow-hidden rounded-xl bg-surface-container-highest p-6">
                <h2 className="relative z-10 mb-4 font-headline text-xl font-black">Invite your crowd</h2>
                <div className="relative z-10 flex gap-2">
                  <div className="flex flex-1 items-center truncate rounded-lg bg-surface-container-low px-4 py-3 font-mono text-sm text-neutral-400">
                    {invitePath}
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const inviteUrl = `${window.location.origin}${invitePath}`;
                        await navigator.clipboard.writeText(inviteUrl);
                        setCopyStatus("copied");
                      } catch {
                        setCopyStatus("error");
                      }
                      window.setTimeout(() => setCopyStatus("idle"), 1600);
                    }}
                    className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-bold text-surface transition-colors hover:bg-neutral-200 active:scale-95"
                  >
                    {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Retry" : "Copy Link"}
                  </button>
                </div>
                {copyStatus === "error" ? (
                  <p className="relative z-10 mt-2 text-xs text-error">Could not copy link. Please copy manually.</p>
                ) : null}
              </section>
              {error ? <p className="text-xs text-error">{error}</p> : null}
            </div>
          </div>
          {stopSessionMutation.isError ? (
            <p className="mt-4 text-center text-xs text-error">{(stopSessionMutation.error as Error).message}</p>
          ) : null}
            </>
          )}
        </main>
      </div>

      {activeView === "live" ? (
      <div className="fixed bottom-6 left-1/2 z-50 w-[90%] -translate-x-1/2 md:hidden">
        <div className="flex items-center gap-4 rounded-lg border border-white/5 bg-surface-container-high/60 p-4 shadow-2xl backdrop-blur-3xl">
          <img
            alt=""
            className="h-12 w-12 shrink-0 rounded-md object-cover"
            src={session.nowPlaying.albumArtUrl}
          />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-bold">{session.nowPlaying.title}</h4>
            <p className="truncate text-[10px] text-neutral-400">{session.nowPlaying.author.split(" • ")[0]}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" className="material-symbols-outlined text-primary">
              play_arrow
            </button>
            <button type="button" className="material-symbols-outlined text-neutral-400">
              skip_next
            </button>
          </div>
        </div>
      </div>
      ) : null}

      {isSettingsOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-surface-container-low p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-headline text-2xl font-black">Host Settings</h2>
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-neutral-300 hover:bg-surface-container-highest"
                onClick={() => setIsSettingsOpen(false)}
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[22px] leading-none">close</span>
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="rounded-lg bg-surface-container-high p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Session</p>
                <p className="mt-1 font-mono text-neutral-200">/{id}</p>
                <p className="mt-2 text-xs text-neutral-400">Join code: {joinCode}</p>
              </div>
              <div className="rounded-lg bg-surface-container-high p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Expires At</p>
                <p className="mt-1 text-neutral-200">{expiresAtLabel}</p>
              </div>
              <div className="rounded-lg bg-surface-container-high p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Host Account</p>
                <p className="mt-1 text-neutral-200">{meQuery.data?.user?.email ?? "Signed in"}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white"
                onClick={() => createSessionMutation.mutate(token)}
              >
                {createSessionMutation.isPending ? "Creating..." : "Create new session"}
              </button>
              <button
                type="button"
                disabled={stopSessionMutation.isPending}
                onClick={() => stopSessionMutation.mutate()}
                className="rounded-md border border-error/30 bg-error/10 px-4 py-2 text-sm font-bold text-error transition-colors hover:bg-error hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {stopSessionMutation.isPending ? "Stopping…" : "Stop Session"}
              </button>
            </div>
            {stopSessionMutation.isError ? (
              <p className="mt-3 text-xs text-error">{(stopSessionMutation.error as Error).message}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
