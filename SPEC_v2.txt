= SPEC-1: Eagle Pass System (MVP)
:sectnums:
:toc:

== Background

The Eagle Pass System is a hall pass and accountability tool for students, teachers, and administrators. It is designed to operate within the Google Workspace environment, leveraging Google Sheets and Apps Script as the core platform. The system prioritizes truthful state tracking, flexible user control, and graceful handling of edge cases — while explicitly not serving as an attendance or emergency response system.

== Requirements

*Must Have*
- Students must be able to request and use hall passes.
- Teachers must be able to issue, manage, and monitor passes.
- Support staff must be able to manage passes for their areas.
- Admin must be able to oversee all passes and Scheduled Passes.
- Emergency Mode must allow staff to force IN students.
- All pass state transitions must be truthful and auditable.
- System must handle edge cases safely (period change, emergency, offline).
- Notifications must be user-configurable and never required.
- Data model must support long-term reporting and audit.

*Should Have*
- Scheduled Passes should proactively notify affected parties.
- LD flags should alert staff/admin.
- Found Without Pass should notify admin.
- Teachers should have access to student pass history via UI.
- Pass Lifecycle must fully support RESTROOM and period-spanning locations.

*Could Have*
- Per-user notification preference UI.
- Guidance as distinct role.
- SIS integration (future).

== Method

=== Architecture Overview

* Platform: Google Workspace → Google Sheets + Apps Script
* Auth: Google Workspace SSO
* Data Storage: Google Sheets (raw), UI-based reporting
* System state: Truth-first, responsive UI

=== Data Model

==== Core Tables

- Student Data
- Staff Data (Teachers, Support, Admin)
- Pass Log
- Active Passes
- Permanent Record
- Locations
- Bell Schedule
- System Settings

==== Core Fields (Pass Log)

- `passId`
- `legId`
- `studentId`
- `scheduledStaffId`
- `originStaffId`
- `currentStaffId`
- `closedByStaffId` (nullable)
- `state` (OPEN/CLOSED)
- `status` (OUT/IN)
- `destId`
- `flag`
- `notes`
- `timestamp`

==== Locations

- `allowPeriodSpan` (boolean) — TRUE if location spans periods

=== Core Flows

==== Pass Lifecycle

- OUT → IN → multi-leg supported
- RESTROOM → OUT-only → must return to origin
- Period change → auto-close unless allowPeriodSpan = TRUE
- Scheduled Pass → pre-authorized → activates automatically (not tied to IN)
- Emergency Mode → global flag → Emergency Panel → force IN allowed
- Unknown students → TEMP-ID → flagged for later cleanup

==== Edge Case Handling

- Double-click prevention (debounce + button disable)
- GAS pending state with user feedback
- Emergency Mode persists across UI reload
- RESTROOM during period change → auto-close
- Scheduled Pass overlap → handled correctly via period transitions
- Emergency ends → current state preserved
- Unknown students → TEMP-ID flow

=== Notifications & Feedback

==== Philosophy

- UI-first — transitions, dashboards = primary feedback
- No required notifications — all user-controllable
- Routine events (pass created, checked IN, auto-close, Emergency Mode) → OFF by default
- Attention events (Admin force close, Emergency forced IN, Found Without Pass, LD flags) → ON by default
- Scheduled Pass creation → proactive email → ON by default
- Per-user settings control notification preferences
- No system action may create false state

=== Roles & Permissions

- **Teacher** — Manage own class passes, view any student history via UI
- **Support** — Manage passes for assigned spaces
- **Admin** — Full access (except raw data Sheets), Emergency Mode control, Scheduled Pass management
- **Dev** — Full system control, raw Sheets access, system patching
- **Guidance Role** → Phase 1.5 Roadmap

=== Emergency Mode

- Global state → visible on all UIs
- Allows staff to force IN students
- Pass remains OPEN or transitions appropriately
- Emergency Mode events flagged in Pass Log
- Emergency Mode is not an emergency response system

== Implementation

1. Build data model in Google Sheets.
2. Implement core Apps Script backend for Pass Log, Active Passes, Permanent Record.
3. Implement Student UI Panel.
4. Implement Teacher/Support Panel.
5. Implement Admin Panel + Emergency Panel.
6. Implement UI pending state / GAS handling.
7. Implement double-click debounce.
8. Implement Period Override behavior.
9. Implement Notifications engine with per-user settings.
10. Implement Found Without Pass and LD flag handling.
11. Implement Emergency Mode flow.
12. Conduct QA for edge cases and failure modes.

