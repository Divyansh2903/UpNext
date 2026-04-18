# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** upnext
- **Version:** V0 (Hackathon)
- **Date:** 2026-04-18
- **Prepared by:** TestSprite AI Team
- **Test Type:** Frontend (Production build)
- **Frontend URL:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **WebSocket:** ws://localhost:4001
- **Total Test Cases Executed:** 30 (priority-capped from 37 generated)
- **Pass / Fail / Blocked:** 27 ✅ / 2 ❌ / 1 ⛔

---

## 2️⃣ Requirement Validation Summary

### Requirement: Host Sign-up
**Description:** Create a new host account via display name, email, password. Errors surface as toast.

#### Test TC011 Create a host account and reach the authenticated dashboard
- **Test Code:** [TC011_Create_a_host_account_and_reach_the_authenticated_dashboard.py](./TC011_Create_a_host_account_and_reach_the_authenticated_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/3363dd0a-be05-4727-be0d-8ec3657a903e
- **Status:** ✅ Passed
- **Analysis / Findings:** Sign-up succeeds with unique email and lands on authenticated dashboard. JWT persisted in localStorage as expected by `HostAuthGate` flow.

---

### Requirement: Host Login
**Description:** Login with email + password. Stores `upnext.host.token`. Toast on invalid credentials.

#### Test TC010 Log in as an existing host and reach the authenticated dashboard
- **Test Code:** [TC010_Log_in_as_an_existing_host_and_reach_the_authenticated_dashboard.py](./TC010_Log_in_as_an_existing_host_and_reach_the_authenticated_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/24a5a12f-29c6-455a-b7b5-2086a929b395
- **Status:** ✅ Passed
- **Analysis / Findings:** Seed account `admin@gmail.com` logs in cleanly and dashboard renders Welcome heading.

---

### Requirement: Host Logout
**Description:** Logout button clears JWT and returns user to auth gate.

#### Test TC024 Log out from the host dashboard back to the auth gate
- **Test Code:** [TC024_Log_out_from_the_host_dashboard_back_to_the_auth_gate.py](./TC024_Log_out_from_the_host_dashboard_back_to_the_auth_gate.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/220239b7-1c19-4335-b1b2-56bf27936f2c
- **Status:** ✅ Passed
- **Analysis / Findings:** Logout clears stored host JWT and re-renders `HostAuthGate` form.

---

### Requirement: Create Host Session from Dashboard
**Description:** Authenticated host clicks `Host a session` → POST `/sessions/` → routes to `/session/{id}/host?code={joinCode}`. Shows `Creating...` while pending. Fresh session does NOT mount YouTube player.

#### Test TC008 Host creates a new live session from the dashboard
- **Test Code:** [TC008_Host_creates_a_new_live_session_from_the_dashboard.py](./TC008_Host_creates_a_new_live_session_from_the_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/7101016d-bb66-401a-a1fa-7c5b6f9267b6
- **Status:** ✅ Passed
- **Analysis / Findings:** Dashboard `Host a session` lands on host session view with visible join code in URL/header.

#### Test TC019 Fresh host session does not mount playback controls before a video is set
- **Test Code:** [TC019_Fresh_host_session_does_not_mount_playback_controls_before_a_video_is_set.py](./TC019_Fresh_host_session_does_not_mount_playback_controls_before_a_video_is_set.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/7e012522-bab1-4b6b-a4aa-da4ac808f75f
- **Status:** ❌ Failed
- **Test Error:** Playback controls (play/pause, progress bar, volume) render and look interactive even though header shows "No song playing yet".
- **Analysis / Findings:** PRD §5.7 says floating playback dock is "effectively disabled until a `currentVideoId` is present." Dock currently renders with active-looking visuals on a fresh session. YouTube iframe is correctly NOT mounted — the issue is purely visual affordance of the dock buttons. Either (a) wire `disabled` state + reduced opacity into the dock buttons before any track has played, or (b) hide the dock entirely until `currentVideoId` is present. Low product severity (clicks are no-ops) but breaks the UX promise in the PRD.

#### Test TC022 Host sees a creating state while session creation is pending
- **Test Code:** [TC022_Host_sees_a_creating_state_while_session_creation_is_pending.py](./TC022_Host_sees_a_creating_state_while_session_creation_is_pending.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/145d897b-c43d-43be-b41e-6a8f942a16e9
- **Status:** ✅ Passed
- **Analysis / Findings:** Pending `Creating...` label observed during session creation request flight.

#### Test TC025 Host can create another new session from the host session settings
- **Test Code:** [TC025_Host_can_create_another_new_session_from_the_host_session_settings.py](./TC025_Host_can_create_another_new_session_from_the_host_session_settings.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/8ae72cdd-fbd7-401f-93b8-657e6a8c2918
- **Status:** ✅ Passed
- **Analysis / Findings:** Settings → Create new session lands on new host session view with a fresh join code.

---

### Requirement: Previous Sessions List (Host Dashboard)
**Description:** Authenticated dashboard renders prior sessions with Live/Ended badges and participant counts; rows open the corresponding host session view.

#### Test TC015 Host sees a previous sessions list with badges and participant counts
- **Test Code:** [TC015_Host_sees_a_previous_sessions_list_with_badges_and_participant_counts.py](./TC015_Host_sees_a_previous_sessions_list_with_badges_and_participant_counts.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/b24265eb-c85c-4b78-9f24-24ec22b6a890
- **Status:** ✅ Passed
- **Analysis / Findings:** Previous sessions list displays Live/Ended status indicators and participant counts.

#### Test TC016 Host opens a live session from the previous sessions list
- **Test Code:** [TC016_Host_opens_a_live_session_from_the_previous_sessions_list.py](./TC016_Host_opens_a_live_session_from_the_previous_sessions_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/b7745e8d-8abd-4168-94bf-0ce45f44d307
- **Status:** ✅ Passed
- **Analysis / Findings:** `Open dashboard` row action lands on the active host session view.

#### Test TC020 Host opens an ended room from the previous sessions list after stopping a session
- **Test Code:** [TC020_Host_opens_an_ended_room_from_the_previous_sessions_list_after_stopping_a_session.py](./TC020_Host_opens_an_ended_room_from_the_previous_sessions_list_after_stopping_a_session.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/758d4cbf-3448-4f45-8889-687b618574e7
- **Status:** ✅ Passed
- **Analysis / Findings:** After Stop Session, `View room` row resolves to the ended-recap state, matching PRD §5.7.2.

---

### Requirement: Join Room via Landing Modal (6-char code)
**Description:** Modal accepts 6-char alphanumeric code. Pre-validates via `GET /sessions/:code`. Shows `Please enter a valid URL.` on bad format and `Session not found for code {CODE}` on missing room.

#### Test TC007 Participant can join via landing modal using a valid 6-character code
- **Test Code:** [TC007_Participant_can_join_via_landing_modal_using_a_valid_6_character_code.py](./TC007_Participant_can_join_via_landing_modal_using_a_valid_6_character_code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/4e067c5c-b6b2-4c23-8bce-57f34dbdd7f2
- **Status:** ✅ Passed
- **Analysis / Findings:** 6-char code preflight succeeds and lands on `/session/{CODE}/join`.

#### Test TC029 Join modal shows session-not-found error for a valid-looking but nonexistent code
- **Test Code:** [TC029_Join_modal_shows_session_not_found_error_for_a_valid_looking_but_nonexistent_code.py](./TC029_Join_modal_shows_session_not_found_error_for_a_valid_looking_but_nonexistent_code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/eb1a6993-4c98-40d5-9ad8-a61b1054e3fe
- **Status:** ✅ Passed
- **Analysis / Findings:** Inline `Session not found for code {CODE}` rendered for unknown 6-char code.

---

### Requirement: Join Room via Landing Modal (full invite URL)
**Description:** Modal accepts a full invite URL containing `/session/{CODE}/join` or `?code={CODE}` (maxLength 512) and pre-validates the parsed code.

#### Test TC005 Participant join via full invite URL proceeds to pre-join then live session
- **Test Code:** [TC005_Participant_join_via_full_invite_URL_proceeds_to_pre_join_then_live_session.py](./TC005_Participant_join_via_full_invite_URL_proceeds_to_pre_join_then_live_session.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/4c515891-bbd1-42f0-93b1-a3166e7a9b8c
- **Status:** ✅ Passed
- **Analysis / Findings:** Pasting a freshly-created host invite URL parses out the code, lands on pre-join, accepts the display name, and reaches the participant live view.

#### Test TC012 Participant joins a room from landing modal using a full invite URL
- **Test Code:** [TC012_Participant_joins_a_room_from_landing_modal_using_a_full_invite_URL.py](./TC012_Participant_joins_a_room_from_landing_modal_using_a_full_invite_URL.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/20b5a8bc-8c86-4093-b42f-925835b6ca2f
- **Status:** ❌ Failed
- **Test Error:** Pasting `http://localhost:3000/?code=ABC123` shows "Session not found for code ABC123" and never reaches pre-join.
- **Analysis / Findings:** **False negative — test data bug, not a product bug.** The test pasted a hardcoded URL with code `ABC123` instead of a freshly-created session code (TC005 covers the same flow with a fresh code and passes). Product behavior is correct: parsing succeeded (`ABC123` extracted), preflight `/sessions/ABC123` correctly returned not-found, modal rendered the documented inline error. Recommend either suppressing this case (covered by TC005 + TC029) or fixing the test fixture to feed a live invite URL.

---

### Requirement: Participant Pre-Join Screen
**Description:** Validates session via `GET /sessions/:code`, shows host card + listener count, requires display name, persists guest UUID + name to `localStorage`, then routes to `/session/{uuid}`.

#### Test TC002 Participant completes pre-join and enters live session with guest identity persisted
- **Test Code:** [TC002_Participant_completes_pre_join_and_enters_live_session_with_guest_identity_persisted.py](./TC002_Participant_completes_pre_join_and_enters_live_session_with_guest_identity_persisted.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/b74fa510-94f0-413c-a74e-ac53f035eb87
- **Status:** ⛔ Blocked
- **Test Error:** Visual flow succeeded (`Joined as Guest Tester` rendered), but the harness cannot read `localStorage` from UI to verify `upnext.guest.*` keys.
- **Analysis / Findings:** Harness limitation, not a product gap. Visible behavior matches PRD §5.5. Reframe assertion to read storage via a `window.localStorage` shim or a JS-eval action; alternatively cover persistence at the unit-test layer.

#### Test TC021 Participant pre-join shows room summary information
- **Test Code:** [TC021_Participant_pre_join_shows_room_summary_information.py](./TC021_Participant_pre_join_shows_room_summary_information.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/5bacc7b5-2ca3-4b9d-8b0c-3724f6eed814
- **Status:** ✅ Passed
- **Analysis / Findings:** Pre-join renders host name (`Curated by …`) and listener count card.

#### Test TC027 Participant cannot proceed on pre-join with an invalid room code
- **Test Code:** [TC027_Participant_cannot_proceed_on_pre_join_with_an_invalid_room_code.py](./TC027_Participant_cannot_proceed_on_pre_join_with_an_invalid_room_code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/29f3e2fb-e7e3-4dd1-805b-ec3ffa36cdf6
- **Status:** ✅ Passed
- **Analysis / Findings:** `Session not found for code {CODE}` is shown and submit is disabled for invalid codes.

---

### Requirement: Participant Live Session — Add Track
**Description:** `Add to Queue` accepts text query (with keyboard-navigable suggestions), YouTube URL, or Spotify URL. Bad URLs trigger error toast and do not enqueue.

#### Test TC004 Participant adds a track using keyboard-navigated search suggestions
- **Test Code:** [TC004_Participant_adds_a_track_using_keyboard_navigated_search_suggestions.py](./TC004_Participant_adds_a_track_using_keyboard_navigated_search_suggestions.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/4c8e9ae2-4b50-48d4-b90b-0a0133a49b14
- **Status:** ✅ Passed
- **Analysis / Findings:** ArrowDown / Enter on search dropdown enqueues the highlighted track via WS `ADD_SONG`.

#### Test TC014 Participant adds a track by submitting a YouTube URL
- **Test Code:** [TC014_Participant_adds_a_track_by_submitting_a_YouTube_URL.py](./TC014_Participant_adds_a_track_by_submitting_a_YouTube_URL.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/232e2797-d5c6-4205-8dc5-75bcc6819f5c
- **Status:** ✅ Passed
- **Analysis / Findings:** Valid YouTube URL is parsed and added to queue.

#### Test TC026 Participant sees an error toast when submitting an invalid or unresolvable track URL
- **Test Code:** [TC026_Participant_sees_an_error_toast_when_submitting_an_invalid_or_unresolvable_track_URL.py](./TC026_Participant_sees_an_error_toast_when_submitting_an_invalid_or_unresolvable_track_URL.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/fb23b790-bd32-445a-8490-3a65a803c482
- **Status:** ✅ Passed
- **Analysis / Findings:** `InvalidVideoId` surfaces as error toast with no new queue entry.

---

### Requirement: Participant Live Session — Upvote
**Description:** Upvote toggles per row, count and ordering update via WS.

#### Test TC003 Upvote a queued track and see vote state and ordering update
- **Test Code:** [TC003_Upvote_a_queued_track_and_see_vote_state_and_ordering_update.py](./TC003_Upvote_a_queued_track_and_see_vote_state_and_ordering_update.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/3f473f09-f32a-4fbc-8e00-58a7a30b6d17
- **Status:** ✅ Passed
- **Analysis / Findings:** Upvote toggle reflects `votedByMe` state; queue reorders by votes desc per backend rule.

---

### Requirement: Participant Edit Display Name
**Description:** Pencil dialog updates name via WS `UPDATE_NAME`. Empty/whitespace-only name rejected with error toast.

#### Test TC017 Change display name and see it update in header and People list
- **Test Code:** [TC017_Change_display_name_and_see_it_update_in_header_and_People_list.py](./TC017_Change_display_name_and_see_it_update_in_header_and_People_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/bcecbb3f-ea4f-42db-8aa6-dfb74e0c247e
- **Status:** ✅ Passed
- **Analysis / Findings:** Updated name appears in header `Joined as …` and People list.

#### Test TC028 Reject empty or whitespace-only display name change with a toast
- **Test Code:** [TC028_Reject_empty_or_whitespace_only_display_name_change_with_a_toast.py](./TC028_Reject_empty_or_whitespace_only_display_name_change_with_a_toast.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/d53d90ff-1863-46f2-9e41-19f69a0af9dd
- **Status:** ✅ Passed
- **Analysis / Findings:** Whitespace-only save rejected; previous header name preserved.

---

### Requirement: Participant Invite Friends Modal
**Description:** Sidebar modal with `Copy Link` (Copy → Copied → reset) and X-close.

#### Test TC023 Copy invite link from Invite Friends modal and close the modal
- **Test Code:** [TC023_Copy_invite_link_from_Invite_Friends_modal_and_close_the_modal.py](./TC023_Copy_invite_link_from_Invite_Friends_modal_and_close_the_modal.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/4e792fec-b3fd-4b9d-aa66-bc251386b2de
- **Status:** ✅ Passed
- **Analysis / Findings:** Copy state cycles `Copy Link → Copied → reset`; X dismisses modal.

---

### Requirement: Participant History and People Views
**Description:** History view lists past tracks (empty state copy). People view lists members with `Host` badge from `sessionHost` helper.

#### Test TC018 Participant switches between History and People and sees Host badge
- **Test Code:** [TC018_Participant_switches_between_History_and_People_and_sees_Host_badge.py](./TC018_Participant_switches_between_History_and_People_and_sees_Host_badge.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/e4a4710b-ae6c-4e9c-91d9-330cad91c42c
- **Status:** ✅ Passed
- **Analysis / Findings:** Host badge present in People; History empty-state copy shown.

#### Test TC030 Participant join modal rejects empty or whitespace-only input
- **Test Code:** [TC030_Participant_join_modal_rejects_empty_or_whitespace_only_input.py](./TC030_Participant_join_modal_rejects_empty_or_whitespace_only_input.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/e40510a1-571b-4d2e-9c3b-115c149e64dc
- **Status:** ✅ Passed
- **Analysis / Findings:** (Mis-categorized in plan; really a Join Modal validation case.) Whitespace input blocks submit.

---

### Requirement: Host Session View — Live Layout and Live Feed
**Description:** Live host view shows now-playing card, Live Feed events, queue, Invite panel, and a playback dock that should be inert before any track plays.

#### Test TC001 Host creates a new session and sees join code with no player mounted
- **Test Code:** [TC001_Host_creates_a_new_session_and_sees_join_code_with_no_player_mounted.py](./TC001_Host_creates_a_new_session_and_sees_join_code_with_no_player_mounted.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/577e1977-5e93-4771-b197-bd3304b86b48
- **Status:** ✅ Passed
- **Analysis / Findings:** Visible join code present and YouTube iframe correctly NOT mounted on a fresh empty session (matches PRD §5.7).

#### Test TC013 Host sees live layout sections on the host session view
- **Test Code:** [TC013_Host_sees_live_layout_sections_on_the_host_session_view.py](./TC013_Host_sees_live_layout_sections_on_the_host_session_view.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/d49fcf24-81fd-4b80-a887-53aa86921b82
- **Status:** ✅ Passed
- **Analysis / Findings:** Live Feed, queue, and Invite panel all render in the host live view.

---

### Requirement: Host Settings Modal — Create New Session
**Description:** Settings → `Create new session` POSTs `/sessions/` and routes to new host session view.

#### Test TC009 Host can open Settings and create a new session from the host session view
- **Test Code:** [TC009_Host_can_open_Settings_and_create_a_new_session_from_the_host_session_view.py](./TC009_Host_can_open_Settings_and_create_a_new_session_from_the_host_session_view.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/4bced8ea-c3de-40a9-8c42-fbc878f70a8a
- **Status:** ✅ Passed
- **Analysis / Findings:** Pending `Creating...` then navigate to `/session/{newId}/host?code={newCode}`.

---

### Requirement: Host Settings Modal — Stop Session and Ended Recap
**Description:** `Stop Session` ends the room and re-resolves the host route to `EndedHostSessionRecap`. Stop Session control no longer reachable after.

#### Test TC006 Host stops a live session and sees ended recap
- **Test Code:** [TC006_Host_stops_a_live_session_and_sees_ended_recap.py](./TC006_Host_stops_a_live_session_and_sees_ended_recap.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/a04f0516-6802-417b-a345-cfac7482dc00
- **Status:** ✅ Passed
- **Analysis / Findings:** Inline `Session Ended` recap shown with participants and songs played; Stop Session no longer reachable.

---

## 3️⃣ Coverage & Matching Metrics

- **90.00%** of executed tests passed (27 / 30)
- **3.33%** failed due to product/UX deviation (1 / 30 — TC019)
- **3.33%** failed due to test fixture (1 / 30 — TC012, false negative)
- **3.33%** blocked by harness limitation (1 / 30 — TC002)

| Requirement                                                  | Total Tests | ✅ Passed | ❌ Failed | ⛔ Blocked |
|--------------------------------------------------------------|-------------|-----------|-----------|------------|
| Host Sign-up                                                 | 1           | 1         | 0         | 0          |
| Host Login                                                   | 1           | 1         | 0         | 0          |
| Host Logout                                                  | 1           | 1         | 0         | 0          |
| Create Host Session from Dashboard                           | 4           | 3         | 1         | 0          |
| Previous Sessions List (Host Dashboard)                      | 3           | 3         | 0         | 0          |
| Join Room via Landing Modal (6-char code)                    | 2           | 2         | 0         | 0          |
| Join Room via Landing Modal (full invite URL)                | 2           | 1         | 1         | 0          |
| Participant Pre-Join Screen                                  | 3           | 2         | 0         | 1          |
| Participant Live Session — Add Track                         | 3           | 3         | 0         | 0          |
| Participant Live Session — Upvote                            | 1           | 1         | 0         | 0          |
| Participant Edit Display Name                                | 2           | 2         | 0         | 0          |
| Participant Invite Friends Modal                             | 1           | 1         | 0         | 0          |
| Participant History and People Views                         | 2           | 2         | 0         | 0          |
| Host Session View — Live Layout and Live Feed                | 2           | 2         | 0         | 0          |
| Host Settings Modal — Create New Session                     | 1           | 1         | 0         | 0          |
| Host Settings Modal — Stop Session and Ended Recap           | 1           | 1         | 0         | 0          |
| **TOTAL**                                                    | **30**      | **27**    | **2**     | **1**      |

---

## 4️⃣ Key Gaps / Risks

### 4.1 Product issue worth fixing — playback dock affordance on empty session (TC019)
- **Where:** `frontend/app/session/[id]/host/page.tsx` — floating playback dock.
- **Observation:** Dock renders with active-looking play/pause, progress, and volume controls before any `currentVideoId` is set, while the header reads `No song playing yet`.
- **PRD contract:** §5.7 states "Playback controls are effectively disabled until a `currentVideoId` is present."
- **Recommendation:** Either set `disabled` (with reduced opacity / cursor-not-allowed) on the dock buttons until `currentVideoId !== null`, or unmount the dock entirely until then. Low blast radius — purely affordance — but it directly contradicts the documented behavior and is the kind of polish gap a participant test would raise during a hackathon demo.

### 4.2 False-negative test fixture (TC012)
- **Where:** TestSprite test code for TC012.
- **Observation:** Used a hardcoded `?code=ABC123` invite URL instead of one minted from a fresh host session.
- **Impact:** Reports a failure even though the product behaves correctly (parses code, preflights, shows the documented `Session not found` error). TC005 already covers the happy path with a live URL, and TC029 covers the not-found path.
- **Recommendation:** Patch TC012 to source the invite URL from the just-created host session view, or drop TC012 in favor of TC005 + TC029 coverage.

### 4.3 Harness can't read localStorage (TC002)
- **Where:** TestSprite browser harness.
- **Observation:** Visible flow succeeded (`Joined as Guest Tester`), but the assertion on `upnext.guest.*` localStorage entries cannot be evaluated through UI-only interactions.
- **Recommendation:** Either add a hidden debug element that mirrors guest-identity values for testability, or cover this persistence assertion via a Playwright/Vitest layer with direct `page.evaluate(() => localStorage.getItem(...))` access.

### 4.4 Coverage gaps (not executed in this run)
The 30-test production cap dropped 7 Low-priority cases generated in the plan: TC031 invalid-password toast, TC032 join-modal invalid input, TC033 unparseable URL, TC034 duplicate sign-up email, TC035 dismiss invite modal, TC036 oversize join input, TC037 maxLength enforcement. Most of these are negative-path validations; consider promoting at least TC031 (invalid login) and TC034 (duplicate email) to High so the auth error toasts are exercised on every run.

### 4.5 Areas not yet covered by automated UI tests (PRD scope)
- `Copy Link` from the host `Invite your crowd` panel (only participant Invite modal copy was exercised via TC023).
- Participant `Host ended this session` screen and `Go Home` / `Create Your Own Session` CTAs after host stops the room (PRD §5.6).
- Duplicate-song rejection (`SongAlreadyQueued`).
- Spotify URL add-track path (only YouTube URL + search were covered).
- Vote-cannot-target-current-song rule.
- Live Feed event copy (`{name} joined the jam`, `started the jam`, `voted for {trackTitle}`).
- WS resilience: `ConnectionFailed` / `ReconnectFailed` debounce window.

These should be added to the next round of high-priority tests once TC012 and TC019 are resolved.
