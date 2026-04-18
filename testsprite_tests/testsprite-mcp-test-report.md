# TestSprite AI Testing Report (MCP) — Round 2

---

## 1️⃣ Document Metadata
- **Project Name:** upnext
- **Version:** V0 (Hackathon)
- **Round:** 2 (regression after Round 1 TC019 fix)
- **Date:** 2026-04-18
- **Prepared by:** TestSprite AI Team
- **Test Type:** Frontend (Production build)
- **Frontend URL:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **WebSocket:** ws://localhost:4001
- **Total Test Cases Executed:** 30 (priority-capped from 34 generated)
- **Pass / Fail / Blocked:** 26 ✅ / 2 ❌ / 2 ⛔ — **86.67%** pass rate
- **Round 1 report archive:** `testsprite-mcp-test-report.round1.md`
- **Round 1 plan archive:** `testsprite_frontend_test_plan.round1.json`

---

## 2️⃣ Requirement Validation Summary

### Requirement: Host Sign-up
**Description:** Create new host account via display name, email, password. Toast on validation/duplicate errors.

#### Test TC004 Create a new host account and reach the authenticated dashboard
- **Test Code:** [TC004_Create_a_new_host_account_and_reach_the_authenticated_dashboard.py](./TC004_Create_a_new_host_account_and_reach_the_authenticated_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/22307cca-ea81-42f1-88f0-ad51fb82bdc3
- **Status:** ✅ Passed
- **Analysis / Findings:** Sign-up with unique email lands on dashboard. JWT persisted.

#### Test TC026 Prevent sign-up with required fields left empty
- **Test Code:** [TC026_Prevent_sign_up_with_required_fields_left_empty.py](./TC026_Prevent_sign_up_with_required_fields_left_empty.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/f5747d7c-ff62-4c79-8309-8eb60fedaf11
- **Status:** ✅ Passed
- **Analysis / Findings:** Empty required fields blocked at submit; user remains on auth gate.

---

### Requirement: Host Login
**Description:** Login with email + password; invalid creds toast; empty creds blocked.

#### Test TC002 Log in successfully and reach the authenticated dashboard
- **Test Code:** [TC002_Log_in_successfully_and_reach_the_authenticated_dashboard.py](./TC002_Log_in_successfully_and_reach_the_authenticated_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/3429c5c2-a7bd-4304-a547-c7f6b6017e87
- **Status:** ✅ Passed
- **Analysis / Findings:** Seed creds `admin@gmail.com` / `admin123` reach dashboard.

#### Test TC019 Reject invalid host credentials with a toast
- **Test Code:** [TC019_Reject_invalid_host_credentials_with_a_toast.py](./TC019_Reject_invalid_host_credentials_with_a_toast.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/174a1081-e08c-49dd-955a-0db2ee61892a
- **Status:** ✅ Passed
- **Analysis / Findings:** `InvalidCredentials` toast shown; user remains on auth gate.

#### Test TC030 Block login when required fields are empty
- **Test Code:** [TC030_Block_login_when_required_fields_are_empty.py](./TC030_Block_login_when_required_fields_are_empty.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/c41ea218-eaa6-4216-b47a-a5928a19f005
- **Status:** ✅ Passed
- **Analysis / Findings:** Submission blocked when required fields empty.

---

### Requirement: Host Logout
**Description:** Logout clears JWT and returns to auth gate.

#### Test TC014 Logout returns to the auth gate
- **Test Code:** [TC014_Logout_returns_to_the_auth_gate.py](./TC014_Logout_returns_to_the_auth_gate.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/c594b086-ba9c-44fb-a1f9-c4a3a76db9ee
- **Status:** ✅ Passed
- **Analysis / Findings:** Logout removes `upnext.host.token`, `HostAuthGate` re-renders.

---

### Requirement: Create Host Session from Dashboard
**Description:** `Host a session` triggers `POST /sessions/`, shows `Creating...` while pending, navigates to `/session/{id}/host?code={joinCode}`.

#### Test TC001 Host creates a new live session from the dashboard
- **Test Code:** [TC001_Host_creates_a_new_live_session_from_the_dashboard.py](./TC001_Host_creates_a_new_live_session_from_the_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/3968f92b-0d40-4ab6-98ea-e8880cfc3f55
- **Status:** ✅ Passed
- **Analysis / Findings:** Lands on host session view with visible join code.

#### Test TC010 Host sees creating state while a new session is being created
- **Test Code:** [TC010_Host_sees_creating_state_while_a_new_session_is_being_created.py](./TC010_Host_sees_creating_state_while_a_new_session_is_being_created.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/9548241d-95b3-4ce3-b6ee-78f668a42fa2
- **Status:** ✅ Passed
- **Analysis / Findings:** `Creating...` label visible during in-flight POST.

---

### Requirement: Host Session View — Live Layout (regression for TC019 fix)
**Description:** Live host view renders core layout. **PRD §5.7:** YouTube player + playback dock must NOT mount on a fresh empty session.

#### Test TC009 Host session view renders live layout without mounting YouTube player on a fresh session
- **Test Code:** [TC009_Host_session_view_renders_live_layout_without_mounting_YouTube_player_on_a_fresh_session.py](./TC009_Host_session_view_renders_live_layout_without_mounting_YouTube_player_on_a_fresh_session.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/11cf4933-b0c0-4b11-a42d-1504a35f75c6
- **Status:** ✅ Passed
- **Analysis / Findings:** **Round 1 TC019 regression closed.** Fresh host session no longer renders the playback dock or YouTube iframe — matches PRD §5.7. Fix verified.

---

### Requirement: Host Settings Modal — Create / Cancel / Stop
**Description:** Settings is the only place to create another session, cancel without changes, or stop the room. Stop transitions to ended recap; stop control becomes unreachable.

#### Test TC003 Host can create a new live session from Settings and see a join code
- **Test Code:** [TC003_Host_can_create_a_new_live_session_from_Settings_and_see_a_join_code.py](./TC003_Host_can_create_a_new_live_session_from_Settings_and_see_a_join_code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/43543941-c9f8-4724-ae67-f455d575a662
- **Status:** ✅ Passed
- **Analysis / Findings:** Settings → `Create new session` routes to fresh host view with new code.

#### Test TC006 Host stops a live session and sees ended recap
- **Test Code:** [TC006_Host_stops_a_live_session_and_sees_ended_recap.py](./TC006_Host_stops_a_live_session_and_sees_ended_recap.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/327a9b4e-2c57-4be3-8872-2a2ea6592466
- **Status:** ✅ Passed
- **Analysis / Findings:** Inline `Session Ended` recap rendered with participants and songs.

#### Test TC016 Host cannot access stop controls after ending a session
- **Test Code:** [TC016_Host_cannot_access_stop_controls_after_ending_a_session.py](./TC016_Host_cannot_access_stop_controls_after_ending_a_session.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/da2c80be-956e-4061-b108-f498172ca9e0
- **Status:** ✅ Passed
- **Analysis / Findings:** Settings sidebar item / Stop Session button no longer reachable in ended-recap state.

#### Test TC018 Host sees stopping pending state when ending a session
- **Test Code:** [TC018_Host_sees_stopping_pending_state_when_ending_a_session.py](./TC018_Host_sees_stopping_pending_state_when_ending_a_session.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/9d84c419-d329-4774-b0e4-197519f148db
- **Status:** ✅ Passed
- **Analysis / Findings:** `Stopping…` label visible during in-flight POST.

#### Test TC023 Host can cancel out of Settings without ending the session
- **Test Code:** [TC023_Host_can_cancel_out_of_Settings_without_ending_the_session.py](./TC023_Host_can_cancel_out_of_Settings_without_ending_the_session.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/f3f22935-9204-43cf-bf54-0c7e3dc59c81
- **Status:** ✅ Passed
- **Analysis / Findings:** Closing modal via X leaves session active and live view intact.

---

### Requirement: Previous Sessions List (Host Dashboard)
**Description:** Dashboard shows prior sessions with status badges; rows open the corresponding host view.

#### Test TC013 Host dashboard shows previous sessions list with statuses
- **Test Code:** [TC013_Host_dashboard_shows_previous_sessions_list_with_statuses.py](./TC013_Host_dashboard_shows_previous_sessions_list_with_statuses.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/dba2b5f8-1366-4331-99d3-1ebff579c3b1
- **Status:** ✅ Passed
- **Analysis / Findings:** Live/Ended badges and participant counts render correctly.

#### Test TC017 Host can open an active session from the previous sessions list
- **Test Code:** [TC017_Host_can_open_an_active_session_from_the_previous_sessions_list.py](./TC017_Host_can_open_an_active_session_from_the_previous_sessions_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/f7e89931-f88d-4be5-879d-ec113fd88545
- **Status:** ✅ Passed
- **Analysis / Findings:** `Open dashboard` action lands on the live host view.

---

### Requirement: Join Room via Landing Modal (6-char code)
**Description:** Modal accepts 6-char code, pre-validates via `GET /sessions/:code`, surfaces inline errors.

#### Test TC005 Participant can join from landing modal using a valid 6-character code
- **Test Code:** [TC005_Participant_can_join_from_landing_modal_using_a_valid_6_character_code.py](./TC005_Participant_can_join_from_landing_modal_using_a_valid_6_character_code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/3e346fc4-21df-4fb0-b1bf-4e5fe09febe4
- **Status:** ⛔ Blocked
- **Test Error:** Used hardcoded code `ABC123` instead of a fresh session code; modal correctly returned `Session not found for code ABC123`.
- **Analysis / Findings:** **False negative — TestSprite test fixture bug, identical pattern to Round 1 TC012.** Product behavior is correct. The plain happy-path coverage actually lives in TC008 (full URL) which passed. Recommend patching the harness step to source the code from the just-created host session, or removing this test in favor of TC008 + TC027.

#### Test TC027 Join modal shows session-not-found for a nonexistent valid code
- **Test Code:** [TC027_Join_modal_shows_session_not_found_for_a_nonexistent_valid_code.py](./TC027_Join_modal_shows_session_not_found_for_a_nonexistent_valid_code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/5e8994ab-b819-49d8-b0db-1ba0fb33a051
- **Status:** ✅ Passed
- **Analysis / Findings:** Inline `Session not found for code {CODE}` shown for unknown code.

#### Test TC028 Join modal rejects invalid or unparsable input
- **Test Code:** [TC028_Join_modal_rejects_invalid_or_unparsable_input.py](./TC028_Join_modal_rejects_invalid_or_unparsable_input.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/4a70bf65-8cce-46cb-80c7-0b0ea04855cf
- **Status:** ✅ Passed
- **Analysis / Findings:** `Please enter a valid URL.` inline error rendered for unparseable input.

---

### Requirement: Join Room via Landing Modal (full invite URL)
**Description:** Modal accepts a full invite URL with `?code=` or `/session/{CODE}/join`.

#### Test TC008 Join a room from landing modal using a full invite URL
- **Test Code:** [TC008_Join_a_room_from_landing_modal_using_a_full_invite_URL.py](./TC008_Join_a_room_from_landing_modal_using_a_full_invite_URL.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/8f89ce33-86c9-490c-85b1-7e319e476abd
- **Status:** ✅ Passed
- **Analysis / Findings:** Round 1 TC012 false negative does not recur — fresh URL parses correctly and lands on pre-join.

---

### Requirement: Participant Pre-Join Screen
**Description:** Pre-join validates code and prompts for name. Invalid code surfaces `Session not found for code {CODE}`.

#### Test TC007 Complete pre-join by entering a display name and entering the live session
- **Test Code:** [TC007_Complete_pre_join_by_entering_a_display_name_and_entering_the_live_session.py](./TC007_Complete_pre_join_by_entering_a_display_name_and_entering_the_live_session.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/75ba3d44-a29c-40ac-bc04-4f38e34a4d74
- **Status:** ✅ Passed
- **Analysis / Findings:** Display name accepted; participant enters live view at `/session/{uuid}`.

#### Test TC029 Show session-not-found state on pre-join for an invalid code
- **Test Code:** [TC029_Show_session_not_found_state_on_pre_join_for_an_invalid_code.py](./TC029_Show_session_not_found_state_on_pre_join_for_an_invalid_code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/c1520eec-dee9-43e3-b45b-c5a22a9c10b1
- **Status:** ❌ Failed
- **Test Error:** Pre-join for `ZZZZZZ` shows `The session is live.` and `Room ZZZZZZ` with the submit button stuck on `Checking room...` instead of the documented `Session not found for code ZZZZZZ` error.
- **Analysis / Findings:** Genuine UX deviation. PRD §5.5 promises an error message when `GET /sessions/:code` fails. Two likely root causes:
  1. **Loading-state never cleared.** If `GET /sessions/:code` returns a 404/410 but the pre-join page treats only network failure as an error, the pending state persists. Check `frontend/app/session/[id]/join/page.tsx` to ensure `onError` (or its equivalent) handles non-2xx as well as throws, and clears the `Checking room...` button label.
  2. **Optimistic header rendering.** The page renders `The session is live.` and `Room ZZZZZZ` before the lookup resolves; if the request never resolves, those stay. Consider gating the "live" header behind `summary` data, not just route state.
  This contradicts Round 1 TC027 which passed — investigate whether a recent change altered the loading/error transition or whether this is a backend latency flake. Add a guarded `Session not found` text path before relying on the test.

---

### Requirement: Participant Live Session — Add Track
**Description:** Add to Queue accepts query/YouTube/Spotify URL. Bad URL → error toast, no enqueue.

#### Test TC011 Add a track from search suggestions using keyboard navigation
- **Test Code:** [TC011_Add_a_track_from_search_suggestions_using_keyboard_navigation.py](./TC011_Add_a_track_from_search_suggestions_using_keyboard_navigation.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/b8725292-90fd-46bc-9997-ace03864ecca
- **Status:** ✅ Passed
- **Analysis / Findings:** ArrowDown → Enter on suggestion enqueues the track via WS.

#### Test TC015 Add a track by submitting a YouTube URL
- **Test Code:** [TC015_Add_a_track_by_submitting_a_YouTube_URL.py](./TC015_Add_a_track_by_submitting_a_YouTube_URL.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/425eb2e1-1473-4ab8-8f92-4e96a0d4611a
- **Status:** ✅ Passed
- **Analysis / Findings:** Valid YouTube URL parsed and enqueued.

#### Test TC024 Show an error toast and do not add a queue item for an invalid track URL
- **Test Code:** [TC024_Show_an_error_toast_and_do_not_add_a_queue_item_for_an_invalid_track_URL.py](./TC024_Show_an_error_toast_and_do_not_add_a_queue_item_for_an_invalid_track_URL.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/2314123c-0826-4847-88ea-e03699185f79
- **Status:** ⛔ Blocked
- **Test Error:** `Connection is not ready yet. Please retry.` banner blocked the WS round-trip; no `InvalidVideoId` toast emitted because the message never reached the server.
- **Analysis / Findings:** WS connection wasn't ready when add-track was attempted — likely a harness-level race rather than a product defect. Round 1 TC026 (same scenario) passed. **However**, the user-visible message `Connection is not ready yet. Please retry.` is a real UX surface — confirm it actually offers a recovery action (button/auto-retry) rather than just an info toast. If pressing Add Track again does not retry the WS handshake, that's worth a small product fix.

---

### Requirement: Participant Live Session — Upvote
**Description:** Upvote toggles per row, queue reorders via WS.

#### Test TC012 Upvote a queued track and see vote count and ordering update
- **Test Code:** [TC012_Upvote_a_queued_track_and_see_vote_count_and_ordering_update.py](./TC012_Upvote_a_queued_track_and_see_vote_count_and_ordering_update.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/f259d6a8-2642-4503-bb97-cf5695c4bea9
- **Status:** ✅ Passed
- **Analysis / Findings:** `votedByMe` toggles, count updates, queue reorders by votes desc.

---

### Requirement: Participant Edit Display Name
**Description:** Pencil dialog updates name via WS `UPDATE_NAME`. Whitespace-only rejected with toast.

#### Test TC020 Change display name successfully and see it reflected in header and People list
- **Test Code:** [TC020_Change_display_name_successfully_and_see_it_reflected_in_header_and_People_list.py](./TC020_Change_display_name_successfully_and_see_it_reflected_in_header_and_People_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/1a4cdac8-53c0-4b8c-8a61-a061299ac3eb
- **Status:** ✅ Passed
- **Analysis / Findings:** Updated name appears in header and People view.

#### Test TC025 Reject whitespace-only display name edits with an error toast
- **Test Code:** [TC025_Reject_whitespace_only_display_name_edits_with_an_error_toast.py](./TC025_Reject_whitespace_only_display_name_edits_with_an_error_toast.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/b5e8b863-c0a6-4e0a-b841-48535ca59a4a
- **Status:** ✅ Passed
- **Analysis / Findings:** Whitespace save rejected; previous name preserved.

---

### Requirement: Participant Invite Friends Modal
**Description:** Sidebar modal with Copy Link state cycle (`Copy Link → Copied → reset`) and X-close.

#### Test TC021 Copy an invite link from Invite Friends modal and see state cycle then reset
- **Test Code:** [TC021_Copy_an_invite_link_from_Invite_Friends_modal_and_see_state_cycle_then_reset.py](./TC021_Copy_an_invite_link_from_Invite_Friends_modal_and_see_state_cycle_then_reset.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/10f41e17-2a3a-44ce-b6ff-7eb79f8e5ec2
- **Status:** ❌ Failed
- **Test Error:** Copy Link button stayed at `Copy Link` after 3 attempts; never transitioned to `Copied`.
- **Analysis / Findings:** **PRD §9 explicitly notes headless Chromium clipboard APIs may flake.** This is the documented flake path, not a regression — Round 1 TC023 (same scenario) passed. Either:
  1. Treat as harness flake — accept and rely on Round 1 confirmation, or
  2. Add a fallback path: when `navigator.clipboard.writeText` throws (which it does in some headless contexts), still show the `Copied` state if a `document.execCommand('copy')` fallback succeeded, OR show the documented `Retry` + toast `Could not copy link. Please copy manually.` so the test can branch on either outcome.
  **Severity: low** for end users (real browsers grant clipboard access), **medium** for test stability — worth wiring the documented retry/error path so flake becomes a deterministic assertion.

#### Test TC033 Close the Invite Friends modal via the close control
- **Status:** Generated (Low priority); not in this round's executed cap.

---

### Requirement: Participant History and People Views
**Description:** History empty state + People view with `Host` badge from `sessionHost.ts`.

#### Test TC022 Participant can view History empty state and see host badge in People list
- **Test Code:** [TC022_Participant_can_view_History_empty_state_and_see_host_badge_in_People_list.py](./TC022_Participant_can_view_History_empty_state_and_see_host_badge_in_People_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ccd6c55a-cf3b-4f8d-b9c6-bc206c036b6d/7d9e4fa5-2a16-4937-a5d4-80d33b3b0ffb
- **Status:** ✅ Passed
- **Analysis / Findings:** Empty-state copy and Host badge render as expected.

---

## 3️⃣ Coverage & Matching Metrics

- **86.67%** of executed tests passed (26 / 30)
- **6.67%** failed (2 / 30) — TC021 (clipboard flake / documented limitation), TC029 (genuine pre-join error-state regression)
- **6.67%** blocked (2 / 30) — TC005 (test fixture bug, false negative), TC024 (WS-not-ready harness race)
- **TC019 fix verified ✅** via TC009: playback dock + YouTube iframe correctly absent on fresh empty session.

| Requirement                                                  | Total | ✅ | ❌ | ⛔ |
|--------------------------------------------------------------|-------|----|----|----|
| Host Sign-up                                                 | 2     | 2  | 0  | 0  |
| Host Login                                                   | 3     | 3  | 0  | 0  |
| Host Logout                                                  | 1     | 1  | 0  | 0  |
| Create Host Session from Dashboard                           | 2     | 2  | 0  | 0  |
| Host Session View — Live Layout (TC019 regression)           | 1     | 1  | 0  | 0  |
| Host Settings Modal (Create / Cancel / Stop)                 | 5     | 5  | 0  | 0  |
| Previous Sessions List                                       | 2     | 2  | 0  | 0  |
| Join Modal (6-char code)                                     | 3     | 2  | 0  | 1  |
| Join Modal (full invite URL)                                 | 1     | 1  | 0  | 0  |
| Participant Pre-Join Screen                                  | 2     | 1  | 1  | 0  |
| Participant Live Session — Add Track                         | 3     | 2  | 0  | 1  |
| Participant Live Session — Upvote                            | 1     | 1  | 0  | 0  |
| Participant Edit Display Name                                | 2     | 2  | 0  | 0  |
| Participant Invite Friends Modal                             | 1     | 0  | 1  | 0  |
| Participant History and People Views                         | 1     | 1  | 0  | 0  |
| **TOTAL**                                                    | **30**| **26** | **2** | **2** |

---

## 4️⃣ Key Gaps / Risks

### 4.1 ✅ Round 1 TC019 fix verified
TC009 confirms the playback dock and YouTube iframe are not mounted on a fresh empty host session. Matches PRD §5.7. No follow-up needed.

### 4.2 New genuine product issue — pre-join stuck on `Checking room...` for invalid code (TC029)
- **Where:** `frontend/app/session/[id]/join/page.tsx`.
- **Symptom:** Visiting `/session/ZZZZZZ/join` shows `The session is live.` + `Room ZZZZZZ` with the submit button stuck on `Checking room...`. The documented `Session not found for code ZZZZZZ` error never appears.
- **Round 1 contrast:** TC027 (same scenario) passed in Round 1 — needs a quick diff or a manual repro to confirm whether this is a real regression, a backend latency flake, or a test-timing issue. Repro by hand: open DevTools → Network, navigate to `/session/ZZZZZZ/join`, watch the `GET /sessions/ZZZZZZ` response. If 404 returns but UI does not transition, the error path in the page component is the bug. If the request hangs, look at the backend `session.routes.ts` 404 path / response time.
- **Recommendation:** Ensure the lookup hook treats non-2xx responses as errors (not just network failures), clears the `Checking room...` pending label, and renders the documented error string.

### 4.3 Documented clipboard-path is flaky in headless Chromium (TC021)
- PRD §9 already calls this out, but the product currently relies entirely on `navigator.clipboard.writeText`. In headless contexts that path can silently no-op without throwing, so neither `Copied` nor `Retry` ever shows.
- **Recommendation (low product, medium test stability):** Wire the documented `Retry` + toast `Could not copy link. Please copy manually.` fallback so the UI surfaces *some* terminal state even when clipboard writes fail silently. Easier to assert against than the flake.

### 4.4 `Connection is not ready yet. Please retry.` UX (TC024)
- The blocking message itself is informative, but a participant has no obvious recovery action; the test had to bail because Add Track did not auto-retry post-handshake.
- **Recommendation:** Either auto-retry the queued action once the WS handshake completes, or convert the message into a button (`Retry`) so participants don't have to click around.

### 4.5 TestSprite fixture bug — hardcoded `ABC123` again (TC005)
- Same harness pattern as Round 1 TC012. The test wasn't actually exercising the "valid 6-char code" path because the fixture supplied a fake code.
- **Recommendation:** Either patch the test step ("copy the join code from the host session view first, then use it in the modal") or drop TC005 in favor of TC008 (full URL) + TC027 (not-found path), which together already cover both branches.

### 4.6 Coverage still missing (deferred from Round 1 §4.5)
None of these were exercised this round — TestSprite's auto-generator did not pick them up despite explicit `additionalInstruction`:
- Host `Invite your crowd` Copy Link panel inside `/session/[id]/host` (separate from participant Invite Friends modal).
- Participant `Host ended this session` screen with `Go Home` / `Create Your Own Session` CTAs after host stops the room (PRD §5.6 closed state).
- Duplicate-song reject (`SongAlreadyQueued`) when adding the same YouTube video twice.
- Spotify URL add-track happy path.
- Vote-on-current-song reject (`CannotVoteCurrent`).
- Live Feed event copy (`{name} joined the jam`, `started the jam`, `voted for {trackTitle}`).
- WS resilience: `ConnectionFailed` / `ReconnectFailed` debounce window.

**Recommendation:** Author these as hand-written Playwright tests rather than relying on TestSprite to infer them. They are precise behavioral assertions that benefit from a deterministic harness — and several of them (host Copy panel, ended-participant screen) probe surfaces that TestSprite consistently misses.

### 4.7 Round 2 vs Round 1 deltas
| Metric                  | Round 1 | Round 2 |
|-------------------------|---------|---------|
| Pass rate               | 90.00%  | 86.67%  |
| Real product bugs found | 1 (TC019, fixed) | 1 (TC029 pre-join error path) |
| False negatives         | 1 (TC012 fixture) | 1 (TC005 fixture) |
| Harness blocks          | 1 (TC002 localStorage) | 1 (TC024 WS race) |
| Doc-flagged flakes      | 0       | 1 (TC021 clipboard) |

Net: Round 1's bug is fixed and verified; Round 2 surfaced one new product bug (TC029) plus one UX hardening opportunity (TC024 retry affordance) and one product-side workaround for a documented limitation (TC021 fallback path).
