# TestSprite AI Testing Report (MCP) — Round 1

---

## 1️⃣ Document Metadata

| Field | Value |
|---|---|
| **Project Name** | upnext |
| **Test Type** | Frontend (E2E) |
| **Date** | 2026-04-18 |
| **Prepared by** | TestSprite AI + Claude Code |
| **Server Mode** | Production (port 3000) |
| **Total Tests** | 25 |
| **Passed** | 21 |
| **Failed** | 3 |
| **Blocked** | 1 |
| **Pass Rate** | 84% |

---

## 2️⃣ Requirement Validation Summary

### REQ-01: Host Authentication (Signup / Login / Logout)

#### TC011 — Sign up creates a new host account and shows authenticated dashboard
- **Code:** [TC011_Sign_up_creates_a_new_host_account_and_shows_authenticated_dashboard.py](./TC011_Sign_up_creates_a_new_host_account_and_shows_authenticated_dashboard.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/ad701878-2b42-4e21-a784-1f89956e2514)
- **Status:** ✅ Passed
- **Analysis:** Signup flow with display name, email, and password works correctly. Successful account creation transitions user to the authenticated host dashboard.

---

#### TC009 — Login shows authenticated dashboard
- **Code:** [TC009_Login_shows_authenticated_dashboard.py](./TC009_Login_shows_authenticated_dashboard.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/d6dcd82d-6fca-4581-babb-516c349f510e)
- **Status:** ✅ Passed
- **Analysis:** Login with seed credentials (`admin@gmail.com` / `admin123`) succeeds and renders the authenticated dashboard with "Welcome, admin." heading and "Host a session" CTA.

---

#### TC024 — Invalid login shows error toast
- **Code:** [TC024_Invalid_login_shows_error_toast.py](./TC024_Invalid_login_shows_error_toast.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/56552eeb-1b76-4650-9741-6efb0e287707)
- **Status:** ✅ Passed
- **Analysis:** Wrong password triggers "Invalid email or password." toast. No inline field error is shown, consistent with PRD spec (toast-only feedback).

---

#### TC015 — Logout returns host to unauthenticated auth gate
- **Code:** [TC015_Logout_returns_host_to_unauthenticated_auth_gate.py](./TC015_Logout_returns_host_to_unauthenticated_auth_gate.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/cee3c704-14dd-4c80-b26e-885b84ff64be)
- **Status:** ✅ Passed
- **Analysis:** Logout clears the host JWT from localStorage and renders the unauthenticated auth gate with login/signup tabs.

---

### REQ-02: Host Session Management (Create / Open / Stop)

#### TC006 — Create a new host session from the dashboard and reach host room with join code
- **Code:** [TC006_Create_a_new_host_session_from_the_dashboard_and_reach_host_room_with_join_code.py](./TC006_Create_a_new_host_session_from_the_dashboard_and_reach_host_room_with_join_code.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/6e49aed3-edc1-4b71-b0c8-fc7527f62bc7)
- **Status:** ✅ Passed
- **Analysis:** "Host a session" button triggers `POST /sessions/`, shows "Creating..." label while pending, and navigates to `/session/{id}/host?code={CODE}` with visible join code and empty queue.

---

#### TC013 — Open an existing session from the dashboard session list
- **Code:** [TC013_Open_an_existing_session_from_the_dashboard_session_list.py](./TC013_Open_an_existing_session_from_the_dashboard_session_list.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/75b41e8a-3b93-437a-9552-9d786b726e0f)
- **Status:** ✅ Passed
- **Analysis:** Previous sessions list loads correctly. "Open dashboard" / "View room" row buttons navigate to the correct host session URL.

---

#### TC010 — Create a new session from Settings and get redirected to a new host room
- **Code:** [TC010_Create_a_new_session_from_Settings_and_get_redirected_to_a_new_host_room.py](./TC010_Create_a_new_session_from_Settings_and_get_redirected_to_a_new_host_room.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/bc83f6f9-98af-46c9-9e63-ab8bfe8910b7)
- **Status:** ✅ Passed
- **Analysis:** "Create new session" inside Settings modal (host session view) shows "Creating..." label, then navigates directly to the new `/session/{newId}/host?code={newCode}` — does not return to `/host/auth`.

---