== Milestones

1. Data model implementation — 1 week
2. Core pass lifecycle (basic UI) — 2 weeks
3. Emergency Mode flow — 1 week
4. Notifications framework — 1 week
5. Full role-based permissions — 1 week
6. MVP QA pass — 1 week
7. MVP deploy for pilot — 1 week

== Gathering Results

- Audit Log review — system truthfulness validated
- UI behavior — responsiveness validated
- Teacher/Admin satisfaction survey
- No known “impossible state” reports
- Performance benchmark under normal usage
- Post-pilot review for Phase 1.5 roadmap:

  - Guidance role
  - Emergency Mode trigger roles
  - SIS sync planning
  - Reporting permissions fine-tuning

---

///// ----- /////

---

= Eagle Pass - Developer Kickoff Brief
:toc:

== Overview

This brief summarizes the key technical decisions, architecture model, and implementation guidance for the Eagle Pass MVP build.

The goal is to produce a truthful, human-centered hall pass accountability system within Google Workspace (Google Sheets + Apps Script) that is robust, safe under edge cases, and fully auditable — while respecting user autonomy and school workflows.

== Platform

- Google Workspace (Google SSO)
- Google Sheets as data backend
- Google Apps Script (GAS) as backend logic
- Web Apps (GAS UI + HTML/CSS) for user interfaces

== Data Model Notes

- See SPEC-1 for full data model
- **Pass Log** is canonical — all pass state is logged here
- **Active Passes** = current live state — derived from Pass Log
- **Permanent Record** = archive of closed passes — mirrors Pass Log
- **Locations** include `allowPeriodSpan` flag — critical for guidance/nurse/admin spaces
- **TEMP-ID** flow is required for unknown students

== Key Architectural Principles

- **Truthfulness:** The system must not allow actions that create false state. Ex: Teacher cannot force-close a pass if student is IN somewhere else.
- **UI-First:** User experience flows through responsive UI, with notifications as supportive only.
- **Notifications:** All notifications are optional. Routine events default OFF. Attention events default ON. No required notifications.
- **Emergency Mode:** Global state. Emergency Panel must reflect it. Emergency Mode state persists across UI reload.
- **Debounce required:** All user actions must be debounced to prevent double submissions.

== Initial Development Priorities

1. Implement canonical data model in Google Sheets:
    - Pass Log
    - Active Passes
    - Permanent Record
    - Locations
    - Settings
2. Implement base Apps Script backend:
    - Pass Lifecycle (OUT → IN → CLOSE)
    - Period change handling
    - Emergency Mode global state
    - Debounce
3. Build base Student Panel
4. Build base Teacher Panel
5. Build base Admin Panel (including Emergency Panel)
6. Implement notification framework (initially config-driven)
7. Implement reporting UI
8. Implement edge case handling
9. Implement QA test plan

== Critical "Watch Out" Areas

- **Period transitions:** `allowPeriodSpan` must be honored. Pass should not auto-close if IN location has this flag TRUE.
- **RESTROOM flow:** OUT-only, must return to origin.
- **Scheduled Pass activation:** Must activate even if student not checked into period.
- **Emergency Mode:** Must be global state — no local-only behavior.
- **Unknown students:** TEMP-ID handling must be implemented.
- **GAS latency:** UI must reflect pending state — avoid user confusion.

== Non-MVP Areas (Phase 1.5 / Roadmap)

- SIS sync (future)
- Groups and group-based passes
- Guidance role (distinct from Support)
- Emergency Mode trigger permissions
- Advanced reporting permissions
- Finer-grained UI/UX polish
- Full mobile optimization

== Team Guidance

- Stick to **simple, truthful flows** — avoid trying to “outsmart” reality.
- Always **prioritize system stability and auditability** over “clever” UX.
- Follow the SPEC-1 document — if something is unclear, raise it to architect (project owner).

== Final Notes

The architecture is solid and ready for implementation. All key flows are safe, auditable, and match real-world school behavior. Focus on building clean, maintainable code that respects these principles.

---

/////-----/////

---

= Eagle Pass - Phase 1.5 Roadmap

== Overview

