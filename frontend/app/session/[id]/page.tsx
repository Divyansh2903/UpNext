"use client";

import { use, useState, FormEvent } from "react";
import Link from "next/link";
import { UpNextWordmark } from "../../components/UpNextWordmark";

type Song = {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  votes: number;
  isTopVoted?: boolean;
};

const INITIAL_QUEUE: Song[] = [
  {
    id: "q1",
    title: "Midnight City (Remix)",
    author: "M83 • Neon Nights",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFVrVzgMcsLB-1-cGODgaVtjfCsnk5sf8VKz0HkwpMAHu6f4gNRdC84Ovrb7tFga73y9g0i4AXUHZA_3kclXkn3cPDqtuau_cMle7fPs619TcsaPkIZzgrPMBMuP8TV2fUy1ErLZGK_HZWeIwW9x_D2CJXDEEGsxw-gj0e_PVrPbiG9BkqOl8IORcvZioMbR47hSfOMtMLGKIi9QIv19r5k56oQb7TVZmEpzxmE0oiOJ9nIuex6QD9B9LYzIsgUMb6vl6uEb2iVuM",
    votes: 24,
    isTopVoted: true,
  },
  {
    id: "q2",
    title: "Stay High",
    author: "Tove Lo • Queen of the Clouds",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaOdDrX1AW8k_5ibJ1x5GDrfMnGCSP6GTGVaKvErx_6vR8tq2xlOEsyL7mykutmbQaLVZePwptV6u4RhHGibnkWZfQbbcdUDxCyxG5Bdi-8HGm6v_uZCNlN9ld-mBqagBaBzYezGew8y5fvP0elwhB7LX6V0jbXohL4nHFnsaQ5oD0Bx5SYaLnxBJFso_SzASJV6GQZtYekRRyt3cSN_7hYAIEroajdsSYrV_Wtwo7kAKz4wR0ilFMKuso64N7BdBjSmGkWTnkhTg",
    votes: 8,
  },
  {
    id: "q3",
    title: "After Hours",
    author: "The Weeknd • After Hours",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3fxdol4CGCGiEq2pB-Kxtcy08FF8aM3tWxE86G1ZTCunmMejaNnVE28wEehepOcXeUJ1zFNXaKaLrWDDTcA5CiD5_lSO0Erc4HdvE3VX9Yqnyce6QmPLNfmHaK5QoAPOlJliZXYjfbO9Bb97hdQ1KZ4U0rEWIJ-hXhVdIg0NLDzJfUGVBu_LeaiEQcyPjKBlXVKhUNyGSTGOnrhSYB8T2lvnuhp-7wAavtBYCTg9I3JIzAJmQp50vChPOxhIvKKUVthYiALZL0UU",
    votes: 3,
  }
];