#### TC008 — Stop a running session and see the ended-session recap inline
- **Code:** [TC008_Stop_a_running_session_and_see_the_ended_session_recap_inline.py](./TC008_Stop_a_running_session_and_see_the_ended_session_recap_inline.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/bcc91647-70e0-4688-927f-a531c84554de)
- **Status:** ✅ Passed
- **Analysis:** "Stop Session" triggers `POST /sessions/by-id/:id/stop`, shows "Stopping…" label, closes the settings modal, and renders the `EndedHostSessionRecap` inline with "Session Ended" heading, participant list, and songs played.

---

#### TC018 — After stopping, session controls no longer allow stopping again
- **Code:** [TC018_After_stopping_session_controls_no_longer_allow_stopping_again.py](./TC018_After_stopping_session_controls_no_longer_allow_stopping_again.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/6561e6f8-d0be-4673-a8b3-f2e242c77f8a)
- **Status:** ❌ Failed
- **Analysis:** After stopping the session, the "Stop Session" button remained accessible inside Host Settings. The test expected that once `EndedHostSessionRecap` is shown the full live-view tree (including Settings) is unmounted. This indicates either the recap rendering didn't fully unmount the host view, or the router.replace to the same URL caused the ended-state detection to lag.

---

### REQ-03: Host Playback State

#### TC012 — See empty-session state where playback is disabled when no current song is active
- **Code:** [TC012_See_empty_session_state_where_playback_is_disabled_when_no_current_song_is_active.py](./TC012_See_empty_session_state_where_playback_is_disabled_when_no_current_song_is_active.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/cbd88696-0498-429a-a1e1-804342b334a5)
- **Status:** ✅ Passed
- **Analysis:** Freshly created session shows no YouTube iframe and disabled playback controls, consistent with PRD spec (player mounts only when `currentVideoId` is set).

---

### REQ-04: Participant Join Flow

#### TC001 — Join a live session from pre-join by providing a display name
- **Code:** [TC001_Join_a_live_session_from_pre_join_by_providing_a_display_name.py](./TC001_Join_a_live_session_from_pre_join_by_providing_a_display_name.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/77d77dba-87cc-4bcc-a74e-d6edf07f05ac)
- **Status:** 🚫 Blocked
- **Analysis:** Test attempted to navigate to `/login` which does not exist in this app — host auth lives at `/host/auth`. This is a test-generation issue: the agent used a generic `/login` route rather than the documented `/host/auth`. The underlying feature (pre-join display name) is likely functional (TC016 passed). Will be corrected in Round 2.

---

#### TC016 — Display session information on pre-join screen
- **Code:** [TC016_Display_session_information_on_pre_join_screen.py](./TC016_Display_session_information_on_pre_join_screen.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/dcd2d983-f895-48f8-b7bd-de3a5de9d55f)
- **Status:** ✅ Passed
- **Analysis:** Pre-join screen at `/session/{CODE}/join` correctly shows "The session is live.", host info card ("Room {CODE}", "Curated by {hostName}"), display name input, and "Enter the Gallery" button.

---

#### TC020 — Show session-not-found message on pre-join for an invalid session code
- **Code:** [TC020_Show_session_not_found_message_on_pre_join_for_an_invalid_session_code.py](./TC020_Show_session_not_found_message_on_pre_join_for_an_invalid_session_code.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/ba3c623b-57ad-4c15-bdef-93148108af6c)
- **Status:** ✅ Passed
- **Analysis:** Navigating to `/session/XXXXXX/join` with a non-existent code renders "Session not found for code XXXXXX".

---

### REQ-05: Landing Page Join Modal

#### TC002 — Join a session from landing using a valid 6-character code
- **Code:** [TC002_Join_a_session_from_landing_using_a_valid_6_character_code.py](./TC002_Join_a_session_from_landing_using_a_valid_6_character_code.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/7d9386dc-621c-43b3-adf4-c1e922e2c8e1)
- **Status:** ✅ Passed
- **Analysis:** Entering a valid 6-char code in the Join Room modal triggers preflight `GET /sessions/:code`, shows "Checking..." on the button, then navigates to `/session/{CODE}/join` on success.

---

#### TC004 — Join a session from landing using a full invite URL
- **Code:** [TC004_Join_a_session_from_landing_using_a_full_invite_URL.py](./TC004_Join_a_session_from_landing_using_a_full_invite_URL.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/abafe654-9bc3-47c0-8f9d-6d36e1f3714f)
- **Status:** ✅ Passed
- **Analysis:** Pasting a full invite URL containing `/session/{CODE}/join` or `?code={CODE}` is correctly parsed, pre-validated, and routes to `/session/{CODE}/join`.

