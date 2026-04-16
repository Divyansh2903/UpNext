"use client";

import { use, useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { UpNextWordmark } from "../../components/UpNextWordmark";
import { cn } from "../../lib/utils";
import { getQueueCountLabel } from "../../mocks/selectors";
import { SessionProvider, useSessionState } from "./SessionProvider";
import { getStoredDisplayName, setStoredDisplayName } from "../../lib/sessionIdentity";
import { extractYouTubeVideoId } from "../../lib/youtube";

type PlayedSong = {
  key: string;
  title: string;
  author: string;
  thumbnail: string;
  playedAt: string;
};

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialDisplayName, setInitialDisplayName] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialDisplayName(getStoredDisplayName() || "Guest");
  }, []);

  if (!initialDisplayName) {
    return null;
  }

  return (
    <SessionProvider
      sessionId={id}
      joinCode={id.slice(0, 6).toUpperCase()}
      hostName="Host"
      roomName="Live Session"
      initialDisplayName={initialDisplayName}
    >
      <SessionPageInner id={id} />
    </SessionProvider>
  );
}

function SessionPageInner({ id }: { id: string }) {
  const { queue, session, participants, playbackProgressPercent, displayName, updateName, sendAddSong, sendVote, error } =
    useSessionState();
  const [activeView, setActiveView] = useState<"live" | "history" | "people">("live");
  const [searchQuery, setSearchQuery] = useState("");
  const [addSongError, setAddSongError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(displayName);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [playedSongs, setPlayedSongs] = useState<PlayedSong[]>([]);

  useEffect(() => {
    setNameDraft(displayName);
  }, [displayName]);

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

  const handleVote = (songId: string) => {
    sendVote(songId);
  };

  const handleAddSong = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const videoId = extractYouTubeVideoId(searchQuery);
    if (!videoId) {
      setAddSongError("Paste a valid YouTube URL or 11-character video ID.");
      return;
    }
    setAddSongError(null);
    sendAddSong(videoId);
    setSearchQuery("");
  };

  const participantSidebarNav = (opts: { compact?: boolean } = {}) => {
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
                <p className="truncate text-xs text-neutral-500">{session.listenerCount} active listeners</p>
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
          <Link
            href={`/session/${id}/host`}
            title="Switch to Host View"
            onClick={() => compact && setMobileNavOpen(false)}
            className={cn(navRowGrid, "text-neutral-500 transition-colors duration-200 ease-out hover:bg-neutral-800/30")}
          >
            <span className="flex h-10 w-10 items-center justify-center justify-self-center">
              <span className="material-symbols-outlined shrink-0">settings</span>
            </span>
            <span className={cn(sidebarLabelCol, "font-label text-sm font-semibold")}>Host view</span>
          </Link>
        </div>

        <div className={cn("mt-auto p-4", !compact && sidebarCollapsed && "px-2")}>
          {!compact && sidebarCollapsed ? (
            <button
              type="button"
              title="Invite Friends"
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-surface-container-highest text-on-surface transition-all hover:bg-primary hover:text-on-primary"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </button>
          ) : (
            <button
              type="button"
              title="Invite Friends"
              onClick={() => compact && setMobileNavOpen(false)}
              className="w-full rounded-md bg-surface-container-highest py-3 text-xs font-bold text-on-surface transition-all hover:bg-primary hover:text-on-primary"
            >
              Invite Friends
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-surface font-body text-on-surface selection:bg-primary/30">
      {/* Desktop sidebar */}
      <aside
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        onMouseDown={() => setSidebarCollapsed(false)}
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-x-hidden border-r border-neutral-800/20 bg-neutral-950/60 backdrop-blur-3xl transition-[width] duration-300 ease-in-out motion-reduce:transition-none lg:flex",
          "bg-gradient-to-r from-neutral-900/20 to-transparent",
          sidebarCollapsed ? "w-16" : "w-56",
        )}
      >
        {participantSidebarNav()}
      </aside>

      {/* Desktop spacer matches sidebar width */}
      <div
        className={cn(
          "hidden shrink-0 transition-[width] duration-300 ease-in-out motion-reduce:transition-none lg:block",
          sidebarCollapsed ? "w-16" : "w-56",
        )}
        aria-hidden
      />

      {/* Mobile nav overlay */}
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
            <p className="text-xs text-neutral-500">{session.listenerCount} active listeners</p>
          </div>
        </div>
        {participantSidebarNav({ compact: true })}
      </aside>

      <button
        type="button"
        className="fixed left-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800/50 bg-neutral-950/90 text-neutral-400 shadow-lg backdrop-blur-sm transition-colors hover:bg-neutral-800/60 hover:text-orange-300 lg:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-5xl px-4 pb-10 pt-14 sm:px-6 sm:pb-12 lg:pt-8">
          {activeView === "history" ? (
            <section className="space-y-6">
              <div className="space-y-2">
                <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">History</span>
                <h1 className="font-headline text-3xl font-black tracking-tighter sm:text-4xl">Previously Played</h1>
                <p className="text-sm text-on-surface-variant">Room #{id.slice(0, 6).toUpperCase()}</p>
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
                    <p className="px-3 py-8 text-sm text-outline">No songs played yet. Tracks will appear here after they finish.</p>
                  )}
                </div>
              </div>
            </section>
          ) : activeView === "people" ? (
            <section className="space-y-6">
              <div className="space-y-2">
                <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">People</span>
                <h1 className="font-headline text-3xl font-black tracking-tighter sm:text-4xl">Members Joined</h1>
                <p className="text-sm text-on-surface-variant">Room #{id.slice(0, 6).toUpperCase()}</p>
              </div>

              <div className="glass-panel rounded-lg outline outline-1 outline-outline-variant/10">
                <div className="flex items-center justify-between border-b border-outline-variant/10 px-6 py-4">
                  <h2 className="font-headline text-lg font-bold">Current Members</h2>
                  <span className="text-xs font-semibold text-outline">{participants.length} joined</span>
                </div>
                <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-3">
                  {participants.length > 0 ? (
                    participants.map((participant, idx) => (
                      (() => {
                        const normalizedName = participant.name.trim().toLowerCase();
                        const normalizedHostName = session.hostName.trim().toLowerCase();
                        const isHost = normalizedName === normalizedHostName || normalizedName === "host";
                        return (
                      <div
                        key={participant.id}
                        className="group flex items-center gap-4 rounded-lg px-3 py-3 transition-all hover:bg-white/5"
                      >
                        <span className="w-8 text-sm font-bold text-outline">{String(idx + 1).padStart(2, "0")}</span>
                        <img className="h-12 w-12 rounded-full object-cover" src={participant.avatarUrl} alt={participant.name} />
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
                      })()
                    ))
                  ) : (
                    <p className="px-3 py-8 text-sm text-outline">No members in this room yet.</p>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <>
          <section className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-2">
              <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-primary">Session Identity</span>
              <div className="flex items-baseline gap-3">
                <h1 className="font-headline text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl">
                  Joined as{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {displayName}
                  </span>
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setIsNameDialogOpen(true);
                  }}
                  className="text-outline transition-colors hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[20px]">edit_note</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-surface-container-low px-5 py-3 outline outline-1 outline-outline-variant/10">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-sm font-medium text-on-surface-variant">
                {session.listenerCount} Listeners Tuned In
              </span>
            </div>
          </section>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <div className="glass-panel rounded-lg p-8 outline outline-1 outline-outline-variant/10">
                <h2 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold">
                  <span className="material-symbols-outlined text-primary">add_circle</span>
                  Add to Queue
                </h2>
                <form onSubmit={handleAddSong} className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">link</span>
                    <input
                      className="w-full rounded-md border-none bg-transparent bg-surface-variant/20 py-4 pl-12 pr-4 text-on-surface outline outline-1 outline-outline-variant/20 transition-all placeholder:text-outline/50 focus:bg-surface-variant/40 focus:ring-0 focus:outline-primary/40"
                      placeholder="Paste YouTube or Spotify link..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="whitespace-nowrap rounded-md bg-gradient-to-r from-primary to-secondary px-8 py-4 font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Add Track
                  </button>
                </form>
                <p className="mt-4 text-xs font-medium text-outline">Tracks are voted on by the community before playing.</p>
                {addSongError ? <p className="mt-2 text-xs font-medium text-error">{addSongError}</p> : null}
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline text-lg font-bold">Upcoming Tracks</h3>
                  <span className="text-sm font-medium text-outline">{getQueueCountLabel(queue)}</span>
                </div>
                <div className="space-y-4">
                  {queue.map((song) => (
                    <div
                      key={song.id}
                      className="glass-panel group flex items-center gap-6 rounded-lg p-4 outline outline-1 outline-outline-variant/10 transition-all hover:outline-primary/30"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
                        <img className="h-full w-full object-cover" src={song.thumbnail} alt={song.title} />
                        {song.isTopVoted && (
                          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/0" />
                        )}
                      </div>

                      <div className="min-w-0 flex-grow">
                        <h4 className="truncate font-bold text-on-surface">{song.title}</h4>
                        <p className="truncate text-sm text-on-surface-variant">{song.author}</p>
                        {song.addedBy ? (
                          <p className="mt-0.5 truncate text-[11px] font-medium text-outline">
                            Added by {song.addedBy}
                          </p>
                        ) : null}

                        {song.isTopVoted && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex -space-x-2">
                              <div className="h-6 w-6 rounded-full bg-surface-container ring-2 ring-surface">
                                <img
                                  className="h-full w-full rounded-full object-cover"
                                  alt=""
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCePyb7bIu4bRRPxJkDQJYSSei8U3MxRIeWXmlU95lPwEgZG0-4LG5snY7JFBszudKjCNnGPO4v7il_yjel-c-kDDLeNOPSl3FV2WfavomqEyYAG776hWFtrJUqPnLeM1H6OO-5R28gU7GbWU2pGFilPvwyeUx-7rIATpbRyaUcWkx6_EluJcAGYSi8BqMWR-9thDrl06mWG9BnIL0UC6EbZGpMG5dPLHdjWKTj8tbfGttyN2kZQvER6GPtLv5RUXyEJ2d1QhCy3pQ"
                                />
                              </div>
                              <div className="h-6 w-6 rounded-full bg-surface-container ring-2 ring-surface">
                                <img
                                  className="h-full w-full rounded-full object-cover"
                                  alt=""
                                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPHcrbXi-0PDiH42PYV9DY3eWtgyzHvrMDPyMj-cFGuSTDlMBoPlTDP67dZV2jW8f_P0CNATtEYrghmTWmOF3-mgFPOwduC5xob533JN-70OzIMSSGlhcAQBexRbRquj1lfBjrU9LyZ_CK8_NM6MCA7phs83Mfnr58cc-ee7U7bnO37HPEJ4oDmythxY1vLE2LkBiS9vL8ydccUYpc20xBaQ-Q8syykZeCO2R1ZBYogXNoD65a7o9QoAmnsWoSDFoZbnVpKqZUfv8"
                                />
                              </div>
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container text-[8px] font-bold text-outline ring-2 ring-surface">
                                +12
                              </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Voted by community</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleVote(song.id)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 rounded-lg px-4 py-2 transition-all active:scale-110",
                          song.isTopVoted
                            ? "bg-primary/10 hover:bg-primary/20"
                            : "bg-surface-container-highest/50 hover:bg-surface-container-highest",
                        )}
                      >
                        <span
                          className={cn(
                            "material-symbols-outlined",
                            song.isTopVoted ? "text-primary" : "text-on-surface-variant",
                          )}
                          style={song.isTopVoted ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          expand_less
                        </span>
                        <span
                          className={cn("text-sm font-black", song.isTopVoted ? "text-primary" : "text-on-surface-variant")}
                        >
                          {song.votes}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-6 lg:col-span-4">
              <div className="glass-panel relative overflow-hidden rounded-lg p-6 outline outline-1 outline-outline-variant/20">
                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/20 blur-[60px]" />
                <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-secondary/10 blur-[60px]" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="h-2 w-2 animate-ping rounded-full bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Now Playing</span>
                  </div>

                  <div className="group mb-6 aspect-square overflow-hidden rounded-lg shadow-2xl shadow-black/60">
                    <img
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt="album art"
                      src={session.nowPlaying.albumArtUrl}
                    />
                  </div>

                  <div className="mb-8 space-y-1">
                    <h3 className="font-headline text-xl font-black leading-[1] tracking-tight break-words overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:text-2xl">
                      {session.nowPlaying.title}
                    </h3>
                    <p className="font-medium text-on-surface-variant">{session.nowPlaying.author}</p>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_8px_rgba(255,144,109,0.5)]"
                        style={{ width: `${playbackProgressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-outline">
                      <span>{session.nowPlaying.elapsed}</span>
                      <span>{session.nowPlaying.duration}</span>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant/10 pt-6">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-outline">Live Reactions</p>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {participants.slice(0, 5).map((participant) => (
                          <img
                            key={participant.id}
                            className="h-8 w-8 rounded-full border-2 border-surface"
                            alt={`listener profile ${participant.name}`}
                            src={participant.avatarUrl}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium italic text-on-surface-variant">
                        {participants.length > 0 ? `${participants[0].name} and others are vibing...` : "Waiting for listeners..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {error ? <p className="mt-3 text-xs text-error">{error}</p> : null}
            </div>
          </div>
            </>
          )}
        </main>
      </div>

      {isNameDialogOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-surface-container-low p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-headline text-2xl font-black">Edit display name</h3>
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high text-neutral-300 hover:bg-surface-container-highest"
                onClick={() => {
                  setNameDraft(displayName);
                  setIsNameDialogOpen(false);
                }}
                aria-label="Close name dialog"
              >
                <span className="material-symbols-outlined text-[22px] leading-none">close</span>
              </button>
            </div>
            <input
              autoFocus
              className="w-full rounded-md border border-outline-variant/20 bg-surface-container-low px-3 py-2 text-sm"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="Update your display name"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-md bg-surface-container-high px-4 py-2 text-sm font-semibold hover:bg-surface-container-highest transition-colors"
                onClick={() => {
                  setNameDraft(displayName);
                  setIsNameDialogOpen(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white hover:brightness-110 transition-colors"
                onClick={() => {
                  const trimmed = nameDraft.trim();
                  if (!trimmed) return;
                  setStoredDisplayName(trimmed);
                  updateName(trimmed);
                  setIsNameDialogOpen(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
