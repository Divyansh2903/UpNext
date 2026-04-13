"use client";

import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Play } from "lucide-react";
import { cn } from "../lib/utils";

export interface Song {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  votes: number;
  duration: string;
  addedBy: string;
}

interface SongCardProps {
  song: Song;
  rank: number;
  isPlaying?: boolean;
  onVote?: (id: string, type: "up" | "down") => void;
}

export function SongCard({ song, rank, isPlaying, onVote }: SongCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "group relative flex items-center gap-4 py-6 px-4 rounded-[var(--radius-xl)] border-0 backdrop-blur-sm transition-[background-color,box-shadow]",
        isPlaying
          ? "bg-elevated/90 shadow-[var(--shadow-now-playing)]"
          : "bg-elevated/70 shadow-none hover:bg-chip/80"
      )}
    >
      <div className="flex flex-col items-center justify-center w-8 shrink-0 text-muted-foreground font-mono text-sm">
        {isPlaying ? (
          <div className="flex items-end gap-1 h-4">
            <motion.div
              animate={{ height: [8, 16, 8] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="w-1 bg-accent rounded-full"
            />
            <motion.div
              animate={{ height: [12, 6, 12] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 bg-accent rounded-full"
            />
            <motion.div
              animate={{ height: [6, 14, 6] }}
              transition={{ repeat: Infinity, duration: 0.9 }}
              className="w-1 bg-accent rounded-full"
            />
          </div>
        ) : (
          `#${rank}`
        )}
      </div>

      <div className="relative w-16 h-12 shrink-0 rounded-[var(--radius-lg)] overflow-hidden bg-thumbnail">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
          style={{ backgroundImage: `url(${song.thumbnail})` }}
        />
        {isPlaying && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[1px]">
            <Play className="w-5 h-5 text-foreground fill-foreground" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <h4 className={cn("text-base font-semibold truncate font-label", isPlaying ? "text-accent-light" : "text-foreground")}>
          {song.title}
        </h4>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground font-label truncate">
          <span>{song.author}</span>
          <span>•</span>
          <span>{song.duration}</span>
          <span>•</span>
          <span>Added by {song.addedBy}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 pr-2">
        <button
          type="button"
          onClick={() => onVote?.(song.id, "up")}
          className="p-1.5 rounded-[var(--radius-md)] text-muted-foreground hover:text-success hover:bg-success-muted transition-colors"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <span
          className={cn(
            "font-mono font-medium w-6 text-center tabular-nums",
            song.votes > 0 ? "text-success" : song.votes < 0 ? "text-danger" : "text-muted-foreground"
          )}
        >
          {song.votes > 0 ? `+${song.votes}` : song.votes}
        </span>

        <button
          type="button"
          onClick={() => onVote?.(song.id, "down")}
          className="p-1.5 rounded-[var(--radius-md)] text-muted-foreground hover:text-danger hover:bg-danger-muted transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
