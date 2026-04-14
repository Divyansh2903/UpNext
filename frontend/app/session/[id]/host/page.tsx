"use client";

import Link from "next/link";
import { UpNextWordmark } from "../../../components/UpNextWordmark";
import { use, useState } from "react";

type HostQueueItem = {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  votes: number;
  isTopVoted?: boolean;
};

const MOCK_QUEUE: HostQueueItem[] = [
  {
    id: "q1",
    title: "Neon Horizon",
    author: "Lofi Girl",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUhZUgIcggsPEbRuQ-RRViE2Y3t1H8FIt80G_84LVdM18AE2l5oGxAKvvJfC49-kfHhZFTa8PjevTzuXZj9-FlVBPU3VI_FHL5db6hjkSEzmMwpj_ovDcjarfXP-pKTpSs7K5ZthZUVaBRhAhDCOsPRSrW5JHgcZT1hvVzaO2NW16magW1KwNqvqAkh9b7B2NhaUVjj-eLNs16-JRkqeymNa68cjptzQp_7Y8fzdVfbQ-XU5G1jiaHSCyURUhRiYASHSVbhycPG9U",
    votes: 124,
    isTopVoted: true,
  },
  {
    id: "q2",
    title: "Starlight Drift",
    author: "Solaris",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoK_mAE1EHGBUmxZ6CnDc7aZ1IFOWhTshprsg5adkZEwTV4DukfoHNKIGlvkog2_LFgIurGE4lT_67f0rAaCl1Pne4p-aANHAYDqt9fPggbZo335I8kZFqclY8puxio6Ygf9CouxBPnCU2CDFENClaB45W58aYYcIE5hydGeC4iKVIJB-fcqeX507GMIJxxR0_A4nMXm1QIYwaAcc3guAYdg5-eyejD5U9nmhcy-LWL29HfjdZf0iDEutUN9d30Y7RgdxcPggDiOA",
    votes: 89,
  },
  {
    id: "q3",
    title: "Velvet Rain",
    author: "The Chillwaves",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1Gv5qIwmnE2QtKgiyYIyNISRhYahZAiLc3RY7xlD8WBApQPSqDcpLEKfYNBjwRBdXjV568v0MUa6EyKyW7Gh2COJBfKyl4JMPoM5LUpukyMt8-hNcP9jQytnq7UgSnnY-4dOBSk1VAeQiFLQ9vt9zTnJQyOPfsY_jIP036oYEovZn4nsxbWNlD-ZX4htMxBYLwqK6DpHut7wbC0Ej3OW5Em5a_qlYzdiWh4_6x_v11YpBpX1hQ1_OWRFaRMHLg3PkLfpUKbOJwsI",
    votes: 42,
  },
  {
    id: "q4",
    title: "Overdrive",
    author: "Racer X",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8lefKwUB_7_5TG0y-qKiIBctp9_HyKZ-U-NPgDR7n6CxYHKyUMwS0PeKyA9enK3XiRl-MT5JVzmCEjY3scKyzXFKN0ON8OBJgJy9MkDaDtaL87rQWV1brdcih6lH7anU7yRkh60pNAPPxfiigKd1v8QqNtj5QxmvqzAbQ2vSdxK_vfoFggKijb9AYT5eAYsUhyR9SHfW__oqF2rAWglf9cBmk4ZFIqNeNFxOQBedYM3IiQcoWxISRQW8IKtSD4jR37cgJF1sw3bI",
    votes: 18,
  }
];

