"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { useToast } from "../../../components/ToastProvider";
import { YouTubePlayer } from "../../../components/YouTubePlayer";
import { UpNextWordmark } from "../../../components/UpNextWordmark";
import { api } from "../../../lib/api";
import { queryKeys } from "../../../lib/queryKeys";
import { getHostParticipantId, isHostParticipant } from "../../../lib/sessionHost";
import type { HostSessionSummaryResponse } from "../../../lib/types";
import {
  clearGuestIdentity,
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

type LiveFeedEvent = {
  id: string;
  type: "joined" | "voted";
  actorName: string;
  songTitle?: string;
  createdAt: string;
  isHost?: boolean;
};

function formatFeedTime(isoValue: string) {
  const diffMs = Date.now() - new Date(isoValue).getTime();
  const safeDiff = Number.isFinite(diffMs) ? Math.max(0, diffMs) : 0;
  const seconds = Math.floor(safeDiff / 1000);
  if (seconds < 60) return "JUST NOW";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}M AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;
  const days = Math.floor(hours / 24);
  return `${days}D AGO`;
}

function toReadableErrorMessage(raw?: string | null) {
  if (!raw) return "Something went wrong. Please try again.";
  if (raw === "ValidationError") return "Please check your inputs and try again.";
  if (raw === "InvalidCredentials") return "Email or password is incorrect.";
  if (raw === "EmailAlreadyInUse") return "This email is already registered. Try logging in.";
  if (raw === "Unauthorized") return "Please login again to continue.";
  if (raw === "HostNotFound") return "Host account not found. Please signup or use another account.";
  if (raw === "SessionNotFound") return "Session not found.";
  if (raw === "SessionExpired") return "This session has ended.";
  return raw;
}


export default function HostViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <HostHostRouteContent id={id} allowDemoRoute={false} />;
}