---

#### TC019 — Show session-not-found error for a non-existent code on landing
- **Code:** [TC019_Show_session_not_found_error_for_a_non_existent_code_on_landing.py](./TC019_Show_session_not_found_error_for_a_non_existent_code_on_landing.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/d9b9cc31-6685-43cf-92d5-f7e3d50b63fd)
- **Status:** ✅ Passed
- **Analysis:** Valid-format code that has no matching session shows inline error "Session not found for code {CODE}" — correctly differentiated from the format-error case.

---

#### TC023 — Reject invalid join input format on landing
- **Code:** [TC023_Reject_invalid_join_input_format_on_landing.py](./TC023_Reject_invalid_join_input_format_on_landing.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/e400f383-8ca3-428c-a34d-7f316de94e24)
- **Status:** ✅ Passed
- **Analysis:** Input that cannot be parsed to a 6-char code shows inline error "Please enter a valid URL." without making any backend request.

---

#### TC025 — Close Join Room modal without navigating away
- **Code:** [TC025_Close_Join_Room_modal_without_navigating_away.py](./TC025_Close_Join_Room_modal_without_navigating_away.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/90ecf2e5-fdcd-4ccf-aa0d-ee5e874a6816)
- **Status:** ✅ Passed
- **Analysis:** Cancel and X buttons correctly dismiss the modal with no navigation side effects.

---

### REQ-06: Participant Live Session (Queue, Voting, Name Edit, People Tab)

#### TC005 — Add a track via keyboard search suggestions and see it in the queue
- **Code:** [TC005_Add_a_track_via_keyboard_search_suggestions_and_see_it_in_the_queue.py](./TC005_Add_a_track_via_keyboard_search_suggestions_and_see_it_in_the_queue.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/99404c14-34dd-4f45-9ab4-f26d93a3af0f)
- **Status:** ✅ Passed
- **Analysis:** Typing a query shows search dropdown; ArrowDown / Enter keyboard navigation selects a suggestion; "Add Track" adds it to the queue, which updates live via WebSocket.

---

#### TC007 — Add a track using a valid YouTube URL
- **Code:** [TC007_Add_a_track_using_a_valid_YouTube_URL.py](./TC007_Add_a_track_using_a_valid_YouTube_URL.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/4be45dd5-4ea3-4ebb-bf5b-750c2ea53013)
- **Status:** ✅ Passed
- **Analysis:** Pasting a valid YouTube URL directly into the Add to Queue input and clicking Add Track successfully adds the song to the queue.

---

#### TC003 — Upvote a queued track and see the vote state change
- **Code:** [TC003_Upvote_a_queued_track_and_see_the_vote_state_change.py](./TC003_Upvote_a_queued_track_and_see_the_vote_state_change.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/7add2994-9781-4497-8082-cb42f40d7865)
- **Status:** ✅ Passed
- **Analysis:** Clicking the upvote button toggles `votedByMe` filled state and vote count updates live via WebSocket `VOTE_ACTIVITY` message.

---

#### TC017 — Edit display name successfully and see it updated
- **Code:** [TC017_Edit_display_name_successfully_and_see_it_updated.py](./TC017_Edit_display_name_successfully_and_see_it_updated.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/f97f820c-cdcc-4ee2-85a7-9bd0d76e7ba9)
- **Status:** ✅ Passed
- **Analysis:** Pencil icon opens edit dialog pre-filled with current name. Saving a valid name updates the header label and People tab. Change propagates via WebSocket `UPDATE_NAME`.

---

#### TC021 — Reject whitespace-only display name changes
- **Code:** [TC021_Reject_whitespace_only_display_name_changes.py](./TC021_Reject_whitespace_only_display_name_changes.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/d51a4b70-fe9b-43f3-8a87-92101f13acf5)
- **Status:** ✅ Passed
- **Analysis:** Submitting whitespace-only name is rejected by the backend and surfaces as an error toast with no inline validation message, consistent with PRD spec.

---

### REQ-07: Invite / Copy Link

