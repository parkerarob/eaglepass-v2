# EaglePass v2 — Migration Plan

This document explains the transition from prior versions of EaglePass to the new **EaglePass v2** architecture as defined in [`SPEC_v2.md`](./SPEC_v2.md).

---

## Why v2?

The original EaglePass prototype and early versions provided a valuable testbed — but encountered limitations in:

- Data model flexibility (hard to audit edge cases)
- Emergency Mode behavior (local-only state)
- UI responsiveness under Google Apps Script (GAS) limitations
- Safe handling of period changes, multi-leg passes, TEMP-ID cases
- Notification model (required notifications caused false state risk)

To address these, v2 introduces a **ground-up re-architecture** focused on:

✅ **Truthful state tracking** (Pass Log is canonical)  
✅ **Global Emergency Mode** (persisted + visible across UI)  
✅ **Edge case-safe flows**  
✅ **UI-first, notifications optional**  
✅ **Clean, auditable, maintainable codebase**  

---

## What is changing?

| Area                    | Prior Versions     | EaglePass v2 |
|-------------------------|--------------------|--------------|
| Data model              | Mixed (Active-only) | Canonical Pass Log + derived Active Passes |
| Emergency Mode          | Local-only hacks   | Global state + persisted across UI reload |
| Notifications           | Required in some flows | All optional, user-controlled |
| RESTROOM & Period Handling | Inconsistent      | Correct handling per SPEC |
| Scheduled Passes        | Limited            | Pre-authorized, auto-activating |
| Unknown students        | Not supported      | TEMP-ID flow supported |
| Roles & permissions     | Teacher/Admin only | Full role model: Teacher, Support, Admin, Dev |
| Architecture clarity    | Mixed              | Clean MVP → clear Phase 1.5 roadmap |

---

## What is preserved?

- Core **Google Workspace platform**  
- **Google Apps Script** as backend engine  
- Web App UIs (GAS + HTML/CSS/JS)  
- Role-based user experience  
- Audit-first design philosophy  

---

## Migration Path

1️⃣ **New data model** → Clean Google Sheet implementation per `SPEC_v2.md`  
2️⃣ **New backend** → Implement Apps Script APIs per v2 architecture  
3️⃣ **New UIs** → Implement Student / Teacher / Support / Admin Panels  
4️⃣ **Testing** → Full QA pass per v2 Test Plan  
5️⃣ **Deployment** → v2 deployed in parallel or as replacement  

---

## Backward compatibility

- Prior data is **not auto-imported** — v2 assumes fresh data model.
- Historical data can be reviewed/exported from prior system as needed — but will not be migrated into v2’s Pass Log.

---

## Key Migration Principle

**Do not mix v1 and v2 behaviors.**  
→ v2 must fully align with `SPEC_v2.md` — all flows must match new truth-first architecture.

---

## Migration Owner

This plan is owned by **Docs Architect GPT** (per `DOCS_ARCHITECT_GPT.md`) — in collaboration with the core dev team.

---

Migration plan will be updated as build progresses.