export function HostHostRouteContent({ id, allowDemoRoute }: { id: string; allowDemoRoute: boolean }) {
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
    clearGuestIdentity();
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

  if (id === "demo" && !allowDemoRoute) {
    return <LegacyDemoHostRedirect />;
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
          onClick={() => router.replace("/host/auth")}
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

function LegacyDemoHostRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/host/auth");
  }, [router]);

  return <HostBootState message="Redirecting…" />;
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
              onClick={() => router.replace("/host/auth")}
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
  const { showToast } = useToast();
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

  useEffect(() => {
    if (!dashboardError) return;
    showToast({ message: toReadableErrorMessage(dashboardError), variant: "error" });
    setDashboardError(null);
  }, [dashboardError, showToast]);

  useEffect(() => {
    if (!sessionsQuery.error) return;
    showToast({ message: "Could not load previous sessions.", variant: "error" });
  }, [sessionsQuery.error, showToast]);

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
  const { showToast } = useToast();
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

  useEffect(() => {
    if (!errorMessage) return;
    showToast({ message: toReadableErrorMessage(errorMessage), variant: "error" });
  }, [errorMessage, showToast]);

  useEffect(() => {
    if (!authMutation.error) return;
    const message = (authMutation.error as Error).message;
    showToast({ message: toReadableErrorMessage(message), variant: "error" });
  }, [authMutation.error, showToast]);

  const validateAuthForm = () => {
    const trimmedEmail = email.trim();
    const trimmedName = displayName.trim();
    if (isSignupMode) {
      if (!trimmedName) return "Please enter your full name.";
      if (trimmedName.length < 2) return "Name must be at least 2 characters.";
      if (trimmedName.length > 40) return "Name must be at most 40 characters.";
    }
    if (!trimmedEmail) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return "Please enter a valid email address.";
    if (!password) return "Please enter your password.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password.length > 128) return "Password must be at most 128 characters.";
    return null;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090b10] px-6 py-14 text-on-surface selection:bg-primary selection:text-on-primary">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,159,120,0.3),transparent_42%),radial-gradient(circle_at_15%_75%,rgba(255,120,74,0.16),transparent_48%),radial-gradient(circle_at_90%_70%,rgba(255,120,74,0.14),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,12,0.15),rgba(8,9,12,0.9))]" />
      </div>

      <header className="fixed left-0 top-0 z-30 flex w-full items-center px-6 py-8">
        <UpNextWordmark className="font-headline" />
      </header>

      <main className="relative z-10 w-full max-w-[500px] rounded-[2rem] border border-white/10 bg-neutral-950/60 px-9 py-10 shadow-[0_32px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <h1 className="font-headline text-[2.55rem] font-black leading-[0.95] tracking-tight text-white sm:text-5xl">
          {isSignupMode ? "Create your account." : "Welcome back."}
        </h1>
        <p className="mt-2.5 text-[0.95rem] text-neutral-400">
          {isSignupMode ? "Join the next generation of musical editorial." : "Sign in to create and control your live room."}
        </p>

        <form
          className="mt-8 space-y-4.5"
          onSubmit={(e) => {
            e.preventDefault();
            const validationMessage = validateAuthForm();
            if (validationMessage) {
              showToast({ message: validationMessage, variant: "error" });
              return;
            }
            authMutation.mutate({ email: email.trim(), password, displayName: displayName.trim(), signup: isSignupMode });
          }}
        >
          {isSignupMode ? (
            <label className="block space-y-2">
              <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">Full Name</span>
              <input
                className="w-full rounded-md border border-white/18 bg-[#1a1d23] px-4 py-2.5 text-[1.12rem] font-medium text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
                type="text"
                placeholder="Alex Rivers"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </label>
          ) : null}

          <label className="block space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">Email Address</span>
            <input
              className="w-full rounded-md border border-white/18 bg-[#1a1d23] px-4 py-2.5 text-[1.12rem] font-medium text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
              type="email"
              placeholder="alex@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">Password</span>
            <input
              className="w-full rounded-md border border-white/18 bg-[#1a1d23] px-4 py-2.5 text-[1.12rem] font-medium text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-primary/55 focus:ring-2 focus:ring-primary/20"
              type="password"
              placeholder="........"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button
            type="submit"
            className="mt-1.5 w-full rounded-lg bg-gradient-to-r from-[#ff906d] to-[#ff8a00] py-3.5 font-headline text-sm font-black uppercase tracking-[0.05em] text-[#2d1209] shadow-[0_18px_48px_-20px_rgba(255,144,109,0.88)] transition hover:brightness-105 active:scale-[0.99]"
          >
            {authMutation.isPending ? "Please wait..." : isSignupMode ? "Create Account" : "Login"}
          </button>

          <button
            type="button"
            onClick={() => setIsSignupMode((prev) => !prev)}
            className="w-full rounded-lg border border-white/10 bg-[#11141d] py-2.5 text-[13px] font-semibold text-neutral-100 transition hover:bg-[#171b26]"
          >
            {isSignupMode ? "Use existing account login" : "Need an account? Sign up"}
          </button>
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
              router.replace("/host/auth");
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
  const { showToast } = useToast();
  const {
    session,
    queue,
    participants,
    voteActivity,
    currentVideoId,
    playbackProgressPercent,
    sendSongEnded,
    sendPlaybackSync,
    error,
    isConnected,
    isConnecting,
  } = useSessionState();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState<"live" | "history" | "people">("live");
  const [playedSongs, setPlayedSongs] = useState<PlayedSong[]>([]);
  const [liveFeed, setLiveFeed] = useState<LiveFeedEvent[]>([]);
  const hostAccessError = error === "HostAccessDenied" || error === "InvalidToken" ? error : null;
  const lastSyncRef = useRef<{ elapsedSeconds: number; paused: boolean } | null>(null);
  const seenParticipantIdsRef = useRef<Set<string>>(new Set());
  const seenVoteEventsRef = useRef<Set<string>>(new Set());
  const hostParticipantId = useMemo(() => getHostParticipantId(participants), [participants]);

  useEffect(() => {
    if (!error || error === "HostAccessDenied" || error === "InvalidToken") return;
    const isConnectionIssue = error === "ConnectionFailed" || error === "ReconnectFailed";
    if (isConnectionIssue && (isConnecting || isConnected)) return;

    const timeout = window.setTimeout(
      () => {
        if (isConnectionIssue && (isConnecting || isConnected)) return;
        showToast({ message: toReadableErrorMessage(error), variant: "error" });
      },
      isConnectionIssue ? 1200 : 0,
    );

    return () => window.clearTimeout(timeout);
  }, [error, isConnected, isConnecting, showToast]);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  useEffect(() => {
    const knownParticipants = seenParticipantIdsRef.current;
    const newEvents: LiveFeedEvent[] = [];
    for (const participant of participants) {
      if (knownParticipants.has(participant.id)) continue;
      knownParticipants.add(participant.id);
      const isHost = isHostParticipant(participant, hostParticipantId, session.hostName);
      newEvents.push({
        id: `joined-${participant.id}-${Date.now()}`,
        type: "joined",
        actorName: participant.name,
        createdAt: participant.joinedAt ?? new Date().toISOString(),
        isHost,
      });
    }
    if (newEvents.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLiveFeed((prev) => [...newEvents.reverse(), ...prev].slice(0, 40));
    }
  }, [participants]);

  useEffect(() => {
    const seen = seenVoteEventsRef.current;
    const nextEvents: LiveFeedEvent[] = [];
    for (const event of voteActivity) {
      const eventKey = `${event.songId}:${event.voterUserId}:${event.createdAt}`;
      if (seen.has(eventKey)) continue;
      seen.add(eventKey);
      if (!event.cast) continue;
      nextEvents.push({
        id: `voted-${event.songId}-${event.voterUserId}-${event.createdAt}`,
        type: "voted",
        actorName: event.voterName || "Someone",
        songTitle: event.songTitle || "this track",
        createdAt: event.createdAt,
      });
    }
    if (nextEvents.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLiveFeed((prev) => [...nextEvents.reverse(), ...prev].slice(0, 40));
    }
  }, [voteActivity]);

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
      queryClient.invalidateQueries({ queryKey: queryKeys.hostSessions });
      queryClient.invalidateQueries({ queryKey: queryKeys.sessionByCode(joinCode) });
      queryClient.invalidateQueries({ queryKey: queryKeys.hostSessionSummary(id) });
      setIsSettingsOpen(false);
      router.replace(`/session/${id}/host?code=${joinCode}`);
    },
  });

  useEffect(() => {
    if (!stopSessionMutation.isError) return;
    showToast({ message: toReadableErrorMessage((stopSessionMutation.error as Error).message), variant: "error" });
  }, [stopSessionMutation.error, stopSessionMutation.isError, showToast]);

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

      <div className="relative z-10 flex min-w-0 flex-1 flex-col pb-20 md:pb-4">
        <main className="flex-1 px-4 pb-20 pt-10 sm:px-6 sm:pb-20 md:px-12 md:pb-20 lg:pt-5">
          <div className={cn(activeView === "history" ? "block" : "hidden")}>
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
          </div>
          <div className={cn(activeView === "people" ? "block" : "hidden")}>
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
                        const isHost = isHostParticipant(participant, hostParticipantId, session.hostName);
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
          </div>
          <div className={cn(activeView === "live" ? "block" : "hidden")}>
          <div className="mt-1 grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-7">
              <section className="group relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/30 to-secondary/30 opacity-25 blur transition duration-1000 group-hover:opacity-40" />
                <div className="relative h-[200px] overflow-hidden rounded-xl border border-white/5 bg-surface-container-low/60 shadow-2xl backdrop-blur-3xl">
                  <div className="flex h-full items-center gap-4 p-4">
                    <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:h-40 md:w-40">
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
                    <div className="w-full flex-1 space-y-2 pb-2 pr-2 pt-1 text-left">
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Live Now
                      </div>
                      <h1 className="font-headline text-3xl font-bold leading-[0.95] tracking-tighter md:text-4xl break-words overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                        {session.nowPlaying.title}
                      </h1>
                      <p className="text-base font-normal text-neutral-400">{session.nowPlaying.author}</p>

                      <div className="flex items-center gap-4 pb-1 pt-2">
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

                </div>
              </section>

              <section
                className={cn(
                  "rounded-[2rem] border border-white/5 bg-surface-container-low/70 px-7 py-6 shadow-2xl backdrop-blur-3xl",
                  queue.length > 0 && "h-[496.5px]",
                )}
              >
                <div>
                  <div>
                    <h2 className="font-headline text-3xl font-black tracking-tight text-white">UP NEXT</h2>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Pending tracks in queue
                    </p>
                  </div>
                </div>

                <div className="custom-scrollbar mt-6 max-h-[420px] space-y-2 overflow-y-auto pr-1">
                  {queue.length ? (
                    queue.slice(0, 10).map((song, idx) => (
                      <div
                        key={song.id}
                        className="flex min-h-14 items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-white/5"
                      >
                        <span className="w-8 text-center text-xl font-black tracking-tight text-neutral-600">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <img src={song.thumbnail} alt={song.title} className="h-10 w-10 shrink-0 rounded-md object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-black tracking-tight text-white">{song.title}</p>
                          <p className="truncate text-xs uppercase tracking-[0.08em] text-neutral-500">
                            Added by {song.addedBy ?? "Unknown"} : {song.votes} {song.votes < 2 ? "vote" : "votes"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-xl bg-white/5 px-4 py-5 text-sm text-neutral-400">No pending tracks in queue yet.</p>
                  )}
                </div>
              </section>

            </div>

            <div className="space-y-6 xl:col-span-5">
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
                        showToast({ message: "Could not copy link. Please copy manually.", variant: "error" });
                      }
                      window.setTimeout(() => setCopyStatus("idle"), 1600);
                    }}
                    className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-bold text-surface transition-colors hover:bg-neutral-200 active:scale-95"
                  >
                    {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Retry" : "Copy Link"}
                  </button>
                </div>
              </section>
              <section className="flex h-[min(560px,68vh)] flex-col overflow-hidden rounded-xl bg-surface-container-low shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 p-6">
                  <h2 className="font-headline text-lg font-bold uppercase tracking-widest text-neutral-400">Live Feed</h2>
                  <span className="text-xs font-bold text-primary">{participants.length} LISTENERS</span>
                </div>

                <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-2">
                  {liveFeed.length ? (
                    liveFeed.map((event) => (
                      <div
                        key={event.id}
                        className="group flex items-center gap-4 rounded-lg p-4 transition-all hover:bg-white/5"
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm",
                            event.type === "joined"
                              ? "bg-orange-500/20 text-orange-300"
                              : "bg-indigo-500/20 text-indigo-300",
                          )}
                        >
                          <span className="material-symbols-outlined text-base">
                            {event.type === "joined" ? "person_add" : "thumb_up"}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold">
                            {event.type === "joined"
                              ? `${event.actorName} ${event.isHost ? "started" : "joined"} the jam`
                              : `${event.actorName} voted for ${event.songTitle ?? "a track"}`}
                          </h4>
                          <p className="truncate text-xs text-neutral-500">{formatFeedTime(event.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="px-4 py-6 text-sm text-neutral-500">No live activity yet.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
          </div>
        </main>
      </div>

      {currentVideoId ? (
        <section className="fixed bottom-6 left-1/2 z-40 hidden w-[min(1080px,calc(100vw-2rem))] -translate-x-1/2 items-center gap-x-4 gap-y-1.5 rounded-full border border-white/10 bg-neutral-950/85 px-5 py-2.5 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:grid md:grid-cols-[minmax(220px,1fr)_minmax(360px,540px)_auto] md:grid-rows-[auto_auto]">
          <div className="min-w-0 flex items-center gap-4 md:row-span-2">
            <img
              alt={session.nowPlaying.title}
              className={cn(
                "h-12 w-12 shrink-0 rounded-full border-2 border-primary/40 object-cover shadow-[0_0_0_2px_rgba(255,255,255,0.08)]",
                !isPaused && "animate-[spin_9s_linear_infinite]",
              )}
              src={session.nowPlaying.albumArtUrl}
            />
            <div className="min-w-0">
              <p className="truncate font-headline text-lg font-normal tracking-wide text-white">{session.nowPlaying.title}</p>
              <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-400">
                {session.nowPlaying.author || "Broadcasting live"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1 md:col-start-2 md:row-start-1 md:justify-self-center">
            <button
              type="button"
              onClick={() => {
                setIsPaused((prev) => !prev);
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
              aria-label={isPaused ? "Play" : "Pause"}
            >
              <span className="material-symbols-outlined text-[26px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPaused ? "play_arrow" : "pause"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPaused(false);
                sendSongEnded();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Next song"
            >
              <span className="material-symbols-outlined text-[17px]">skip_next</span>
            </button>
          </div>

          <div className="min-w-0 md:col-start-2 md:row-start-2">
            <div className="flex items-center gap-3 text-[10px] font-bold tracking-tighter text-neutral-500">
              <span className="w-8 text-right">{session.nowPlaying.elapsed}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(255,144,109,0.5)]"
                  style={{ width: `${playbackProgressPercent}%` }}
                />
              </div>
              <span className="w-8 text-left">{session.nowPlaying.duration}</span>
            </div>
          </div>

          <div className="flex w-full max-w-[180px] items-center gap-2 justify-self-end md:row-span-2">
            <span className="material-symbols-outlined text-neutral-500">volume_down</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-800
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:shadow-[0_0_0_2px_rgba(0,0,0,0.3)]
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:w-4
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
        </section>
      ) : null}

      {activeView === "live" && currentVideoId ? (
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