This roadmap defines future improvements and known areas of potential enhancement for Eagle Pass, post-MVP. These items are intentionally out of MVP scope and will be revisited after the MVP is piloted and evaluated.

== Roadmap Categories

=== Must Evaluate after MVP

- **Guidance Role**:
    - Distinct role from Support
    - Needs broader student visibility
    - Higher-level pass authority in some cases
- **Emergency Mode trigger permissions**:
    - Define explicit role(s) allowed to activate Emergency Mode
    - Currently assumes trusted Admin role — needs policy definition
- **Groups and group-based passes**:
    - Define groupings of students
    - Allow batch pass creation for groups (ex: athletics, clubs, field trips)

=== Should Implement after MVP

- **SIS sync**:
    - Initial target: Infinite Campus
    - Goal: sync core Student Data and Schedule automatically
    - Initially manual import remains acceptable

- **Advanced Reporting Permissions**:
    - More granular control over who can see which reports
    - Example: Support sees only their area, not school-wide by default

- **Per-user Notification Settings UI**:
    - Full UI for staff to configure their notification preferences
    - Currently implied — needs user-friendly controls

=== Could Implement after MVP (nice to have)

- **UI/UX Polish**:
    - More visual polish to dashboards
    - Refined Emergency Panel UI

- **Full mobile optimization**:
    - MVP assumes desktop-first
    - Future: fully optimized mobile UIs

- **Audit report exports**:
    - One-click export of Permanent Record audit reports
    - Useful for discipline cases or compliance reporting

=== Experimental / R&D Ideas

- **Behavior trend analytics**:
    - Identify patterns of excessive hall usage
    - Dashboards for admin insight
- **Real-time “who is OUT” view**:
    - Live board of all OUT students
    - Potential emergency use case

== Risk Notes

- SIS sync will introduce **significant complexity** — must not be rushed
- Emergency Mode permissions need **clear school policy** — avoid accidental triggers
- Group-based passes introduce **potential scheduling conflicts** — needs careful design

== Final Notes

The MVP spec is intentionally clean and safe. These Phase 1.5 items should be carefully prioritized AFTER the MVP has been deployed and feedback gathered from real users.

---

/////-----/////

---

= Eagle Pass - Test Plan / QA Plan (MVP)

== Overview

This plan defines the key test cases and quality checks required for the Eagle Pass MVP. The goal is to validate that the system operates truthfully, safely, and consistently — even under edge cases — before first production deployment.

== Test Philosophy

- **Truth-first:** No action should create false state.
- **Safety-first:** Edge cases should not break system or cause user confusion.
- **Responsiveness:** UI should reflect system state clearly and promptly.
- **Auditability:** All actions should be traceable in Pass Log.

== Testing Scope

=== In Scope for MVP

- Pass Lifecycle (OUT → IN → CLOSE → multi-leg)
- RESTROOM handling
- Emergency Mode flow
- Period change handling
- Period Span (allowPeriodSpan) handling
- Scheduled Pass behavior
- Unknown student handling
- Long Duration flags
- Found Without Pass handling
- Notifications (ON/OFF defaults)
- Double-action prevention (debounce)
- GAS pending state UI feedback
- Role-based permissions (Teacher, Support, Admin, Dev)

=== Out of Scope for MVP

- SIS sync
- Group-based passes
- Advanced Reporting Permissions
- Full mobile optimization
- Guidance Role (Phase 1.5)

== Core Test Cases

=== Pass Lifecycle

- [ ] Student creates normal pass → OUT → IN → CLOSE
- [ ] Student performs multi-leg pass (OUT → IN → OUT → IN → CLOSE)
- [ ] RESTROOM pass → OUT-only → must return to origin

=== Emergency Mode

- [ ] Emergency Mode activation → Emergency Panel appears
- [ ] Emergency Mode persists across UI refresh
- [ ] Teacher forces IN student → state correct, audit correct
- [ ] Emergency Mode deactivation → state correct

=== Period Change

- [ ] Normal pass OUT → period change → pass auto-closes
- [ ] RESTROOM pass → period change → pass auto-closes
- [ ] allowPeriodSpan = TRUE → IN pass spans period → no auto-close

=== Scheduled Passes

- [ ] Scheduled Pass activates automatically (even if student not IN)
- [ ] Scheduled Pass notification sent (ON by default)
- [ ] Scheduled Pass coexists correctly with period change

=== Unknown Student

