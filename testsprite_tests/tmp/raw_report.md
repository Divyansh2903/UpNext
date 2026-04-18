
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** upnext
- **Date:** 2026-04-18
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Host creates a new session and sees join code with no player mounted
- **Test Code:** [TC001_Host_creates_a_new_session_and_sees_join_code_with_no_player_mounted.py](./TC001_Host_creates_a_new_session_and_sees_join_code_with_no_player_mounted.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/577e1977-5e93-4771-b197-bd3304b86b48
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Participant completes pre-join and enters live session with guest identity persisted
- **Test Code:** [TC002_Participant_completes_pre_join_and_enters_live_session_with_guest_identity_persisted.py](./TC002_Participant_completes_pre_join_and_enters_live_session_with_guest_identity_persisted.py)
- **Test Error:** TEST BLOCKED

The test cannot complete because verifying localStorage entries requires reading browser storage, which is not accessible from the UI interactions allowed by this test harness.

Observations:
- The participant live session view is visible and shows 'Joined as Guest Tester', indicating the display name submission and join succeeded visually.
- The test cannot read or assert values in localStorage (upnext.guest) via the visible UI, so persistence of the guest UUID/display name cannot be verified here.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/b74fa510-94f0-413c-a74e-ac53f035eb87
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Upvote a queued track and see vote state and ordering update
- **Test Code:** [TC003_Upvote_a_queued_track_and_see_vote_state_and_ordering_update.py](./TC003_Upvote_a_queued_track_and_see_vote_state_and_ordering_update.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/3f473f09-f32a-4fbc-8e00-58a7a30b6d17
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Participant adds a track using keyboard-navigated search suggestions
- **Test Code:** [TC004_Participant_adds_a_track_using_keyboard_navigated_search_suggestions.py](./TC004_Participant_adds_a_track_using_keyboard_navigated_search_suggestions.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/4c8e9ae2-4b50-48d4-b90b-0a0133a49b14
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Participant join via full invite URL proceeds to pre-join then live session
- **Test Code:** [TC005_Participant_join_via_full_invite_URL_proceeds_to_pre_join_then_live_session.py](./TC005_Participant_join_via_full_invite_URL_proceeds_to_pre_join_then_live_session.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/4c515891-bbd1-42f0-93b1-a3166e7a9b8c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Host stops a live session and sees ended recap
- **Test Code:** [TC006_Host_stops_a_live_session_and_sees_ended_recap.py](./TC006_Host_stops_a_live_session_and_sees_ended_recap.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/a04f0516-6802-417b-a345-cfac7482dc00
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Participant can join via landing modal using a valid 6-character code
- **Test Code:** [TC007_Participant_can_join_via_landing_modal_using_a_valid_6_character_code.py](./TC007_Participant_can_join_via_landing_modal_using_a_valid_6_character_code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/4e067c5c-b6b2-4c23-8bce-57f34dbdd7f2
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Host creates a new live session from the dashboard
- **Test Code:** [TC008_Host_creates_a_new_live_session_from_the_dashboard.py](./TC008_Host_creates_a_new_live_session_from_the_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/7101016d-bb66-401a-a1fa-7c5b6f9267b6
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Host can open Settings and create a new session from the host session view
- **Test Code:** [TC009_Host_can_open_Settings_and_create_a_new_session_from_the_host_session_view.py](./TC009_Host_can_open_Settings_and_create_a_new_session_from_the_host_session_view.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/4bced8ea-c3de-40a9-8c42-fbc878f70a8a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 Log in as an existing host and reach the authenticated dashboard
- **Test Code:** [TC010_Log_in_as_an_existing_host_and_reach_the_authenticated_dashboard.py](./TC010_Log_in_as_an_existing_host_and_reach_the_authenticated_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/24a5a12f-29c6-455a-b7b5-2086a929b395
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Create a host account and reach the authenticated dashboard
- **Test Code:** [TC011_Create_a_host_account_and_reach_the_authenticated_dashboard.py](./TC011_Create_a_host_account_and_reach_the_authenticated_dashboard.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/3363dd0a-be05-4727-be0d-8ec3657a903e
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Participant joins a room from landing modal using a full invite URL
- **Test Code:** [TC012_Participant_joins_a_room_from_landing_modal_using_a_full_invite_URL.py](./TC012_Participant_joins_a_room_from_landing_modal_using_a_full_invite_URL.py)
- **Test Error:** TEST FAILURE

Pasting a full invite URL did not allow the guest to join the room — the app rejected the code and did not show the participant pre-join for that room.

Observations:
- The join input contains the pasted URL "http://localhost:3000/?code=ABC123" (input shows invalid=true).
- The modal displays a red error: "Session not found for code ABC123".
- The pre-join header "Join a room" remained and no valid 6-character room code screen was shown for ABC123.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/20b5a8bc-8c86-4093-b42f-925835b6ca2f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Host sees live layout sections on the host session view
- **Test Code:** [TC013_Host_sees_live_layout_sections_on_the_host_session_view.py](./TC013_Host_sees_live_layout_sections_on_the_host_session_view.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/d49fcf24-81fd-4b80-a887-53aa86921b82
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Participant adds a track by submitting a YouTube URL
- **Test Code:** [TC014_Participant_adds_a_track_by_submitting_a_YouTube_URL.py](./TC014_Participant_adds_a_track_by_submitting_a_YouTube_URL.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/232e2797-d5c6-4205-8dc5-75bcc6819f5c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Host sees a previous sessions list with badges and participant counts
- **Test Code:** [TC015_Host_sees_a_previous_sessions_list_with_badges_and_participant_counts.py](./TC015_Host_sees_a_previous_sessions_list_with_badges_and_participant_counts.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/b24265eb-c85c-4b78-9f24-24ec22b6a890
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Host opens a live session from the previous sessions list
- **Test Code:** [TC016_Host_opens_a_live_session_from_the_previous_sessions_list.py](./TC016_Host_opens_a_live_session_from_the_previous_sessions_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/b7745e8d-8abd-4168-94bf-0ce45f44d307
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Change display name and see it update in header and People list
- **Test Code:** [TC017_Change_display_name_and_see_it_update_in_header_and_People_list.py](./TC017_Change_display_name_and_see_it_update_in_header_and_People_list.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/bcecbb3f-ea4f-42db-8aa6-dfb74e0c247e
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Participant switches between History and People and sees Host badge
- **Test Code:** [TC018_Participant_switches_between_History_and_People_and_sees_Host_badge.py](./TC018_Participant_switches_between_History_and_People_and_sees_Host_badge.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/e4a4710b-ae6c-4e9c-91d9-330cad91c42c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019 Fresh host session does not mount playback controls before a video is set
- **Test Code:** [TC019_Fresh_host_session_does_not_mount_playback_controls_before_a_video_is_set.py](./TC019_Fresh_host_session_does_not_mount_playback_controls_before_a_video_is_set.py)
- **Test Error:** TEST FAILURE

Playback controls are visible and appear active even though the session shows 'No song playing yet'.

Observations:
- The host session header displays 'No song playing yet'.
- Playback controls (play/pause button, progress bar, volume slider) are present at the bottom of the page.
- Controls are not disabled or hidden before a track is selected.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/7e012522-bab1-4b6b-a4aa-da4ac808f75f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Host opens an ended room from the previous sessions list after stopping a session
- **Test Code:** [TC020_Host_opens_an_ended_room_from_the_previous_sessions_list_after_stopping_a_session.py](./TC020_Host_opens_an_ended_room_from_the_previous_sessions_list_after_stopping_a_session.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/758d4cbf-3448-4f45-8889-687b618574e7
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021 Participant pre-join shows room summary information
- **Test Code:** [TC021_Participant_pre_join_shows_room_summary_information.py](./TC021_Participant_pre_join_shows_room_summary_information.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/5bacc7b5-2ca3-4b9d-8b0c-3724f6eed814
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022 Host sees a creating state while session creation is pending
- **Test Code:** [TC022_Host_sees_a_creating_state_while_session_creation_is_pending.py](./TC022_Host_sees_a_creating_state_while_session_creation_is_pending.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/145d897b-c43d-43be-b41e-6a8f942a16e9
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC023 Copy invite link from Invite Friends modal and close the modal
- **Test Code:** [TC023_Copy_invite_link_from_Invite_Friends_modal_and_close_the_modal.py](./TC023_Copy_invite_link_from_Invite_Friends_modal_and_close_the_modal.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/4e792fec-b3fd-4b9d-aa66-bc251386b2de
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC024 Log out from the host dashboard back to the auth gate
- **Test Code:** [TC024_Log_out_from_the_host_dashboard_back_to_the_auth_gate.py](./TC024_Log_out_from_the_host_dashboard_back_to_the_auth_gate.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/220239b7-1c19-4335-b1b2-56bf27936f2c
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC025 Host can create another new session from the host session settings
- **Test Code:** [TC025_Host_can_create_another_new_session_from_the_host_session_settings.py](./TC025_Host_can_create_another_new_session_from_the_host_session_settings.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/8ae72cdd-fbd7-401f-93b8-657e6a8c2918
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC026 Participant sees an error toast when submitting an invalid or unresolvable track URL
- **Test Code:** [TC026_Participant_sees_an_error_toast_when_submitting_an_invalid_or_unresolvable_track_URL.py](./TC026_Participant_sees_an_error_toast_when_submitting_an_invalid_or_unresolvable_track_URL.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/fb23b790-bd32-445a-8490-3a65a803c482
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC027 Participant cannot proceed on pre-join with an invalid room code
- **Test Code:** [TC027_Participant_cannot_proceed_on_pre_join_with_an_invalid_room_code.py](./TC027_Participant_cannot_proceed_on_pre_join_with_an_invalid_room_code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/29f3e2fb-e7e3-4dd1-805b-ec3ffa36cdf6
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC028 Reject empty or whitespace-only display name change with a toast
- **Test Code:** [TC028_Reject_empty_or_whitespace_only_display_name_change_with_a_toast.py](./TC028_Reject_empty_or_whitespace_only_display_name_change_with_a_toast.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/d53d90ff-1863-46f2-9e41-19f69a0af9dd
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC029 Join modal shows session-not-found error for a valid-looking but nonexistent code
- **Test Code:** [TC029_Join_modal_shows_session_not_found_error_for_a_valid_looking_but_nonexistent_code.py](./TC029_Join_modal_shows_session_not_found_error_for_a_valid_looking_but_nonexistent_code.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/eb1a6993-4c98-40d5-9ad8-a61b1054e3fe
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC030 Participant join modal rejects empty or whitespace-only input
- **Test Code:** [TC030_Participant_join_modal_rejects_empty_or_whitespace_only_input.py](./TC030_Participant_join_modal_rejects_empty_or_whitespace_only_input.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/6de4d1d3-7a27-41a8-a1fa-ec099e879570/e40510a1-571b-4d2e-9c3b-115c149e64dc
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **90.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---