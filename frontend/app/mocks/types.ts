export type SongViewModel = {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  votes: number;
  /** Display name of who queued the track (maps from backend `addedBy` / participant). */
  addedBy?: string;
  isTopVoted?: boolean;
  /** Current viewer has cast a vote on this track. */
  votedByMe?: boolean;
};

export type ParticipantViewModel = {
  id: string;
  name: string;
  avatarUrl: string;
  joinedAt?: string;
};

export type SessionViewModel = {
  id: string;
  joinCode: string;
  roomName: string;
  hostName: string;
  hostAvatarUrl: string;
  listenerCount: number;
  nowPlaying: {
    title: string;
    author: string;
    albumArtUrl: string;
    elapsed: string;
    duration: string;
  };
};