- [ ] Student not in Student Data → TEMP-ID assigned → flagged correctly
- [ ] TEMP-ID flow does not break system

=== Long Duration Flags

- [ ] Student OUT for 10 min → LD flag triggers → correct notifications
- [ ] Student OUT for 20 min → admin notified → correct audit

=== Found Without Pass

- [ ] Found Without Pass entry → admin notified → correct audit

=== Notifications

- [ ] Routine event notifications default OFF
- [ ] Attention event notifications default ON
- [ ] User can toggle notifications

=== Double-action Prevention

- [ ] Create pass button → debounce works → no duplicate pass
- [ ] Check IN button → debounce works → no duplicate IN

=== UI Pending State

- [ ] GAS lag → UI shows pending state
- [ ] GAS failure → user sees clear error message

=== Roles & Permissions

- [ ] Teacher can manage own passes
- [ ] Support can manage assigned spaces
- [ ] Admin can manage all passes
- [ ] Teacher cannot force-close pass if student IN elsewhere
- [ ] Unknown users blocked appropriately

== Acceptance Criteria

MVP is acceptable for pilot if:

- All critical flows pass
- All attention events correctly notify and log
- No known broken edge cases
- No impossible state created
- No “frozen” UI under failure conditions
- Initial users (teachers/admin) confirm intuitive operation

== Final Notes

- Testing priority is on **truthful behavior** and **system stability**.
- Usability polish is welcome but not required for MVP.
- Known Phase 1.5 items remain out of scope.

---

/////-----/////

---

= Eagle Pass - UI / UX Guidelines (MVP)

== Purpose

These guidelines define the intended user experience and visual style for Eagle Pass, so that developers and designers can implement a UI that is consistent with project philosophy and real-world school usage.

== Overall Tone and Philosophy

- **Student UI**: Casual, inviting, simple — should feel familiar and app-like.
- **Teacher UI**: Helpful, readable, unobtrusive — should support classroom flow without being a burden.
- **Admin UI**: Clear, attention-directed — quick status checks.

== Core UX Principles

- **UI is primary feedback** — not notifications.
- **Clarity over cleverness** — users should not have to guess.
- **Color coding to guide attention**:
    - **Green** = Checked IN / OK
    - **Yellow** = OUT / Moving / Normal pass in progress
    - **Red** = Attention needed (LD flag, Emergency OUT, problem states)
- **No required popups** — use banners, inline messages, transitions.
- **No hunting** — UI must draw attention to what matters.

== Primary User Interfaces

=== Student Panel

- Large, simple buttons — **mobile-first** design.
- Should feel like a phone app — 90%+ of students will use phones.
- Minimal screens — one-action-per-screen where possible.
- RESTROOM clearly marked as OUT-only.
- Immediate transitions on action.
- Pending state shown clearly if system is slow.

=== Teacher / Support Panel

- **Readable, monitor-friendly** layout.
- **Big text for names** — easily visible from across room.
- Green/Yellow/Red indicators drive attention.
- Current OUT list always visible.
- Simple controls — OUT / IN / history / force close (where allowed).
- Hybrid refresh:
    - Manual refresh button (must exist).
    - Auto-refresh every **3–5 minutes** (not faster).
    - Prevent spammable refresh clicks.

=== Admin Panel

- School-wide view.
- Same Green/Yellow/Red principles.
- Emergency Panel must be **visually loud** — red banner, prominent Emergency UI.
- Found Without Pass must be clearly visible.
- Reporting tools and Scheduled Pass tools.
- Hybrid refresh (same as Teacher Panel).

== Emergency Mode UI

- **Visually loud** — red banner across top of all UIs.
- Emergency Panel clearly visible.
- OUT students must be easily clickable.
- Emphasis on **function over styling** — must work in stress conditions.

== Special Visual Elements

- **Scheduled Passes** → distinct styling (ex: blue background / icon).
- **Unknown Students (TEMP-ID)** → flagged clearly, neutral tone.
- **LD Flags**:
    - 10-min flag → yellow, “nudge” tone.
    - 20-min flag → red, “attention required” tone — not disciplinary wording.

== Accessibility

- Must be **mobile-first** for Student UI.
- Teacher/Admin panels monitor-friendly.
- Color-blind safe (color + icon or text).
- Keyboard accessible where possible.

== Performance Expectations

- UI transitions should be sub-1s where possible.
- Pending state shown if GAS takes >500ms.
- No “frozen” UIs.

