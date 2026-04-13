"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon, Users, Plus, Search, Crown, Music } from "lucide-react";
import { Button } from "../../components/Button";
import { SongCard, type Song } from "../../components/SongCard";
import { PlayerBar } from "../../components/PlayerBar";
import { cn } from "../../lib/utils";

// Mock initial data
const MOCK_QUEUE: Song[] = [
  {
    id: "s1",
    title: "Tame Impala - The Less I Know The Better",
    author: "Tame Impala",
    thumbnail: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&q=80",
    votes: 12,
    duration: "3:36",
    addedBy: "Alex",
  },
  {
    id: "s2",
    title: "Daft Punk - Get Lucky",
    author: "Daft Punk",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80",
    votes: 8,
    duration: "4:08",
    addedBy: "Sam",
  },
  {
    id: "s3",
    title: "The Weeknd - Blinding Lights",
    author: "The Weeknd",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-4289532d41a1?w=300&q=80",
    votes: 5,
    duration: "3:22",
    addedBy: "Jordan",
  },
  {
    id: "s4",
    title: "Arctic Monkeys - Do I Wanna Know?",
    author: "Arctic Monkeys",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80",
    votes: -2,
    duration: "4:32",
    addedBy: "Casey",
  }
];

export default function SessionPage({ params }: { params: { id: string } }) {
  const [isHost, setIsHost] = useState(false);
  const [queue, setQueue] = useState<Song[]>(MOCK_QUEUE);
  const [searchQuery, setSearchQuery] = useState("");

  const handleVote = (id: string, type: "up" | "down") => {
    setQueue((prev) => {
      const newQueue = prev.map((s) => {
        if (s.id === id) {
          return { ...s, votes: s.votes + (type === "up" ? 1 : -1) };
        }
        return s;
      });
      // Re-sort based on votes
      return newQueue.sort((a, b) => b.votes - a.votes);
    });
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const newSong: Song = {
      id: Math.random().toString(),
      title: searchQuery,
      author: "YouTube User",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=80",
      votes: 1, // Start with 1 vote from the adder
      duration: "?:??",
      addedBy: "You",
    };

    setQueue((prev) => [...prev, newSong].sort((a, b) => b.votes - a.votes));
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen pb-32">
      
      {/* Session Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Session</span>
              <span className="font-mono font-bold text-foreground">{params.id}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="font-medium">12 active</span>
            </div>
            <Button variant="secondary" size="sm" className="hidden sm:flex rounded-full">
              <LinkIcon className="w-4 h-4 mr-2" />
              Share Link
            </Button>
            
            {/* Host Toggle (For Demo Purposes) */}
            <Button 
              variant={isHost ? "primary" : "ghost"} 
              size="sm"
              onClick={() => setIsHost(!isHost)}
              className="rounded-full ml-4 border border-transparent shadow-none"
            >
              <Crown className={cn("w-4 h-4 mr-2", isHost ? "text-white" : "text-yellow-500")} />
              {isHost ? "Host View" : "Participant"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        
        {/* Add Song Input */}
        <div className="mb-10">
          <form onSubmit={handleAddSong} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Paste a YouTube link or search..."
              className="w-full bg-muted/40 border border-border text-foreground rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!searchQuery.trim()}
              className="absolute inset-y-2 right-2 h-auto w-10 bg-accent hover:bg-accent-light text-white rounded-xl shadow-lg shadow-accent/20"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </form>
        </div>

        {/* Queue Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Up Next</h2>
            <span className="text-sm text-muted-foreground">{queue.length} songs</span>
          </div>
          
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {queue.map((song, i) => (
                <SongCard 
                  key={song.id} 
                  song={song} 
                  rank={i + 1} 
                  isPlaying={i === 0} 
                  onVote={handleVote}
                />
              ))}
            </AnimatePresence>
            
            {queue.length === 0 && (
              <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border mt-4">
                <Music className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>The queue is empty.</p>
                <p className="text-sm">Be the first to add a song!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Render Player Bar if Host */}
      <AnimatePresence>
        {isHost && <PlayerBar />}
      </AnimatePresence>

    </div>
  );
}
