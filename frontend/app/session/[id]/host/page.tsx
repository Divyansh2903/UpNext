"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { UpNextWordmark } from "../../../components/UpNextWordmark";
import { cn } from "../../../lib/utils";
import { HOST_QUEUE_MOCK } from "../../../mocks/queue";
import { HOST_INVITE_DISPLAY_URL, HOST_SESSION_MOCK, PARTICIPANT_REACTION_MOCK } from "../../../mocks/session";
import type { SongViewModel } from "../../../mocks/types";

export default function HostViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [queue] = useState<SongViewModel[]>(HOST_QUEUE_MOCK);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (id !== "demo") {
      router.replace("/session/demo/host");
    }
  }, [id, router]);

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
                onClick={() => setSidebarCollapsed((c) => !c)}
                className="flex h-10 w-10 items-center justify-center justify-self-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800/50 hover:text-orange-300"
                aria-expanded={!sidebarCollapsed}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
                <h3 className="truncate font-headline text-sm font-bold">{HOST_SESSION_MOCK.roomName}</h3>
                <p className="truncate text-xs text-neutral-500">{HOST_SESSION_MOCK.listenerCount} Listeners</p>
              </div>
            </div>
          </>
        )}

        <nav className={cn("flex flex-col gap-2", compact ? "px-2" : "px-1")}>
          <button
            type="button"
            title="Live Session"
            className={cn(
              navRowGrid,
              "text-orange-500 transition-colors duration-200 ease-out",
              !compact && "bg-orange-500/10",
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
            title="Queue"
            className={cn(navRowGrid, "text-neutral-500 transition-colors duration-200 ease-out hover:bg-neutral-800/30")}
          >
            <span className="flex h-10 w-10 items-center justify-center justify-self-center">
              <span className="material-symbols-outlined shrink-0">queue_music</span>
            </span>
            <span className={cn(sidebarLabelCol, "font-label text-sm font-semibold")}>Queue</span>
          </button>
          <button
            type="button"
            title="History"
            className={cn(navRowGrid, "text-neutral-500 transition-colors duration-200 ease-out hover:bg-neutral-800/30")}
          >
            <span className="flex h-10 w-10 items-center justify-center justify-self-center">
              <span className="material-symbols-outlined shrink-0">history</span>
            </span>
            <span className={cn(sidebarLabelCol, "font-label text-sm font-semibold")}>History</span>
          </button>

          <Link
            href={`/session/${id}`}
            title="Participant View"
            onClick={() => compact && setMobileNavOpen(false)}
            className={cn(
              navRowGrid,
              "text-orange-400 transition-colors duration-200 ease-out hover:bg-orange-500/10 hover:text-orange-300",
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center justify-self-center">
              <span className="material-symbols-outlined shrink-0">co_present</span>
            </span>
            <span className={cn(sidebarLabelCol, "font-label text-sm font-semibold")}>Participant View</span>
          </Link>
        </nav>

        <div className={cn("mt-2 flex flex-col gap-2", compact ? "px-2" : "px-1")}>
          <button
            type="button"
            title="People"
            onClick={() => compact && setMobileNavOpen(false)}
            className={cn(navRowGrid, "text-neutral-500 transition-colors duration-200 ease-out hover:bg-neutral-800/30")}
          >
            <span className="flex h-10 w-10 items-center justify-center justify-self-center">
              <span className="material-symbols-outlined shrink-0">group</span>
            </span>
            <span className={cn(sidebarLabelCol, "font-label text-sm font-semibold")}>People</span>
          </button>
          <button
            type="button"
            title="Settings"
            onClick={() => compact && setMobileNavOpen(false)}
            className={cn(navRowGrid, "text-neutral-500 transition-colors duration-200 ease-out hover:bg-neutral-800/30")}
          >
            <span className="flex h-10 w-10 items-center justify-center justify-self-center">
              <span className="material-symbols-outlined shrink-0">settings</span>
            </span>
            <span className={cn(sidebarLabelCol, "font-label text-sm font-semibold")}>Settings</span>
          </button>
        </div>

        <div className={cn("mt-auto p-4", !compact && sidebarCollapsed && "px-2")}>
          {!compact && sidebarCollapsed ? (
            <button
              type="button"
              title="Invite Friends"
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </button>
          ) : (
            <button
              type="button"
              title="Invite Friends"
              className="w-full rounded-lg bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              Invite Friends
            </button>
          )}
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
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-x-hidden border-r border-neutral-800/20 bg-neutral-950/60 backdrop-blur-3xl transition-[width] duration-300 ease-in-out motion-reduce:transition-none lg:flex",
          "bg-gradient-to-r from-[rgba(19,19,20,0.85)] to-transparent",
          sidebarCollapsed ? "w-[4.5rem]" : "w-64",
        )}
      >
        {hostSidebarNav()}
      </aside>

      <div
        className={cn(
          "relative z-10 hidden shrink-0 transition-[width] duration-300 ease-in-out motion-reduce:transition-none lg:block",
          sidebarCollapsed ? "w-[4.5rem]" : "w-64",
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
            <h3 className="font-headline text-sm font-bold">{HOST_SESSION_MOCK.roomName}</h3>
            <p className="text-xs text-neutral-500">{HOST_SESSION_MOCK.listenerCount} Listeners</p>
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
          <div className="mt-2 grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="space-y-8 xl:col-span-7">
              <section className="group relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/30 to-secondary/30 opacity-25 blur transition duration-1000 group-hover:opacity-40" />
                <div className="relative overflow-hidden rounded-xl border border-white/5 bg-surface-container-low/60 shadow-2xl backdrop-blur-3xl">
                  <div className="flex flex-col items-center gap-8 p-8 md:flex-row">
                    <div className="relative h-64 w-64 shrink-0 overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:h-80 md:w-80">
                      <img
                        alt="Album Art"
                        className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                        src={HOST_SESSION_MOCK.nowPlaying.albumArtUrl}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <div className="w-full flex-1 space-y-4 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Live Now
                      </div>
                      <h1 className="font-headline text-4xl font-black leading-none tracking-tighter md:text-6xl">
                        {HOST_SESSION_MOCK.nowPlaying.title}
                      </h1>
                      <p className="text-xl font-medium text-neutral-400">{HOST_SESSION_MOCK.nowPlaying.author}</p>

                      <div className="flex items-center justify-center gap-4 pt-4 md:justify-start">
                        <div className="flex -space-x-3">
                          {PARTICIPANT_REACTION_MOCK.map((participant) => (
                            <img
                              key={participant.id}
                              className="h-8 w-8 rounded-full border-2 border-surface object-cover"
                              alt={participant.name}
                              src={participant.avatarUrl}
                            />
                          ))}
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-surface-container-highest text-[10px] font-bold">
                            +{HOST_SESSION_MOCK.listenerCount - 3}
                          </div>
                        </div>
                        <span className="text-xs font-semibold tracking-wide text-neutral-500">Listening Together</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 pb-4">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                      <div className="h-full w-[65%] bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(255,144,109,0.5)]" />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] font-bold tracking-tighter text-neutral-500">
                      <span>{HOST_SESSION_MOCK.nowPlaying.elapsed}</span>
                      <span>{HOST_SESSION_MOCK.nowPlaying.duration}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 items-center gap-6 rounded-xl bg-surface-container-low p-6 shadow-xl sm:grid-cols-[1fr_auto_1fr] sm:gap-4 sm:p-8">
                <div className="hidden sm:block" aria-hidden />

                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <div className="flex h-20 w-12 shrink-0 items-center justify-center sm:w-14">
                    <button
                      type="button"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-800"
                    >
                      <span className="material-symbols-outlined text-3xl leading-none">skip_previous</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary shadow-xl shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
                  >
                    <span
                      className="material-symbols-outlined text-5xl leading-none"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      pause
                    </span>
                  </button>
                  <div className="flex h-20 w-12 shrink-0 items-center justify-center sm:w-14">
                    <button
                      type="button"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-800"
                    >
                      <span className="material-symbols-outlined text-3xl leading-none">skip_next</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center sm:justify-end">
                  <button
                    type="button"
                    className="w-full max-w-xs rounded-lg border border-error/20 bg-error/10 px-6 py-3 text-sm font-bold text-error-dim transition-all hover:bg-error hover:text-white sm:w-auto sm:max-w-none"
                  >
                    Stop Session
                  </button>
                </div>
              </section>
            </div>

            <div className="space-y-8 xl:col-span-5">
              <section className="group relative overflow-hidden rounded-xl bg-surface-container-highest p-6">
                <h2 className="relative z-10 mb-4 font-headline text-xl font-black">Invite your crowd</h2>
                <div className="relative z-10 flex gap-2">
                  <div className="flex flex-1 items-center truncate rounded-lg bg-surface-container-low px-4 py-3 font-mono text-sm text-neutral-400">
                    {HOST_INVITE_DISPLAY_URL.replace(/^https?:\/\//, "")}
                  </div>
                  <button
                    type="button"
                    className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-bold text-surface transition-colors hover:bg-neutral-200 active:scale-95"
                  >
                    Copy Link
                  </button>
                </div>
              </section>

              <section className="flex h-[min(600px,70vh)] flex-col overflow-hidden rounded-xl bg-surface-container-low shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 p-6">
                  <h2 className="font-headline text-lg font-bold uppercase tracking-widest text-neutral-400">Live Queue</h2>
                  <span className="text-xs font-bold text-primary">{queue.length} TRACKS</span>
                </div>

                <div className="custom-scrollbar flex-1 space-y-1 overflow-y-auto p-2">
                  {queue.map((song, idx) => (
                    <div
                      key={song.id}
                      className={cn(
                        "group flex items-center gap-4 rounded-lg p-4 transition-all",
                        song.isTopVoted
                          ? "border-l-4 border-primary bg-primary/10"
                          : "opacity-80 hover:bg-white/5 hover:opacity-100",
                      )}
                    >
                      <span
                        className={cn(
                          "w-6 text-lg font-black",
                          song.isTopVoted ? "text-primary" : "text-neutral-600",
                        )}
                      >
                        {idx + 1}
                      </span>
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-neutral-800">
                        <img alt="" className="h-full w-full object-cover" src={song.thumbnail} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-bold">{song.title}</h4>
                        <p className="truncate text-xs text-neutral-500">{song.author}</p>
                        {song.addedBy ? (
                          <p className="mt-0.5 truncate text-[11px] font-medium text-neutral-600">
                            Added by {song.addedBy}
                          </p>
                        ) : null}
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-2 rounded-full px-3 py-1.5",
                          song.isTopVoted ? "bg-primary/20 text-primary" : "text-neutral-500",
                        )}
                      >
                        <span
                          className="material-symbols-outlined text-xs"
                          style={song.isTopVoted ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          thumb_up
                        </span>
                        <span className="text-xs font-black">{song.votes}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-surface-container-high p-4">
                  <button
                    type="button"
                    className="w-full rounded-lg bg-surface-variant py-3 text-sm font-bold text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    Add Track to Queue
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <div className="fixed bottom-6 left-1/2 z-50 w-[90%] -translate-x-1/2 md:hidden">
        <div className="flex items-center gap-4 rounded-lg border border-white/5 bg-surface-container-high/60 p-4 shadow-2xl backdrop-blur-3xl">
          <img
            alt=""
            className="h-12 w-12 shrink-0 rounded-md object-cover"
            src={HOST_SESSION_MOCK.nowPlaying.albumArtUrl}
          />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-bold">{HOST_SESSION_MOCK.nowPlaying.title}</h4>
            <p className="truncate text-[10px] text-neutral-400">{HOST_SESSION_MOCK.nowPlaying.author.split(" • ")[0]}</p>
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
    </div>
  );
}
