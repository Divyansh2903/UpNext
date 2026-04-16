export type ApiErrorPayload = {
  error?: string;
  message?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type SessionResponse = {
  session: {
    id: string;
    joinCode: string;
    status: string;
    createdAt: string;
    expiresAt: string;
    host?: {
      id: string;
      displayName?: string | null;
    };
  };
};

export type HostSessionSummary = {
  id: string;
  joinCode: string;
  status: string;
  createdAt: string;
  expiresAt: string;
  /** True while expiresAt is in the future (room still joinable). */
  active: boolean;
  participantsCount: number;
};

export type HostSessionsResponse = {
  sessions: HostSessionSummary[];
};

export type HostSessionSummaryResponse = {
  session: {
    id: string;
    joinCode: string;
    createdAt: string;
    expiresAt: string;
    active: boolean;
  };
  participants: Array<{
    id: string;
    userId: string;
    name: string;
    joinedAt: string;
  }>;
  songs: Array<{
    id: string;
    title: string;
    thumbnailUrl: string | null;
    addedBy: string;
    votes: number;
    createdAt: string;
  }>;
};

export type QueueEntry = {
  id: string;
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  addedBy: string;
  votes: number;
  voterIds: string[];
  createdAt: string;
};

export type CurrentSong = {
  id: string;
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  addedBy: string;
  votes: number;
};

export type ParticipantDTO = {
  id: string;
  userId: string;
  name: string;
  joinedAt: string;
};

export type ClientMessage =
  | { type: "JOIN_SESSION"; sessionId: string; userId: string; name: string; token?: string }
  | { type: "ADD_SONG"; sessionId: string; videoId: string }
  | { type: "VOTE"; sessionId: string; songId: string; userId: string }
  | { type: "SONG_ENDED"; sessionId: string }
  | { type: "SYNC_PLAYBACK"; sessionId: string; elapsedSeconds: number; paused: boolean }
  | { type: "UPDATE_NAME"; sessionId: string; userId: string; name: string };

export type ServerMessage =
  | { type: "SESSION_STATE"; queue: QueueEntry[]; currentSong: CurrentSong | null; participants: ParticipantDTO[] }
  | { type: "QUEUE_UPDATED"; queue: QueueEntry[] }
  | { type: "VOTE_ACTIVITY"; songId: string; songTitle: string; voterUserId: string; voterName: string; cast: boolean; createdAt: string }
  | { type: "PLAY_SONG"; song: CurrentSong }
  | { type: "PLAYBACK_SYNC"; elapsedSeconds: number; paused: boolean }
  | { type: "PARTICIPANTS_UPDATED"; participants: ParticipantDTO[] }
  | { type: "ERROR"; code: string; message?: string };
