import { z } from "zod";

export const JoinSessionMessage = z.object({
  type: z.literal("JOIN_SESSION"),
  sessionId: z.uuid(),
  userId: z.uuid(),
  name: z.string().trim().min(1).max(40),
  token: z.string().optional(),
});

export const AddSongMessage = z.object({
  type: z.literal("ADD_SONG"),
  sessionId: z.uuid(),
  videoId: z.string().trim().min(1).max(256),
});

export const VoteMessage = z.object({
  type: z.literal("VOTE"),
  sessionId: z.uuid(),
  songId: z.uuid(),
  userId: z.uuid(),
});

export const SongEndedMessage = z.object({
  type: z.literal("SONG_ENDED"),
  sessionId: z.uuid(),
});

export const SyncPlaybackMessage = z.object({
  type: z.literal("SYNC_PLAYBACK"),
  sessionId: z.uuid(),
  elapsedSeconds: z.number().min(0).max(86400),
  paused: z.boolean(),
});

export const UpdateNameMessage = z.object({
  type: z.literal("UPDATE_NAME"),
  sessionId: z.uuid(),
  userId: z.uuid(),
  name: z.string().trim().min(1).max(40),
});

export const ClientMessage = z.discriminatedUnion("type", [
  JoinSessionMessage,
  AddSongMessage,
  VoteMessage,
  SongEndedMessage,
  SyncPlaybackMessage,
  UpdateNameMessage,
]);

export type ClientMessage = z.infer<typeof ClientMessage>;

export type ServerMessage =
  | { type: "SESSION_STATE"; queue: QueueEntry[]; currentSong: CurrentSong | null; participants: ParticipantDTO[] }
  | { type: "QUEUE_UPDATED"; queue: QueueEntry[] }
  | { type: "PLAY_SONG"; song: CurrentSong }
  | { type: "PLAYBACK_SYNC"; elapsedSeconds: number; paused: boolean }
  | { type: "PARTICIPANTS_UPDATED"; participants: ParticipantDTO[] }
  | { type: "ERROR"; code: string; message?: string };

export type QueueEntry = {
  id: string;
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  addedBy: string;
  votes: number;
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
