# EaglePass v2 — Hall Pass and Accountability System (MVP)

**EaglePass v2** is a truthful, human-centered **hall pass and accountability system** for schools — built entirely within the **Google Workspace ecosystem**.

It is designed to operate safely under edge cases, reflect real-world student movements, and provide administrators and staff with accurate, auditable records — without functioning as an attendance or emergency response system.

---

## Project Goals

- Provide an accurate, auditable record of **student hall pass usage**.
- Support **teachers, support staff, and administrators** with clear UI.
- Prioritize **truthful state tracking** and **safe handling of edge cases**.
- Respect **user autonomy** — not a surveillance system.
- Be fully usable **within Google Workspace** — no third-party platforms required.

---

## Platform Architecture

- **Platform:** Google Workspace
- **Backend:** Google Sheets (data), Google Apps Script (logic)
- **Auth:** Google SSO (domain-based)
- **UI:** Google Apps Script Web Apps + HTML/CSS (role-based Panels)
- **Data Model:** 
    - Canonical source = **Pass Log**
    - Active state = **Active Passes**
    - Archive = **Permanent Record**

---

## Core Features (MVP Scope)

- **Student pass requests** — OUT → IN flow
- **Teacher / Support Panels** — manage passes, view history
- **Admin Panel** — school-wide visibility, Emergency Mode control
- **Emergency Mode** — global state allowing staff to force IN
- **Scheduled Passes** — pre-authorized, auto-activating
- **Pass Lifecycle** — multi-leg supported, RESTROOM-specific behavior
- **Edge Case Handling:** 
    - Period change
    - Emergency Mode persistence
    - Unknown students (TEMP-ID)
    - UI debounce / GAS pending states
- **Notifications:** UI-first, user-controlled
- **Audit Logging:** Pass Log is canonical, fully auditable

---

## Roles & Permissions

| Role    | Permissions |
|---------|-------------|
| Teacher | Manage own passes, view student history |
| Support | Manage passes for assigned spaces |
| Admin   | Full system access, Emergency Mode, Scheduled Passes |
| Dev     | System-level access, raw data management |

*(Guidance role planned for Phase 1.5)*

---

## What EaglePass v2 is **not**

- It is **not an attendance system**.
- It is **not an emergency response system**.
- It does **not rely on required notifications** — UI is primary feedback.

---

## Roadmap

- **Current:** MVP as defined in [`SPEC_v2.md`](./SPEC_v2.md)
- **Post-MVP:** See Phase 1.5 roadmap in SPEC
    - Guidance Role
    - Emergency Mode trigger roles
    - SIS sync (future)
    - Advanced reporting
    - UX polish
    - Full mobile optimization

---

## Status

🚧 In active development — follow [`CHANGELOG.md`](./CHANGELOG.md) for updates.

---

For architectural details and implementation guidance, see [`SPEC_v2.md`](./SPEC_v2.md).
