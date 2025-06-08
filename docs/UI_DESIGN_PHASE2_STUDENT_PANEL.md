Version: SPEC_v2.md v2.0 — Updated for PR-002 — June 2025

Overview
This document defines the final design intent for the Student Panel UI in EaglePass v2.
It is the source of truth for engineering implementation (PR-002) and review.

Per SPEC → Student Panel is optimized for mobile-first (phones used in hallways).
Tone: casual, inviting, simple — must truthfully display current pass state.

1️⃣ Visual Layout and Flow
📱 Mobile-First Layout
------------------------------------------------
| Emergency Banner (if active)                 |
------------------------------------------------
| Student Info Box                             |
| Name, Grade, Student ID                      |
------------------------------------------------
| [ RESTROOM PASS ] (Red)                      |
------------------------------------------------
| Select Destination [Dropdown ▼]              |
| [ Request OUT Pass ] (Green)                 |
------------------------------------------------
| Current Status: IN / OUT                     |
| OUT since... (if OUT)                        |
------------------------------------------------
| [ Check IN ] (Yellow) — visible ONLY if OUT  |
------------------------------------------------
| Footer: EaglePass v2 branding                |
------------------------------------------------
Wireframe Reference:
The original wireframe image has been removed from the repository to avoid
tracking binary files.

2️⃣ UI Elements and Actions
➤ Student Info Box (Always Visible)
FieldSource
NameStudent Data table
GradeStudent Data table (fallback "N/A")
Student IDStudent Data table or TEMP-ID

Light gray background (#f1f1f1) or equivalent
Sticky or always in top content area
TEMP-ID must be clearly marked: "TEMP-ID: TEMP-12345"

➤ RESTROOM PASS (Primary Button)
Label: "RESTROOM PASS"
Action: Creates RESTROOM OUT pass
Color: Red (SPEC "Stop / Special")
Always visible, first button

➤ Select Destination (Dropdown)
Label: "Select Destination"
Populated with allowed destinations from Locations table
Required before Request OUT Pass button can be used
Dropdown must lock during Emergency / Pending state

➤ Request OUT Pass
Label: "Request OUT Pass"
Action: Creates General OUT pass → to selected Destination
Disabled until destination selected
Color: Green (SPEC "Go")

➤ Current Status Display
Label: "Current Status:"
"IN" → Green background
"OUT" → Red background
If OUT → show "OUT since HH:MM AM/PM"

➤ Check IN (Conditional Button)
Student IN → button hidden
Student OUT → button shown, Yellow color
Disabled during Pending or Emergency state

3️⃣ Emergency Mode Display
Bright Red banner with text "EMERGENCY ACTIVE - Please remain IN PLACE"
Always visible if Emergency Mode is active
Sits above Student Info box
Locks all UI actions (buttons + dropdown)

4️⃣ Pending State UX
On button press:
- Button label → "Loading..."
- Button disables
- Other buttons and dropdown disable
- Spinner after 500ms optional
- Failure message: "Error: Could not complete action. Please try again."
Student Info remains visible during pending state

5️⃣ Style / Tone Guidance
Casual, inviting, student-first
No required popups
Color coding matches SPEC
State colors:
- IN: Green
- OUT: Red
- RESTROOM: Red
- Request OUT Pass: Green
- Check IN: Yellow
- Emergency: Bright Red Banner

6️⃣ Notes for Engineering
✅ RESTROOM button first
✅ Destination dropdown required for General OUT
✅ Request OUT disabled until destination selected
✅ Check IN only visible if OUT
✅ Student Info always visible
✅ TEMP-ID must be labeled
✅ Emergency locks buttons + dropdown
✅ All actions debounce and lock in pending state
✅ Emergency Mode persists across UI reload

UI Edge Cases
- Emergency activates while OUT → banner shows, UI locks
- Emergency deactivates → UI unlocks
- TEMP-ID clearly labeled
- Period change handled by backend

GAS Latency
- Expect 300ms-1s latency
- Pending state after 500ms
- No duplicate clicks allowed

Responsive
- Designed for phones first → min width 320px
- Scales to 600px → center on larger screens
- Buttons full width, big touch targets

7️⃣ Out of Scope
🚫 Teacher / Support / Admin Panels
🚫 Role permissions logic
🚫 TEMP-ID flow (beyond display)

Final Summary
✅ Dropdown for Destination
✅ RESTROOM first
✅ Check IN conditional
✅ Student Info always visible
✅ Emergency Banner correct behavior
✅ Pending State correct behavior
✅ Fully aligned with SPEC_v2.md