export default function HostViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [queue] = useState<HostQueueItem[]>(MOCK_QUEUE);

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary selection:text-on-primary">
      {/* Background Atmospheric Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary blur-[80px] opacity-15"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-secondary blur-[80px] opacity-15"></div>
      </div>

      {/* Top Navigation */}
      <header className="bg-neutral-950/40 backdrop-blur-2xl font-public tracking-tight font-bold docked full-width top-0 sticky shadow-[0px_40px_80px_-10px_rgba(0,0,0,0.4)] flex justify-between items-center px-6 py-4 w-full z-50">
        <UpNextWordmark />
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-8 text-neutral-400">
            <Link className="text-orange-400 font-bold hover:text-orange-300 transition-colors duration-300" href={`/session/${id}`}>Participant View</Link>
            <a className="hover:text-orange-300 transition-colors duration-300" href="#">Queue</a>
            <a className="hover:text-orange-300 transition-colors duration-300" href="#">History</a>
            <a className="hover:text-orange-300 transition-colors duration-300" href="#">Discovery</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-neutral-400 hover:text-orange-300 transition-colors">group</button>
            <button className="material-symbols-outlined text-neutral-400 hover:text-orange-300 transition-colors">settings</button>
            <img alt="Host avatar" className="w-10 h-10 rounded-full object-cover" data-alt="portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLLMEjZ1US3r_Ddwt_CvZlorLAJiZw30etqdsI-75RuEn0FMX6Gt1W25KZaiA7nqdG1s1cusV7iQeWsV-1uiHyug4JWciOwxI_qpUsmJTQ0RKgbHaN-_2Ymm1CIxTRBs-oBEofLTMDkXRHqBKvgBlsxlCeKcyg_PIJn_59q3UWwVY91xBYmCLE5NFojw_V8YU0hI5o8hk42oRYs7UzdDD98R4h1KF43sdFmGvmg7-tR8vvOvPMIIs2UmVeKFp-_drJAFhbhnHA29o" />
          </div>
        </div>
      </header>

      <div className="flex min-h-screen pt-4 relative z-10">
        {/* Side Navigation */}
        <aside className="hidden lg:flex flex-col h-full w-64 fixed left-0 top-0 pt-24 bg-neutral-950/60 backdrop-blur-3xl bg-gradient-to-r from-[rgba(19,19,20,0.8)] to-transparent z-40 border-r border-neutral-800/20">
          <div className="px-6 mb-8 transform translate-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img alt="Session Host" className="w-12 h-12 rounded-full object-cover" data-alt="close-up portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvveSs0MEo-Nc66tzDkBsmYF-H_WyU5HdR45VnDLNt_pOOerRgeHiAgFF36xB9Zq4oE4LOQM63Oa21rgWI-YIXDSl5qFn7xjXp7JIer-FIXnSvZcJnmjdW8U-5Utr_UN1yotHwpZWZk2OIQsNgYeWK85QV31cv-Lf7h7Mkbrfo__5_t7239gf64iJQaF9-tfWTQ94IOzKY13K8s2KcHGfJZGJ8AXGuSyskWeQgISqjX2Sjd1fLn0vnCTJSB5hyLzBPBVNyabJAaMA" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-surface"></div>
              </div>
              <div>
                <h3 className="font-headline text-sm font-bold">Global Room</h3>
                <p className="text-xs text-neutral-500">48 Listeners</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1 px-2">
            <a className="flex items-center gap-4 text-orange-500 bg-orange-500/10 rounded-r-full py-3 px-6 transition-all duration-500 ease-out" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
              <span className="font-label text-sm font-semibold">Live Session</span>
            </a>
            <a className="flex items-center gap-4 text-neutral-500 py-3 px-6 hover:bg-neutral-800/30 rounded-r-full transition-all duration-500 ease-out" href="#">
              <span className="material-symbols-outlined">queue_music</span>
              <span className="font-label text-sm font-semibold">Queue</span>
            </a>
            <a className="flex items-center gap-4 text-neutral-500 py-3 px-6 hover:bg-neutral-800/30 rounded-r-full transition-all duration-500 ease-out" href="#">
              <span className="material-symbols-outlined">history</span>
              <span className="font-label text-sm font-semibold">History</span>
            </a>
            <a className="flex items-center gap-4 text-neutral-500 py-3 px-6 hover:bg-neutral-800/30 rounded-r-full transition-all duration-500 ease-out" href="#">
              <span className="material-symbols-outlined">explore</span>
              <span className="font-label text-sm font-semibold">Discovery</span>
            </a>
          </nav>

          <div className="mt-auto p-6">
            <button className="w-full bg-gradient-to-r from-primary to-secondary py-3 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform text-white">
              Invite Friends
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 px-6 md:px-12 pb-24">
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">
            {/* Left Column: Now Playing & Controls */}
            <div className="xl:col-span-7 space-y-8">
              {/* Glassmorphic Now Playing Card */}
              <section className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-surface-container-low/60 backdrop-blur-3xl rounded-xl overflow-hidden shadow-2xl border border-white/5">
                  <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative shrink-0 w-64 h-64 md:w-80 md:h-80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden">
                      <img alt="Album Art" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2000ms]" data-alt="abstract vibrant album cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxqYkvXPQZStfCDatIOog_4LGD_MH9_r6wEaEpskP50D5fUKId_4NuiN1NeVRdvprjG6hrI4doqlAYCX4oloD-r4e0l4bxJ4Tg0urQkdjaJauvChOecVGhRcKnUojxIsSfJEllWMwTWD--dOx0WSZxiCBw0eA5UiKFP_YKfwkGkoGjKiK3xLKLhKgMAYbrVkAxoFKFfPxvaNFOqktDMelK6vky2XNOvmnqBfISLpVYXgO3B7-sh_KkdWekWjI3kPJ4L5duGE1ydas" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest animate-pulse">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        Live Now
                      </div>
                      <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tighter leading-none">Midnight Echo</h1>
                      <p className="text-xl text-neutral-400 font-medium">Synthetic Dreams • 2024</p>
                      
                      <div className="flex items-center gap-4 justify-center md:justify-start pt-4">
                        <div className="flex -space-x-3">
                          <img className="w-8 h-8 rounded-full border-2 border-surface object-cover" alt="listener" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIORJP3QKpCGajJozuc_HeSN2WhAvY-g9u_49tw0njwprbZNexAgAdKOd0sIeowuLbbVtzZHem_ukMplTsSxBJA1NDKo1bi8IJlHEmEotBdRY4WjOTyMANaINI0MRGVjFlz1frhP0mYsWhJcMNvBfqadfdciVHJTVljFC54uLyBNC9KNpXbVli1QdTOQjcnWrhQILllb1h8-JImwB1SEAjSDMMqeLCRTV_ZF1GN9Tqw-ESem13qGb42r69qbaJgYDgPBst__i3alQ" />
                          <img className="w-8 h-8 rounded-full border-2 border-surface object-cover" alt="listener" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS571B_YPWxFmQeiF_Zc6CWgHWgMjBPp9sSC2Jd525AmBW7eNGyA2_b0YUGDe3m8-dDe22Nu9b0XWv8_fVIhaP-p2ckRJubsgyF0M8-84rBuPqPwQQp2CyiiDk3xx5a94xQ-zn364UTMtdFhvst_9jEbsZy02fWRxohF9l2BgHSdGnTdN8dfoiINmo9gXwEjnuv5ac-2QZvnpMyU5_H_2ldI-ewaGdRsqoRxARP7mXHBRF21pXxnYZoDaxPtYPip7KAAHt7KXM-ss" />
                          <img className="w-8 h-8 rounded-full border-2 border-surface object-cover" alt="listener" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgoPuk-X8ghzzZnHdtkoueYCBQDK8HiB2rXKF8TiTZTtumlfjHOR4pFyaXOqz3jjVfJ4MQ3_bj9RNe9Z2ANNeXD87FrUdYH08bOq6Z22FKmxGaLZgmZZAbYJsQfO8aksgbrWp3xXXdD2oftikZfIttUyz6xwxM4KdNNOIH-oOIDz84sj5oRnETfKFiTfPkn1WZmAo1ZtaEkAAnEqcK8W9MzSOBHq2WlMob0YYNDqjcUro666syr7qHnOp4_qJI69Tq9ZW-JSr54l8" />
                          <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">+45</div>
                        </div>
                        <span className="text-xs text-neutral-500 font-semibold tracking-wide">Listening Together</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Playback Progress */}
                  <div className="px-8 pb-4">
                    <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="w-[65%] h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(255,144,109,0.5)]"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-neutral-500 tracking-tighter">
                      <span>2:45</span>
                      <span>4:12</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Host Controls Panel */}
              <section className="bg-surface-container-low rounded-xl p-8 flex flex-wrap items-center justify-between gap-8 shadow-xl">
                <div className="flex items-center gap-4">
                  <button className="w-12 h-12 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 transition-colors">
                    <span className="material-symbols-outlined">shuffle</span>
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 transition-colors">
                    <span className="material-symbols-outlined text-3xl">skip_previous</span>
                  </button>
                  <button className="w-20 h-20 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 transition-colors">
                    <span className="material-symbols-outlined text-3xl">skip_next</span>
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-800 transition-colors">
                    <span className="material-symbols-outlined">repeat</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-6 flex-1 max-w-xs">
                  <span className="material-symbols-outlined text-neutral-500">volume_down</span>
                  <div className="flex-1 h-1.5 bg-neutral-800 rounded-full relative">
                    <div className="absolute left-0 top-0 h-full w-[70%] bg-neutral-300 rounded-full"></div>
                    <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border border-neutral-300"></div>
                  </div>
                  <span className="material-symbols-outlined text-neutral-500">volume_up</span>
                </div>
                
                <button className="px-6 py-3 bg-error/10 text-error-dim rounded-lg font-bold text-sm border border-error/20 hover:bg-error hover:text-white transition-all">
                  Stop Session
                </button>
              </section>
            </div>

            {/* Right Column: Queue & Invite */}
            <div className="xl:col-span-5 space-y-8">
              {/* Invite Crowd Section */}
              <section className="bg-surface-container-highest rounded-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                  <span className="material-symbols-outlined text-8xl">share</span>
                </div>
                <h2 className="text-xl font-headline font-black mb-4 relative z-10">Invite your crowd</h2>
                <div className="flex gap-2 relative z-10">
                  <div className="flex-1 bg-surface-container-low px-4 py-3 rounded-lg text-sm font-mono text-neutral-400 truncate flex items-center">
                    upnext.fm/session/global-room-482
                  </div>
                  <button className="bg-white text-surface px-6 py-3 rounded-lg font-bold text-sm hover:bg-neutral-200 transition-colors active:scale-95">
                    Copy Link
                  </button>
                </div>
              </section>

              {/* Real-time Live Queue */}
              <section className="bg-surface-container-low rounded-xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-headline font-bold uppercase tracking-widest text-neutral-400">Live Queue</h2>
                  <span className="text-xs font-bold text-primary">{queue.length} TRACKS</span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {queue.map((song, idx) => (
                    <div key={song.id} className={`p-4 rounded-lg flex items-center gap-4 group transition-all ${song.isTopVoted ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-white/5 opacity-80 hover:opacity-100"}`}>
                      <span className={`${song.isTopVoted ? "text-primary" : "text-neutral-600"} font-black text-lg w-6`}>{idx + 1}</span>
                      <div className="w-12 h-12 rounded bg-neutral-800 overflow-hidden shrink-0">
                        <img alt={song.title} className="w-full h-full object-cover" src={song.thumbnail} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{song.title}</h4>
                        <p className="text-xs text-neutral-500 truncate">{song.author}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${song.isTopVoted ? "bg-primary/20 text-primary" : "text-neutral-500"}`}>
                        <span className="material-symbols-outlined text-xs" style={song.isTopVoted ? { fontVariationSettings: "'FILL' 1" } : {}}>thumb_up</span>
                        <span className="text-xs font-black">{song.votes}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-surface-container-high">
                  <button className="w-full py-3 bg-surface-variant text-on-surface-variant rounded-lg font-bold text-sm hover:text-on-surface transition-colors">
                    Add Track to Queue
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Orbital Player (Mobile & Mini-View) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50">
        <div className="bg-surface-container-high/60 backdrop-blur-3xl rounded-lg p-4 flex items-center gap-4 shadow-2xl border border-white/5">
          <img alt="Small album art" className="w-12 h-12 rounded-md object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpG_vNZ4G_IstE13_SoCpnVDu4VrLBCIL_2_TVLvQ0_WfCMLYuydMic9cfupAlBP-KmNqowAcCmGNdPwaxEwF5uxmF-ZtHX9juFrVhV_qiw9sglUrBvBbS_yozG9kz0dY0rT95IE7JgjvCLdulb0G7gFsQZ1y6f3QQFHEKbId1OyJ_xJLyLG4MYTrn3cMfDXEblskT11MDon-wjlyUEKaBXBln6cIJLu27lM2llnvSl452lRrJzeg8lTjVzHM1RKt3Q2GRetwTXfU" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold truncate">Midnight Echo</h4>
            <p className="text-[10px] text-neutral-400">Synthetic Dreams</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="material-symbols-outlined text-primary">play_arrow</button>
            <button className="material-symbols-outlined text-neutral-400">skip_next</button>
          </div>
        </div>
      </div>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-xl flex justify-around items-center py-4 z-40 border-t border-white/5">
        <button className="text-orange-400 flex flex-col items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sensors</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Live</span>
        </button>
        <button className="text-neutral-500 flex flex-col items-center gap-1">
          <span className="material-symbols-outlined">queue_music</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Queue</span>
        </button>
        <button className="text-neutral-500 flex flex-col items-center gap-1">
          <span className="material-symbols-outlined">explore</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Discovery</span>
        </button>
        <button className="text-neutral-500 flex flex-col items-center gap-1">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Room</span>
        </button>
      </div>
    </div>
  );
}
