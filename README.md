# UpNext

![UpNext product mockup](docs/assets/mockup.png)

**A real-time collaborative music queue.** Hosts spin up a session, participants join via a 6-character code, and everyone can search for tracks or add YouTube/Spotify links before voting on what plays next. The queue re-orders by vote count live, and the host's browser plays audio for the room.

Submitted to the **TestSprite Season 2 Hackathon** (April 2026).

---

## Why UpNext

Party playlists are either dictator-mode (one person hogs the aux) or committee-mode (everyone talks over each other). UpNext splits the two: one host device plays audio, everyone else queues and votes from their device. No accounts needed for participants — just a 6-char code.

---

## Tech Stack

**Frontend** (`frontend/`)
- Next.js 16 (App Router, Turbopack) + React 19
- Tailwind CSS v4
- `@tanstack/react-query` for server state
- Custom WebSocket client (`app/lib/ws.ts`)
- YouTube IFrame Player API for host playback

**Backend** (`backend/`)
- Node.js + Express 5 (HTTP API on port 4000)
- `ws` for WebSocket server (port 4001)
- Prisma 6 over PostgreSQL
- JWT + bcrypt for host auth
- Zod for payload validation

**Testing**
- TestSprite MCP (frontend, production mode, 29 tests)

---

## Quick Start

### Prerequisites
- Node 20+, pnpm 10+
- PostgreSQL running locally
- YouTube Data API key (for search)

### 1. Clone and install

```bash
git clone <repo-url> upnext
cd upnext
pnpm install --dir backend
pnpm install --dir frontend
```

### 2. Backend env

Copy `backend/.env.example` to `backend/.env` and fill in:

```
DATABASE_URL="postgresql://user:password@localhost:5432/upnext?schema=public"
JWT_SECRET="replace-with-a-long-random-string"
YOUTUBE_API_KEY="<your key>"
PORT=4000
WS_PORT=4001
HOST=0.0.0.0
CORS_ORIGIN="http://localhost:3000"

# Optional — enables Spotify link resolution
SPOTIFY_CLIENT_ID=""
SPOTIFY_CLIENT_SECRET=""
```

### 3. Database

```bash
pnpm --dir backend prisma:generate
pnpm --dir backend prisma:migrate
pnpm --dir backend seed:test-user   # creates admin@gmail.com / admin123
```

### 4. Frontend env (optional)

Defaults point at `http://localhost:4000` / `ws://localhost:4001`. Override in `frontend/.env.local` if needed:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4001
```

### 5. Run

Two terminals:

```bash
# terminal 1 — backend (API + WS, concurrently)
pnpm --dir backend dev

# terminal 2 — frontend
pnpm --dir frontend dev
```

Open http://localhost:3000.

### Production build

```bash
pnpm --dir backend build && pnpm --dir backend start:api & pnpm --dir backend start:ws &
pnpm --dir frontend build && pnpm --dir frontend start
```

---

## App Flow

1. **Host** → `/host/auth` → sign up or log in (seeded credentials: `admin@gmail.com` / `admin123`) → dashboard → **Host a session** → redirected to `/session/[id]/host` with a 6-char join code.
2. **Participant** → landing page → **Join Link** → enter the 6-char code or paste the invite URL → pick a display name → `/session/[id]`.
3. **Add songs** — paste a YouTube URL, a Spotify track link, or search with the live dropdown.
4. **Vote** — upvote queued tracks; queue re-sorts by vote count, created-at as tie-breaker.
5. **Host** plays audio via the embedded YouTube player and auto-advances when a track ends.
6. **Host** can stop the session from Settings → inline recap of participants and played songs renders in place.

---

## Routes

| Path | Auth | Description |
|---|---|---|
| `/` | — | Landing page + Join modal |
| `/host/auth` | — | Host login / signup / dashboard |
| `/session/[id]/host` | Host JWT | Host session view (playback, queue, settings) |
| `/session/[id]/join` | — | Guest name-entry page |
| `/session/[id]` | — | Participant session view |

---

## API Surface

Auth — `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`
Sessions — `POST /sessions/`, `GET /sessions/:code`, `GET /sessions/host/mine`, `GET /sessions/by-id/:id/summary`, `POST /sessions/by-id/:id/stop`
Search — `GET /search?q={query}`
Health — `GET /health`

WebSocket messages — client: `JOIN_SESSION`, `ADD_SONG`, `VOTE`, `SONG_ENDED`, `SYNC_PLAYBACK`, `UPDATE_NAME`. Server: `SESSION_STATE`, `QUEUE_UPDATED`, `VOTE_ACTIVITY`, `PLAY_SONG`, `PLAYBACK_SYNC`, `PARTICIPANTS_UPDATED`, `ERROR`.


---

## Data Model

PostgreSQL via Prisma (`backend/prisma/schema.prisma`): `User` (hosts only), `Session`, `Participant` (join-code guests, identified by browser-generated UUID in localStorage), `Song`, `Vote`. Sessions expire after ~12 hours or when the host stops them.

---

## TestSprite Results

Two rounds of frontend testing in production mode with 29 generated test cases.

| | Round 1 | Round 2 |
|---|---|---|
| Pass rate | 75.86% | **82.76%** |
| Passed | 22 | 24 |
| Failed | 4 | 5 |
| Blocked | 3 | 0 |

**Fixes between rounds:**
- Inline stop-session recap instead of redirect (TC005, TC024)
- Real host display name threaded through participant view (TC011)
- Success toast on Invite Friends → Copy Link (TC015)
- Prod build unblock: wrapped `/host/auth` in `<Suspense>` for Next.js 16 `useSearchParams`
- All 3 Round 1 blocks (TC007, TC013, TC021) unblocked by hardening the test agent instructions to create a fresh session per run

**Remaining failures** (documented for post-hackathon follow-up):
- TC002 — host view has no add-track affordance (product decision: host is passive)
- TC010 — upvote test targets Now Playing card; test-agent locator issue, manual QA confirms vote path works
- TC011 — data is correct, missing `<Badge>Host</Badge>` element on participant People tab
- TC015 — headless Chromium clipboard permission; toast visible in real browsers
- TC025 — duplicate-email signup error swallowed; toast scoped above auth form

Full report: `testsprite_tests/testsprite-mcp-test-report.md`.

---

## Project Structure

```
upnext/
├── backend/
│   ├── prisma/              # schema + migrations
│   ├── scripts/             # seed-test-user
│   └── src/
│       ├── modules/         # auth, session, search, ws
│       ├── app.ts           # Express app
│       ├── index.ts         # HTTP entrypoint (port 4000)
│       └── ws-server.ts     # WebSocket entrypoint (port 4001)
├── frontend/
│   └── app/
│       ├── (landing)        # page.tsx + Join modal
│       ├── host/auth/       # host login/signup/dashboard
│       ├── session/[id]/    # participant view
│       │   ├── host/        # host session view
│       │   └── join/        # guest name entry
│       ├── components/      # shared UI (YouTubePlayer, ToastProvider, …)
│       └── lib/             # api, ws, youtube, sessionIdentity, …
├── testsprite_tests/        # generated test suite + report
└── PRODUCT_SPEC.md          # full spec
```

---

## Known Limitations

- Guest identity is a browser-generated UUID in localStorage — not cryptographically authenticated. Acceptable for V0; would need signed short-lived tokens for production.
- Landing page hero uses mock data (`app/mocks/`) for illustration.
- No mobile side

---

## License

ISC. See individual `package.json` files.
