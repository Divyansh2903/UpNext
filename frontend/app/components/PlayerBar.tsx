"use client";

import { motion } from "framer-motion";
import { Play, Pause, SkipForward, Volume2 } from "lucide-react";
import { Button } from "./Button";

export function PlayerBar() {
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border px-4 py-4 md:px-8"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
        
        {/* Now Playing Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-md bg-[#222] shrink-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-purple-500/40" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-foreground truncate">Lo-Fi Beats to Relax/Study to</h4>
            <p className="text-xs text-muted-foreground truncate">Lofi Girl</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center flex-1 max-w-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 pointer-events-none">
              <span />
            </Button>
            <Button variant="primary" size="icon" className="w-12 h-12 rounded-full shadow-[0_0_15px_rgba(94,106,210,0.5)]">
              <Play className="w-5 h-5 ml-1 fill-white" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
              <SkipForward className="w-5 h-5 fill-current" />
            </Button>
          </div>
          <div className="w-full flex items-center gap-2 mt-2">
            <span className="text-[10px] tabular-nums text-muted-foreground">1:23</span>
            <div className="h-1 flex-1 bg-border rounded-full overflow-hidden relative group cursor-pointer">
              <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-accent rounded-full group-hover:bg-accent-light transition-colors" />
            </div>
            <span className="text-[10px] tabular-nums text-muted-foreground">3:45</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-end gap-3 flex-1">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <div className="w-24 h-1 bg-border rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-muted-foreground rounded-full" />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
