import type { SongViewModel } from "./types";

export function sortQueueByVotes(queue: SongViewModel[]): SongViewModel[] {
  return [...queue].sort((a, b) => b.votes - a.votes);
}

export function getTopVotedSong(queue: SongViewModel[]): SongViewModel | undefined {
  return sortQueueByVotes(queue)[0];
}

export function getQueueCountLabel(queue: SongViewModel[]): string {
  return `${queue.length} tracks remaining`;
}