== Final Notes

Eagle Pass is intended to be a **trusted, useful, human-centered tool** — not a surveillance or punishment system.  
The UI should reflect this:  
- Inviting and clear for students.  
- Helpful and supportive for teachers.  
- Efficient and attention-directed for admins.

---

/////-----/////

---

= Eagle Pass - Risk Register (MVP)

== Purpose

This document identifies known risks in the Eagle Pass project, along with likelihood, impact, and mitigation strategies. The goal is to ensure transparency and proactive management of concerns.

== Risk Assessment Key

- **Likelihood**:
    - Low
    - Medium
    - High
- **Impact**:
    - Low
    - Medium
    - High

== Risks

=== 1️⃣ Google Apps Script performance variability

- **Description**: GAS latency can vary due to platform limitations.
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**:
    - Implement pending state in UI.
    - Debounce all user actions.
    - Use streamlined GAS code for critical paths.

=== 2️⃣ SIS sync complexity (future)

- **Description**: Integrating with Infinite Campus will introduce significant complexity.
- **Likelihood**: High
- **Impact**: High (when pursued)
- **Mitigation**:
    - Defer SIS sync to Phase 1.5.
    - Maintain simple, well-documented manual import for MVP.
    - Evaluate Infinite Campus API thoroughly before committing.

=== 3️⃣ Emergency Mode trigger authority

- **Description**: Unclear who is allowed to trigger Emergency Mode could cause confusion.
- **Likelihood**: Medium
- **Impact**: High (if triggered incorrectly)
- **Mitigation**:
    - Define Emergency Mode trigger role/policy in Phase 1.5.
    - Implement permission checks in UI.

=== 4️⃣ Notification fatigue

- **Description**: Users may get overwhelmed if too many notifications are enabled.
- **Likelihood**: Medium
- **Impact**: Medium
- **Mitigation**:
    - Default notification philosophy already tuned (routine = OFF, attention = ON).
    - Provide per-user notification settings UI.
    - Provide clear guidance to users.

=== 5️⃣ Data integrity (TEMP-ID cleanup)

- **Description**: TEMP-ID entries could persist if not cleaned up.
- **Likelihood**: Low
- **Impact**: Low to Medium
- **Mitigation**:
    - TEMP-ID entries are flagged.
    - Provide Admin tools to review and resolve TEMP-ID entries.

=== 6️⃣ User device diversity

- **Description**: Students and staff will use a wide variety of devices.
- **Likelihood**: High
- **Impact**: Medium
- **Mitigation**:
    - Follow defined device bias model (Student = mobile-first, Teacher/Support = desktop-first, Admin = mobile-first).
    - Implement responsive UIs.

=== 7️⃣ User training / adoption

- **Description**: Some users may resist new system or use it inconsistently.
- **Likelihood**: Medium
- **Impact**: Medium to High (for data quality)
- **Mitigation**:
    - Provide clear training materials.
    - Use intuitive UI design.
    - Emphasize “truth-first” principle — system tells the real story.

== Final Notes

Overall risk posture for MVP is **Low to Medium**:  
- MVP is intentionally simple and well-scoped.
- Critical risks (SIS sync, Emergency Mode) are deferred to Phase 1.5.
- No known showstopper risks for initial pilot.

---

/////-----/////

---

graph TD

%% Phase 1: Foundation
A1[Define Google Sheet schemas] --> B1[Implement Pass Log API]
A1 --> B2[Implement Active Pass API]
A1 --> B3[Implement Permanent Record archiving]
A1 --> B4[Implement Emergency Mode state mgmt]
A1 --> B5[Implement System Settings mgmt]

%% Phase 2: Core UI (dependent on backend)
B1 --> C1[Build Student Panel UI]
B1 --> B2 --> C2[Build Teacher Panel UI]
B1 --> B2 --> C3[Build Support Panel UI (based on Teacher UI)]
B1 --> B2 --> B4 --> C4[Build Admin Panel UI + Emergency Panel]

%% Phase 3: Features / Flows
B1 --> D1[Implement Notification Engine]
B1 --> D2[Implement LD flag checks]
B1 --> D3[Implement Found Without Pass flow]
B1 --> D4[Implement Scheduled Pass activation]

