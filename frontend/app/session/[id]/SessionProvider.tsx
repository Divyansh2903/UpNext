"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ParticipantViewModel, SessionViewModel, SongViewModel } from "../../mocks/types";
import { mapNowPlaying, mapParticipantsToViewModel, mapQueueToViewModel } from "../../lib/sessionAdapters";
import { SessionSocketClient } from "../../lib/ws";
import type { ClientMessage, CurrentSong, ParticipantDTO, QueueEntry, ServerMessage } from "../../lib/types";
import { getOrCreateGuestUserId } from "../../lib/sessionIdentity";

type SessionContextValue = {
  session: SessionViewModel;
  queue: SongViewModel[];
  participants: ParticipantViewModel[];
  currentVideoId: string | null;
  playbackProgressPercent: number;
  userId: string;
  displayName: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  voteActivity: Array<{ songId: string; songTitle: string; voterUserId: string; voterName: string; cast: boolean; createdAt: string }>;
  sendVote: (songId: string) => void;
  sendAddSong: (videoId: string) => void;
  sendSongEnded: () => void;
  sendPlaybackSync: (elapsedSeconds: number, paused: boolean) => void;
  updateName: (name: string) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const RECONNECT_DELAY_MS = 1500;

function formatElapsed(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function mapQueueWithParticipantNames(queue: QueueEntry[], participants: ParticipantDTO[], userId: string): SongViewModel[] {
  const nameByUserId = new Map(participants.map((participant) => [participant.userId, participant.name]));
  return mapQueueToViewModel(queue, userId).map((song) => ({
    ...song,
    addedBy: song.addedBy ? nameByUserId.get(song.addedBy) ?? song.addedBy : song.addedBy,
  }));
}

type SessionProviderProps = {
  children: React.ReactNode;
  sessionId: string;
  joinCode: string;
  hostName: string;
  roomName: string;
  initialListenerCount?: number;
  token?: string;
  initialDisplayName?: string;
};

export function SessionProvider({
  children,
  sessionId,
  joinCode,
  hostName,
  roomName,
  initialListenerCount = 0,
  token,
  initialDisplayName,
}: SessionProviderProps) {
  const [queue, setQueue] = useState<SongViewModel[]>([]);
  const [participants, setParticipants] = useState<ParticipantViewModel[]>([]);
  const [currentSong, setCurrentSong] = useState<CurrentSong | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participantDirectory, setParticipantDirectory] = useState<ParticipantDTO[]>([]);
  const [voteActivity, setVoteActivity] = useState<
    Array<{ songId: string; songTitle: string; voterUserId: string; voterName: string; cast: boolean; createdAt: string }>
  >([]);
  const [playbackElapsedSeconds, setPlaybackElapsedSeconds] = useState(0);
  const [playbackPaused, setPlaybackPaused] = useState(true);
  const [playbackUpdatedAtMs, setPlaybackUpdatedAtMs] = useState<number | null>(null);
  const [clockMs, setClockMs] = useState(() => Date.now());
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "Guest");
  const [userId] = useState(() => getOrCreateGuestUserId());
  const socketClientRef = useRef<SessionSocketClient | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const joinMessageRef = useRef<ClientMessage | null>(null);
  const reconnectRef = useRef<() => void>(() => undefined);
  const participantDirectoryRef = useRef<ParticipantDTO[]>([]);
  const terminalErrorRef = useRef(false);

  useEffect(() => {
    if (playbackPaused || !currentSong) return;
    const interval = window.setInterval(() => {
      setClockMs(Date.now());
    }, 500);
    return () => window.clearInterval(interval);
  }, [playbackPaused, currentSong]);

  const currentElapsedSeconds = useMemo(() => {
    if (!currentSong) return 0;
    const duration = currentSong.durationSeconds ?? null;
    const baseline = playbackElapsedSeconds;
    if (playbackPaused || !playbackUpdatedAtMs) {
      return duration ? Math.min(baseline, duration) : baseline;
    }
    const derived = baseline + Math.floor((clockMs - playbackUpdatedAtMs) / 1000);
    return duration ? Math.min(derived, duration) : derived;
  }, [clockMs, currentSong, playbackElapsedSeconds, playbackPaused, playbackUpdatedAtMs]);

  const playbackProgressPercent = useMemo(() => {
    const duration = currentSong?.durationSeconds ?? 0;
    if (!duration || duration <= 0) return 0;
    return Math.max(0, Math.min(100, (currentElapsedSeconds / duration) * 100));
  }, [currentElapsedSeconds, currentSong?.durationSeconds]);

  const currentSongAddedByName = useMemo(() => {
    if (!currentSong?.addedBy) return "Host";
    return participantDirectory.find((participant) => participant.userId === currentSong.addedBy)?.name ?? currentSong.addedBy;
  }, [currentSong, participantDirectory]);

  const session = useMemo<SessionViewModel>(
    () => ({
      id: sessionId,
      joinCode,
      roomName,
      hostName,
      hostAvatarUrl: "",
      listenerCount: participants.length || initialListenerCount,
      nowPlaying: mapNowPlaying(currentSong, formatElapsed(currentElapsedSeconds), currentSongAddedByName),
    }),
    [currentElapsedSeconds, currentSong, currentSongAddedByName, hostName, initialListenerCount, joinCode, participants.length, roomName, sessionId],
  );

  const handleServerMessage = useCallback((message: ServerMessage) => {
    if (message.type === "ERROR") {
      terminalErrorRef.current = message.code === "SessionExpired" || message.code === "SessionNotFound";
      setError(message.code);
      return;
    }

    if (message.type === "SESSION_STATE") {
      setQueue(mapQueueWithParticipantNames(message.queue, message.participants, userId));
      participantDirectoryRef.current = message.participants;
      setParticipantDirectory(message.participants);
      setParticipants(mapParticipantsToViewModel(message.participants));
      setCurrentSong(message.currentSong);
      setVoteActivity([]);
      setPlaybackElapsedSeconds(0);
      setPlaybackPaused(false);
      setPlaybackUpdatedAtMs(Date.now());
      setError(null);
      return;
    }

    if (message.type === "QUEUE_UPDATED") {
      setQueue(mapQueueWithParticipantNames(message.queue, participantDirectoryRef.current, userId));
      return;
    }

    if (message.type === "VOTE_ACTIVITY") {
      setVoteActivity((prev) => [
        ...prev,
        {
          songId: message.songId,
          songTitle: message.songTitle,
          voterUserId: message.voterUserId,
          voterName: message.voterName,
          cast: message.cast,
          createdAt: message.createdAt,
        },
      ]);
      return;
    }

    if (message.type === "PARTICIPANTS_UPDATED") {
      participantDirectoryRef.current = message.participants;
      setParticipantDirectory(message.participants);
      setParticipants(mapParticipantsToViewModel(message.participants));
      return;
    }

    if (message.type === "PLAY_SONG") {
      setCurrentSong(message.song);
      setPlaybackElapsedSeconds(0);
      setPlaybackPaused(false);
      setPlaybackUpdatedAtMs(Date.now());
      return;
    }

    if (message.type === "PLAYBACK_SYNC") {
      setPlaybackElapsedSeconds(Math.max(0, Math.floor(message.elapsedSeconds)));
      setPlaybackPaused(message.paused);
      setPlaybackUpdatedAtMs(Date.now());
    }
  }, [userId]);

  const connect = useCallback(async () => {
    const socketClient = new SessionSocketClient();
    socketClientRef.current = socketClient;
    setIsConnecting(true);

    socketClient.connect();
    const unsubMessage = socketClient.onMessage(handleServerMessage);
    const unsubClose = socketClient.onClose(() => {
      setIsConnected(false);
      setIsConnecting(false);
      if (terminalErrorRef.current) {
        return;
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = window.setTimeout(() => {
        reconnectRef.current();
      }, RECONNECT_DELAY_MS);
    });

    try {
      await socketClient.waitUntilOpen();
      terminalErrorRef.current = false;
      setIsConnected(true);
      setIsConnecting(false);
      const joinMessage: ClientMessage = {
        type: "JOIN_SESSION",
        sessionId,
        userId,
        name: displayName || "Guest",
        token,
      };
      joinMessageRef.current = joinMessage;
      socketClient.send(joinMessage);
      setError(null);
    } catch {
      setError("ConnectionFailed");
      setIsConnecting(false);
    }

    return () => {
      unsubMessage();
      unsubClose();
    };
  }, [displayName, handleServerMessage, sessionId, token, userId]);

  useEffect(() => {
    reconnectRef.current = () => {
      connect().catch(() => {
        setError("ReconnectFailed");
      });
    };
  }, [connect]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    connect()
      .then((result) => {
        cleanup = result;
      })
      .catch(() => {
        setError("ConnectionFailed");
      });

    return () => {
      if (cleanup) cleanup();
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      socketClientRef.current?.disconnect();
    };
  }, [connect]);

  const safeSend = useCallback((message: ClientMessage) => {
    try {
      socketClientRef.current?.send(message);
    } catch {
      setError("SocketNotReady");
    }
  }, []);

  const sendVote = useCallback(
    (songId: string) => {
      safeSend({
        type: "VOTE",
        sessionId,
        songId,
        userId,
      });
    },
    [safeSend, sessionId, userId],
  );

  const sendAddSong = useCallback(
    (videoId: string) => {
      safeSend({
        type: "ADD_SONG",
        sessionId,
        videoId,
      });
    },
    [safeSend, sessionId],
  );

  const sendSongEnded = useCallback(() => {
    safeSend({
      type: "SONG_ENDED",
      sessionId,
    });
  }, [safeSend, sessionId]);

  const sendPlaybackSync = useCallback(
    (elapsedSeconds: number, paused: boolean) => {
      safeSend({
        type: "SYNC_PLAYBACK",
        sessionId,
        elapsedSeconds: Math.max(0, Math.floor(elapsedSeconds)),
        paused,
      });
    },
    [safeSend, sessionId],
  );

  const updateName = useCallback(
    (name: string) => {
      setDisplayName(name);
      safeSend({
        type: "UPDATE_NAME",
        sessionId,
        userId,
        name,
      });
    },
    [safeSend, sessionId, userId],
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      queue,
      participants,
      currentVideoId: currentSong?.videoId ?? null,
      playbackProgressPercent,
      userId,
      displayName,
      isConnected,
      isConnecting,
      error,
      voteActivity,
      sendVote,
      sendAddSong,
      sendSongEnded,
      sendPlaybackSync,
      updateName,
    }),
    [
      displayName,
      error,
      voteActivity,
      isConnected,
      isConnecting,
      participants,
      playbackProgressPercent,
      queue,
      sendAddSong,
      sendPlaybackSync,
      sendSongEnded,
      sendVote,
      session,
      currentSong?.videoId,
      userId,
      updateName,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionState() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionState must be used within SessionProvider");
  }
  return context;
}
