import { sortQueueByVotes } from "../mocks/selectors";
import type { ParticipantViewModel, SessionViewModel, SongViewModel } from "../mocks/types";
import type { CurrentSong, ParticipantDTO, QueueEntry } from "./types";

const FALLBACK_ART = "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80";

function formatDuration(durationSeconds: number | null): string {
  if (!durationSeconds || durationSeconds <= 0) {
    return "--:--";
  }
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function mapQueueToViewModel(queue: QueueEntry[], userId: string): SongViewModel[] {
  const sorted = sortQueueByVotes(
    queue.map((song) => ({
      id: song.id,
      title: song.title,
      author: "Unknown Artist",
      thumbnail: song.thumbnailUrl ?? FALLBACK_ART,
      votes: song.votes,
      addedBy: song.addedBy,
      votedByMe: song.voterIds?.includes(userId) ?? false,
    })),
  );
  return sorted.map((song, idx) => ({ ...song, isTopVoted: idx === 0 }));
}

export function mapParticipantsToViewModel(participants: ParticipantDTO[]): ParticipantViewModel[] {
  return participants.map((participant) => ({
    id: participant.id,
    name: participant.name,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=1f2937&color=ffffff`,
    joinedAt: participant.joinedAt,
  }));
}

export function mapNowPlaying(
  currentSong: CurrentSong | null,
  elapsed = "0:00",
  addedByLabel = "Host",
): SessionViewModel["nowPlaying"] {
  if (!currentSong) {
    return {
      title: "No song playing yet",
      author: "Queue a song to start",
      albumArtUrl: FALLBACK_ART,
      elapsed,
      duration: "--:--",
    };
  }

  return {
    title: currentSong.title,
    author: `Added by ${addedByLabel} : ${currentSong.votes} ${currentSong.votes < 2 ? "vote" : "votes"}`,
    albumArtUrl: currentSong.thumbnailUrl ?? FALLBACK_ART,
    elapsed,
    duration: formatDuration(currentSong.durationSeconds),
  };
}