%% Phase 4: Edge Case / Final Polish
B1 --> E1[Implement TEMP-ID handling & cleanup tools]
B1 --> E2[Implement Force Close with truth-check]
B4 --> E3[Verify Emergency Mode global state persistence]
B5 --> E4[Implement Per-user Notification Settings UI]

---

# Eagle Pass - Master Build Plan (AI-first Delivery)

## Overview

This Master Build Plan defines a staged, AI-accelerated delivery process for the Eagle Pass system.  
It is designed to support **parallelized builds**, with **clear human vs AI roles**, and **test-first / logging-first** architecture.  

The architecture has been fully reviewed and locked. This plan is ready for implementation.

---

# Phase 1 - Foundation

## What happens

- Set up core Google Sheets (system "database")
- Implement core backend APIs:
    - Pass Log API
    - Active Pass API
    - Permanent Record archiving
    - Emergency Mode state management
    - System Settings management

## What AI does

- Script to **create and format Sheets**
- Script to **clean imported data** (case, trim, sanitize)
- Implement all backend APIs in Apps Script
- Implement global Emergency Mode state
- Implement System Settings management
- Build basic **Test Harness Sheet** with example test cases
- Implement **backend logging** from day 1

## What YOU do

- Approve final Sheet schema
- Provide sample Student Data & Staff Data files
- Approve API contract
- Observe test runs, verify expected behavior

## Test Harness & Logging

- Basic Test Harness Sheet created
- All API calls logged
- All errors/edge cases logged
- AI to write example test cases (verify pass creation, status update, close, etc.)

---

# Phase 2 - Core UI Panels

## What happens

- Build user-facing panels:
    - Student Panel (mobile-first)
    - Teacher Panel (desktop-first)
    - Support Panel (desktop-first)
    - Admin Panel + Emergency Panel (mobile-first)

## What AI does

- Build Web App pages (HTML/CSS/JS)
- Connect UIs to backend APIs
- Implement:
    - Emergency Mode banner
    - Green/Yellow/Red indicators
    - Scheduled Pass indicators
    - Refresh behavior (manual + 3–5 min auto-refresh)

## What YOU do

- Review UI early and often
- Confirm button/alert wording
- Confirm colors/icons
- Test mobile (Student & Admin Panels)
- Approve UI for each role

## Test Harness & Logging

- Continue from Phase 1
- Add UI interaction tests (basic button flow tests)
- Ensure UI actions trigger correct API calls and logging

---

# Phase 3 - Features / Flows

## What happens

- Add intelligent behaviors:
    - Notification Engine
    - Long Duration (LD) flags
    - Found Without Pass flow
    - Scheduled Pass activation

## What AI does

- Implement Notification Engine
- Implement LD flag timers & triggers
- Implement Found Without Pass flow
- Implement Scheduled Pass activation flow
- Add logging for all feature events
- Add test cases for all feature flows

## What YOU do

- Define notification wording
- Confirm ON/OFF defaults
- Test:
    - LD flag behavior
    - Found Without Pass behavior
    - Scheduled Pass activation
- Review feature logs

## Test Harness & Logging

- Add test cases for all triggers
- Log all LD flag events, Found Without Pass, Scheduled Pass activations

---

# Phase 4 - Edge Case & Final Polish

## What happens

- Handle rare but critical cases:
    - TEMP-ID handling & cleanup tools
    - Force Close with truth-check
    - Verify Emergency Mode global state
    - Per-user Notification Settings UI

## What AI does

- Implement TEMP-ID logic + Admin cleanup tools
- Implement Force Close logic with truth-check
- Verify Emergency Mode state persistence across UIs
- Build Per-user Notification Settings UI
- Add logging for all edge cases
- Add test cases for all edge cases

## What YOU do

- Periodically review TEMP-ID cleanup
- Test Force Close behavior
- Simulate/test Emergency Mode
- Approve Per-user Notification Settings UI
- Review test logs for all edge cases

## Test Harness & Logging

- Add test cases for:
    - TEMP-ID flow
    - Force Close allowed/blocked scenarios
    - Emergency Mode state persistence
    - Notification settings changes
- Log all relevant actions and edge events

---

# Final Notes

This build plan is designed for **parallel AI+human execution**:

- Backend & UI can proceed in parallel after Phase 1
- Features & Flows can proceed in parallel after Phase 2
- Test-first and logging-first ensures stable build
- Human leadership focus is clear for each phase
- Process is repeatable and can be templatized for future systems

---

