UI_DESIGN_PHASE2_STUDENT_PANEL.md
Version: SPEC_v2.md v2.0 — Updated for PR-002 — June 2025

Overview
This document defines the final design intent for the Student Panel UI in EaglePass v2.
It is the source of truth for engineering implementation (PR-002) and review.

Per SPEC → Student Panel is optimized for mobile-first (phones used in hallways).
Tone: casual, inviting, simple — must truthfully display current pass state.

1️⃣ Visual Layout and Flow
📱 Mobile-First Layout
markdown
Copy
Edit
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
✅ PNG included:
👉 /docs/wireframe_student_panel_v2.png (versioned with this MD)

2️⃣ UI Elements and Actions
➤ Student Info Box (Always Visible)
Field	Source
Name	Student Data table
Grade	Student Data table (fallback "N/A")
Student ID	Student Data table or TEMP-ID

Always visible at top of panel

Light gray background (#f1f1f1) or equivalent

Sticky or always in top content area

TEMP-ID must be clearly marked: "TEMP-ID: TEMP-12345"

➤ RESTROOM PASS (Primary Button)
Label: "RESTROOM PASS"

Action:

Creates RESTROOM OUT pass

OUT-only per SPEC

Color: Red (SPEC "Stop / Special")

Always visible, first button

➤ Select Destination (Dropdown)
Label: "Select Destination"

Populated with allowed destinations from Locations table

Required before Request OUT Pass button can be used

Dropdown must lock during Emergency / Pending state

➤ Request OUT Pass
Label: "Request OUT Pass"

Action:

Creates General OUT pass → to selected Destination

Disabled until destination selected

Color: Green (SPEC "Go")

➤ Current Status Display
Label: "Current Status:"

State:

"IN" → Green background

"OUT" → Red background

If OUT → show "OUT since HH:MM AM/PM"

➤ Check IN (Conditional Button)
State	Behavior
Student IN	Button hidden
Student OUT	Button shown → "Check IN" (Yellow)

Color: Yellow (SPEC "Caution")

Only visible when student is OUT → prevents false state

Disabled during Pending or Emergency state

3️⃣ Emergency Mode Display
Banner Behavior
Bright Red banner

Text: "EMERGENCY ACTIVE - Please remain IN PLACE"

Font: Bold, all-caps

Visibility:

Always visible if Emergency Mode is active

Sits above Student Info box

Does not hide Student Info

Locks all UI actions:

Buttons disabled

Dropdown disabled

4️⃣ Pending State UX
GAS Latency Handling
On button press:

Button label → "Loading..."

Button disables

Other buttons and dropdown disable

If latency > 500ms → spinner optional

If GAS call fails → show error message:

"Error: Could not complete action. Please try again."

Student Info remains visible during pending state

5️⃣ Style / Tone Guidance
Tone
Casual, inviting, student-first

No required popups

Friendly labels

Color coding matches SPEC

Color Coding
State	Color
IN	Green
OUT	Red
RESTROOM	Red
Request OUT Pass	Green
Check IN	Yellow
Emergency	Bright Red Banner

6️⃣ Notes for Engineering
Required:
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
✅ If Emergency activates while OUT → banner shows, UI locks, Student Info remains visible
✅ If Emergency deactivates → UI unlocks, Student Info does not change
✅ If TEMP-ID → "TEMP-ID" clearly labeled
✅ Period change handling per backend (no UI auto-close logic)

GAS Latency
✅ Expect 300ms-1s latency
✅ Pending state shown after 500ms
✅ No duplicate clicks allowed

Responsive
✅ Designed for phones first → min width 320px
✅ Should scale to 600px → center on larger screens
✅ Buttons: full width, big touch targets

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

Version Reference
SPEC_v2.md v2.0 (June 2025)

This doc → referenced in PR-002

Save as: /docs/UI_DESIGN_PHASE2_STUDENT_PANEL.md

Wireframe → /docs/wireframe_student_panel_v2.png