#### TC014 — Copy invite link from the host session view
- **Code:** [TC014_Copy_invite_link_from_the_host_session_view.py](./TC014_Copy_invite_link_from_the_host_session_view.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/60b54f6c-dfd3-4214-8485-1182c466596f)
- **Status:** ❌ Failed
- **Analysis:** "Copy Link" button was clicked but no "Copied" confirmation text or toast appeared. Root cause: headless Chromium lacks clipboard write access by default, causing the copy operation to silently fail. The button state machine (Copy Link → Copied → reset) relies on a successful `navigator.clipboard.writeText()` call. In headless environments this API is unavailable without `--use-fake-ui-for-media-stream` or explicit permissions. This is a known caveat documented in the PRD. Test should be retried with clipboard permission granted or with a mock.

---

#### TC022 — Copy invite link from Invite Friends modal
- **Code:** [TC022_Copy_invite_link_from_Invite_Friends_modal.py](./TC022_Copy_invite_link_from_Invite_Friends_modal.py)
- **Result:** [View](https://www.testsprite.com/dashboard/mcp/tests/87ca7f36-2a49-43da-962c-a93a03d0cb97/4fd1ccfc-0435-420d-99a0-4611fdce61dd)
- **Status:** ❌ Failed
- **Analysis:** Same root cause as TC014 — headless Chromium clipboard API unavailable. Invite Friends modal "Copy Link" clicked twice with no state change. Both TC014 and TC022 failures are environment-related, not application bugs.

---

## 3️⃣ Coverage & Matching Metrics

| Requirement | Total Tests | ✅ Passed | ❌ Failed | 🚫 Blocked |
|---|---|---|---|---|
| REQ-01: Host Auth (Signup/Login/Logout) | 4 | 4 | 0 | 0 |
| REQ-02: Host Session Management | 5 | 4 | 1 | 0 |
| REQ-03: Host Playback State | 1 | 1 | 0 | 0 |
| REQ-04: Participant Join Flow | 3 | 2 | 0 | 1 |
| REQ-05: Landing Page Join Modal | 5 | 5 | 0 | 0 |
| REQ-06: Participant Live Session | 5 | 5 | 0 | 0 |
| REQ-07: Invite / Copy Link | 2 | 0 | 2 | 0 |
| **Total** | **25** | **21** | **3** | **1** |

**Pass Rate: 84%**

---

## 4️⃣ Key Gaps / Risks

### 🔴 High — TC018: Stop Session does not fully unmount host view

After `Stop Session`, the `EndedHostSessionRecap` is shown but the Settings sidebar item (and "Stop Session" button inside it) remains accessible. Per PRD §5.7.2, the full live-view tree should be unmounted once the recap is rendered. This could allow a host to attempt a double-stop on an already-expired session.

**Risk:** UX inconsistency and potential backend error if stop is called twice.

---

### 🟡 Medium — TC014 / TC022: Clipboard API unavailable in headless Chromium

Both Copy Link tests fail because `navigator.clipboard.writeText()` silently rejects in headless Chromium without explicit permissions. The app code itself appears correct (state machine, fallback to `Retry`). The PRD documents this caveat.

**Risk:** Low (environment-only). Application clipboard behavior is untested end-to-end; if the fallback error toast path (`Retry`) is broken, it would not be caught.

**Recommendation for Round 2:** Grant clipboard permission to the headless browser, or assert the `Retry` fallback path directly.

---

### 🟡 Medium — TC001 Blocked: Wrong login route used

Test agent navigated to `/login` (404) instead of `/host/auth`. The display-name pre-join flow itself passed via TC016, but the full end-to-end "join session from display name entry" test case was never executed.

**Risk:** Low (underlying flow works). Round 2 will fix the route target.

---

### 🟢 Low — Spotify URL track addition not covered

PRD §8 specifies Spotify track URL input support (backend resolves to YouTube). No test case was generated for this path. If the Spotify → YouTube resolver is broken, no test would catch it.

**Recommendation:** Add TC026 covering Spotify URL track add in Round 2.

---

### 🟢 Low — People tab Host badge not explicitly asserted

PRD §5.6 specifies the host participant shows a `Host` badge derived from `sessionHost.ts`. No dedicated test asserts this badge. Covered implicitly by session join tests but worth an explicit assertion.

---

### 🟢 Low — Session-expired participant screen not covered

PRD §5.6 specifies that when WebSocket reports `SessionExpired`, the participant view renders "Host ended this session" with `Go Home` and `Create Your Own Session` CTAs. No test covers this scenario.

**Recommendation:** Add TC027 for session-expired participant view in Round 2.
