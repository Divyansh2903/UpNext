import type { ParticipantViewModel, SessionViewModel } from "./types";

export const PARTICIPANT_SESSION_MOCK: SessionViewModel = {
  id: "session-participant",
  joinCode: "GLOBAL",
  roomName: "Global Room",
  hostName: "Alex Rivera",
  hostAvatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBoq3fTxD2aHtAeCaf-4uWpw9tAXd0vw3YULddp8ztuQPJnr1ZEQQPm7gtEByG_eD9zUPPOyM2TwuQ4U8_xbOxlPm6ofxfAR2dF4O-zXk2KrvDWH1jCcahRSrDbJHDiCzQoFaw8muAqrn19OZ_fm1R1kiQr2Y9U0ihQySWmiKkiuHOJLqkI6N_DS8M86dEzRyHXg7svfA-MTMqM0rxU6q2MYG7EthNEV_JXQRE4xoibKdPV2TYRkIxU2cr46913UkEle_kX03rcqaw",
  listenerCount: 48,
  nowPlaying: {
    title: "Starboy",
    author: "The Weeknd ft. Daft Punk",
    albumArtUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfBUmwzkXk8GGrB8wFiFTDIMUTFQ71dwwSOHfhxWQ5U0134Bf30J5ge9UVrHir3D0DEqEpOENfdkcp-gPsRuLxRvtGnI_QNtu-Usx9vPNYkHltz0YJaR76iEId4Cpi70_4ruhhKp3vLWoxh_jBeg3lRkvFGEObxEhQJqXDgrX5KzDT7rNmfdgiZCkMe4bNQrLkt8cE9De_tm00yYGLWFbWBaIJNX7a6dR_Ro79wV0Pdrvvt5rlMjbJEiuWBq35uduFNMm9Rq10374",
    elapsed: "2:14",
    duration: "3:50",
  },
};

/** Invite link shown on host dashboard until real share URLs are wired */
export const HOST_INVITE_DISPLAY_URL = "https://upnext.fm/session/demo";

export const HOST_SESSION_MOCK: SessionViewModel = {
  id: "session-host",
  joinCode: "GLOBAL",
  roomName: "Global Room",
  hostName: "Elena Vance",
  hostAvatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDvveSs0MEo-Nc66tzDkBsmYF-H_WyU5HdR45VnDLNt_pOOerRgeHiAgFF36xB9Zq4oE4LOQM63Oa21rgWI-YIXDSl5qFn7xjXp7JIer-FIXnSvZcJnmjdW8U-5Utr_UN1yotHwpZWZk2OIQsNgYeWK85QV31cv-Lf7h7Mkbrfo__5_t7239gf64iJQaF9-tfWTQ94IOzKY13K8s2KcHGfJZGJ8AXGuSyskWeQgISqjX2Sjd1fLn0vnCTJSB5hyLzBPBVNyabJAaMA",
  listenerCount: 48,
  nowPlaying: {
    title: "Midnight Echo",
    author: "Synthetic Dreams • 2024",
    albumArtUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxqYkvXPQZStfCDatIOog_4LGD_MH9_r6wEaEpskP50D5fUKId_4NuiN1NeVRdvprjG6hrI4doqlAYCX4oloD-r4e0l4bxJ4Tg0urQkdjaJauvChOecVGhRcKnUojxIsSfJEllWMwTWD--dOx0WSZxiCBw0eA5UiKFP_YKfwkGkoGjKiK3xLKLhKgMAYbrVkAxoFKFfPxvaNFOqktDMelK6vky2XNOvmnqBfISLpVYXgO3B7-sh_KkdWekWjI3kPJ4L5duGE1ydas",
    elapsed: "2:45",
    duration: "4:12",
  },
};

export const JOIN_PAGE_MOCK = {
  hostName: "Elena Vance",
  roomName: "Global Room",
  hostAvatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBpKAh_rIP2-OomVOTO5oA3JUwCgusAq8kWNhoxhBezQpv9t_ePIOIEnNvz6aBm1JDnWKFOkQdcitRyUx3ugmAHREJXWrrcBhC75TBgZ6z4KQdbpA3yknX_bhm7RQ4wNfCjyLYt6rD1Yu6xnE2bywSCXDRwh2Kj30PCts6wpLAWDtLavssBPVJ8M7UNupPtPinQaHZr0mWxd5poHtbxog9eKutnuEwwuup6NMHBR_ZId8VVoH_tSYwj5ot_APcg0KnnBlX26hqcyJE",
  listenerCount: 48,
};

export const PARTICIPANT_REACTION_MOCK: ParticipantViewModel[] = [
  {
    id: "p1",
    name: "Sarah",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBW1GmI82sv2Qj_yBJ0jgdkw41MhbRL09vDWAwtTRbdeCUGm4sxaQ7A6cHUuzmUjtBxiGghT5dSRty052LuWyg-nOUVTWz4ORRvyLOGIy9etIFtOfoZ-F8dYEGG4pG8TJcwbLQLZ28xqqUuMPSoXDzqapxUUASDh-yv0ksWpnFgN88Q0efqu7tY0dCUwLHZ_olHdStWfJWL1-4r-zy8lZ6heNlOjEueSnGwJ1W2kkr36m2DPMm_Q9rhDME0XPs_eeZKfbw-XG45SWQ",
  },
  {
    id: "p2",
    name: "Noah",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7HAMGK-VJvcXoIdzSvd56FhYh9DNJgWhtitOMpatZmbDq2SR0W0Wkjjmw_ZBEQLFJca11ROV3zGaak71AtL7wdQvUUkBfjXx-3DxLb5QLnytYXVIZBhrmZOR0SKtmXuViUEMtCdf_xY7U2VfvsOJjixNX3PAfkNb92WXIalK3OwoyduM6IMKttkNeaIz4G7lZQHMqgdadi5zBCFd8N0mADrUy7ekrhNPUodmk5qim45UrivRvJkZ2CtZF_uhZpinr81QO9go6tEk",
  },
  {
    id: "p3",
    name: "Ava",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDfApIQMB-SN6EI7uOCik8ztuMSWcZPXKLNR1reMcbCe1l9_xBUXZegUPISJrFQtno8hNyxRRM7DylUWUGKqsKFuwIH9jXg9A94xeruHbY7YvVinw2UHMzDS0P-9IU82gJEaEpzq8_tVyb-Mn1DANFfJSrl3mgjpN4W2hdT2lEAVHr1rNBZ6VwgoINNNL5TBcjRhYzjOcIHEuV4QX-yUm-_4keFE0X2EBiK0O1K7sULWupNRQ8hihY-GkqMquNCLa3VoBylW9VpV4",
  },
];