export default function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [queue, setQueue] = useState<Song[]>(INITIAL_QUEUE);
  const [searchQuery, setSearchQuery] = useState("");

  const handleVote = (id: string) => {
    setQueue((prev) => {
      const newQueue = prev.map((s) => {
        if (s.id === id) {
          return { ...s, votes: s.votes + 1 };
        }
        return s;
      });
      return newQueue.sort((a, b) => b.votes - a.votes);
    });
  };

  const handleAddSong = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const newSong: Song = {
      id: Math.random().toString(),
      title: searchQuery,
      author: "YouTube User",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&q=80",
      votes: 1,
    };

    setQueue((prev) => [...prev, newSong].sort((a, b) => b.votes - a.votes));
    setSearchQuery("");
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen">
      {/* TopNavBar */}
      <header className="bg-neutral-950/40 backdrop-blur-2xl text-neutral-400 font-public tracking-tight font-bold shadow-[0px_40px_80px_-10px_rgba(0,0,0,0.4)] docked full-width top-0 sticky flex justify-between items-center px-6 py-4 w-full z-50">
        <UpNextWordmark />
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <a className="text-orange-400 font-bold hover:text-orange-300 transition-colors duration-300 scale-95 active:scale-90 transition-transform" href="#">Live Session</a>
            <a className="text-neutral-400 hover:text-orange-300 transition-colors duration-300 scale-95 active:scale-90 transition-transform" href="#">Queue</a>
            <a className="text-neutral-400 hover:text-orange-300 transition-colors duration-300 scale-95 active:scale-90 transition-transform" href="#">History</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-neutral-400 hover:text-orange-300 cursor-pointer">group</span>
          <Link href={`/session/${id}/host`} title="Switch to Host View">
            <span className="material-symbols-outlined text-neutral-400 hover:text-orange-300 cursor-pointer">settings</span>
          </Link>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest ring-1 ring-outline-variant/20">
            <img alt="Host avatar" className="w-full h-full object-cover" data-alt="close up of a stylish young adult portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoq3fTxD2aHtAeCaf-4uWpw9tAXd0vw3YULddp8ztuQPJnr1ZEQQPm7gtEByG_eD9zUPPOyM2TwuQ4U8_xbOxlPm6ofxfAR2dF4O-zXk2KrvDWH1jCcahRSrDbJHDiCzQoFaw8muAqrn19OZ_fm1R1kiQr2Y9U0ihQySWmiKkiuHOJLqkI6N_DS8M86dEzRyHXg7svfA-MTMqM0rxU6q2MYG7EthNEV_JXQRE4xoibKdPV2TYRkIxU2cr46913UkEle_kX03rcqaw" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Participant Identity Header */}
        <section className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-primary font-label text-xs uppercase tracking-[0.2em] font-bold">Session Identity</span>
            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl md:text-5xl font-headline font-black tracking-tighter">Joined as <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Alex Rivera</span></h1>
              <button className="text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-surface-container-low px-5 py-3 rounded-full outline outline-1 outline-outline-variant/10">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-medium text-on-surface-variant">48 Listeners Tuned In</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Queue & Add */}
          <div className="lg:col-span-8 space-y-8">
            {/* Add to Queue Section */}
            <div className="glass-panel p-8 rounded-lg outline outline-1 outline-outline-variant/10">
              <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Add to Queue
              </h2>
              <form onSubmit={handleAddSong} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">link</span>
                  <input 
                    className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline/50 pl-12 pr-4 py-4 rounded-md bg-surface-variant/20 focus:bg-surface-variant/40 transition-all outline outline-1 outline-outline-variant/20 focus:outline-primary/40" 
                    placeholder="Paste YouTube or Spotify link..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-primary to-secondary text-on-primary font-bold px-8 py-4 rounded-md shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap">
                  Add Track
                </button>
              </form>
              <p className="mt-4 text-xs text-outline font-medium">Tracks are voted on by the community before playing.</p>
            </div>

            {/* Live Queue */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-headline font-bold">Upcoming Tracks</h3>
                <span className="text-sm text-outline font-medium">{queue.length} tracks remaining</span>
              </div>
              <div className="space-y-4">
                {queue.map((song) => (
                  <div key={song.id} className="glass-panel group p-4 rounded-lg flex items-center gap-6 outline outline-1 outline-outline-variant/10 hover:outline-primary/30 transition-all">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                      <img className="w-full h-full object-cover" data-alt={song.title} src={song.thumbnail} alt={song.title} />
                      {song.isTopVoted && <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>}
                    </div>

                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-on-surface truncate">{song.title}</h4>
                      <p className="text-sm text-on-surface-variant truncate">{song.author}</p>
                      
                      {song.isTopVoted && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full ring-2 ring-surface bg-surface-container">
                              <img className="w-full h-full object-cover rounded-full" alt="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCePyb7bIu4bRRPxJkDQJYSSei8U3MxRIeWXmlU95lPwEgZG0-4LG5snY7JFBszudKjCNnGPO4v7il_yjel-c-kDDLeNOPSl3FV2WfavomqEyYAG776hWFtrJUqPnLeM1H6OO-5R28gU7GbWU2pGFilPvwyeUx-7rIATpbRyaUcWkx6_EluJcAGYSi8BqMWR-9thDrl06mWG9BnIL0UC6EbZGpMG5dPLHdjWKTj8tbfGttyN2kZQvER6GPtLv5RUXyEJ2d1QhCy3pQ" />
                            </div>
                            <div className="w-6 h-6 rounded-full ring-2 ring-surface bg-surface-container">
                              <img className="w-full h-full object-cover rounded-full" alt="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPHcrbXi-0PDiH42PYV9DY3eWtgyzHvrMDPyMj-cFGuSTDlMBoPlTDP67dZV2jW8f_P0CNATtEYrghmTWmOF3-mgFPOwduC5xob533JN-70OzIMSSGlhcAQBexRbRquj1lfBjrU9LyZ_CK8_NM6MCA7phs83Mfnr58cc-ee7U7bnO37HPEJ4oDmythxY1vLE2LkBiS9vL8ydccUYpc20xBaQ-Q8syykZeCO2R1ZBYogXNoD65a7o9QoAmnsWoSDFoZbnVpKqZUfv8" />
                            </div>
                            <div className="w-6 h-6 rounded-full ring-2 ring-surface bg-surface-container flex items-center justify-center text-[8px] font-bold text-outline">
                              +12
                            </div>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Voted by community</span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => handleVote(song.id)}
                      className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all active:scale-110 ${
                        song.isTopVoted 
                          ? "bg-primary/10 hover:bg-primary/20" 
                          : "bg-surface-container-highest/50 hover:bg-surface-container-highest"
                      }`}
                    >
                      <span 
                        className={`material-symbols-outlined ${song.isTopVoted ? "text-primary" : "text-on-surface-variant"}`} 
                        style={song.isTopVoted ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >expand_less</span>
                      <span className={`text-sm font-black ${song.isTopVoted ? "text-primary" : "text-on-surface-variant"}`}>{song.votes}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Currently Playing (Orbital Player Inspired) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="glass-panel p-6 rounded-lg outline outline-1 outline-outline-variant/20 relative overflow-hidden">
              {/* Background Ambient Glow */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 blur-[60px] rounded-full"></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary/10 blur-[60px] rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Now Playing</span>
                </div>
                
                <div className="aspect-square rounded-lg overflow-hidden mb-6 shadow-2xl shadow-black/60 group">
                  <img className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" alt="album art" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfBUmwzkXk8GGrB8wFiFTDIMUTFQ71dwwSOHfhxWQ5U0134Bf30J5ge9UVrHir3D0DEqEpOENfdkcp-gPsRuLxRvtGnI_QNtu-Usx9vPNYkHltz0YJaR76iEId4Cpi70_4ruhhKp3vLWoxh_jBeg3lRkvFGEObxEhQJqXDgrX5KzDT7rNmfdgiZCkMe4bNQrLkt8cE9De_tm00yYGLWFbWBaIJNX7a6dR_Ro79wV0Pdrvvt5rlMjbJEiuWBq35uduFNMm9Rq10374" />
                </div>
                
                <div className="space-y-1 mb-8">
                  <h3 className="text-2xl font-headline font-black tracking-tight leading-tight">Starboy</h3>
                  <p className="text-on-surface-variant font-medium">The Weeknd ft. Daft Punk</p>
                </div>
                
                {/* Progress Bar */}
                <div className="space-y-2 mb-4">
                  <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary w-2/3 shadow-[0_0_8px_rgba(255,144,109,0.5)]"></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-outline uppercase tracking-tighter">
                    <span>2:14</span>
                    <span>3:50</span>
                  </div>
                </div>
                
                {/* Active Voters */}
                <div className="pt-6 border-t border-outline-variant/10">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-3">Live Reactions</p>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img className="w-8 h-8 rounded-full border-2 border-surface" alt="listener profile 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW1GmI82sv2Qj_yBJ0jgdkw41MhbRL09vDWAwtTRbdeCUGm4sxaQ7A6cHUuzmUjtBxiGghT5dSRty052LuWyg-nOUVTWz4ORRvyLOGIy9etIFtOfoZ-F8dYEGG4pG8TJcwbLQLZ28xqqUuMPSoXDzqapxUUASDh-yv0ksWpnFgN88Q0efqu7tY0dCUwLHZ_olHdStWfJWL1-4r-zy8lZ6heNlOjEueSnGwJ1W2kkr36m2DPMm_Q9rhDME0XPs_eeZKfbw-XG45SWQ" />
                      <img className="w-8 h-8 rounded-full border-2 border-surface" alt="listener profile 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7HAMGK-VJvcXoIdzSvd56FhYh9DNJgWhtitOMpatZmbDq2SR0W0Wkjjmw_ZBEQLFJca11ROV3zGaak71AtL7wdQvUUkBfjXx-3DxLb5QLnytYXVIZBhrmZOR0SKtmXuViUEMtCdf_xY7U2VfvsOJjixNX3PAfkNb92WXIalK3OwoyduM6IMKttkNeaIz4G7lZQHMqgdadi5zBCFd8N0mADrUy7ekrhNPUodmk5qim45UrivRvJkZ2CtZF_uhZpinr81QO9go6tEk" />
                      <img className="w-8 h-8 rounded-full border-2 border-surface" alt="listener profile 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDfApIQMB-SN6EI7uOCik8ztuMSWcZPXKLNR1reMcbCe1l9_xBUXZegUPISJrFQtno8hNyxRRM7DylUWUGKqsKFuwIH9jXg9A94xeruHbY7YvVinw2UHMzDS0P-9IU82gJEaEpzq8_tVyb-Mn1DANFfJSrl3mgjpN4W2hdT2lEAVHr1rNBZ6VwgoINNNL5TBcjRhYzjOcIHEuV4QX-yUm-_4keFE0X2EBiK0O1K7sULWupNRQ8hihY-GkqMquNCLa3VoBylW9VpV4" />
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant italic">Sarah and 4 others are vibing...</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat/Activity Prompt */}
            <button className="w-full mt-6 py-4 rounded-lg glass-panel outline outline-1 outline-outline-variant/10 text-on-surface-variant font-bold text-sm hover:text-primary transition-colors flex items-center justify-center gap-2">
               <span className="material-symbols-outlined text-sm">chat_bubble</span>
               Open Session Chat
            </button>
          </div>
        </div>
      </main>

      {/* SideNavBar Logic for Desktop */}
      <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 bg-neutral-950/60 backdrop-blur-3xl font-manrope text-sm bg-gradient-to-r from-neutral-900/20 to-transparent border-r border-neutral-800/20 z-40 pt-24">
        <div className="px-6 mb-8">
            <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Global Room</span>
            </div>
            <p className="text-neutral-500 text-xs">48 active listeners</p>
        </div>
        
        <nav className="flex flex-col gap-1">
            <a href="#" className="text-orange-500 bg-orange-500/10 rounded-r-full py-3 px-6 flex items-center gap-4 transition-all duration-500 ease-out">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
                Live Session
            </a>
            <a href="#" className="text-neutral-500 py-3 px-6 flex items-center gap-4 hover:bg-neutral-800/30 transition-all duration-500 ease-out">
                <span className="material-symbols-outlined">queue_music</span>
                Queue
            </a>
            <a href="#" className="text-neutral-500 py-3 px-6 flex items-center gap-4 hover:bg-neutral-800/30 transition-all duration-500 ease-out">
                <span className="material-symbols-outlined">history</span>
                History
            </a>
            <a href="#" className="text-neutral-500 py-3 px-6 flex items-center gap-4 hover:bg-neutral-800/30 transition-all duration-500 ease-out">
                <span className="material-symbols-outlined">explore</span>
                Discovery
            </a>
        </nav>
        
        <div className="mt-auto p-6">
            <button className="w-full bg-surface-container-highest text-on-surface font-bold py-3 px-4 rounded-md text-xs hover:bg-primary hover:text-on-primary transition-all">
                Invite Friends
            </button>
        </div>
      </aside>

      {/* Navigation Spacer for Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0"></div>
    </div>
  );
}
