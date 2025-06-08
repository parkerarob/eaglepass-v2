# Threat Model — EaglePass v2

## 1️⃣ Overview

This document defines the **threat model** for the EaglePass v2 system as specified in [`SPEC_v2.md`](./SPEC_v2.md).

Goal: identify security risks in architecture, flows, and components — and define mitigations to maintain:

- **Data privacy**
- **Data integrity**
- **Role correctness**
- **System availability**
- **Auditability**

## 2️⃣ System Architecture Recap

**Platform**:

- Google Workspace SSO (authN)
- Google Sheets (data backend)
- Google Apps Script (GAS) — backend logic
- GAS Web App (HTML/CSS/JS) — UI

**Key Data**:

- Student Data
- Staff Data
- Pass Log (canonical)
- Active Passes (derived)
- Permanent Record
- Locations
- System Settings

**Roles**:

- Teacher
- Support
- Admin
- Dev

## 3️⃣ Threat Categories

### A. Data Privacy Risks

- **Unauthorized data access**
    - Risk: Access to student/staff data by wrong users
    - Vectors:
        - Misconfigured role checks
        - Broken auth flow
        - GAS app mis-published (wrong sharing settings)

- **Over-exposure via role misconfig**
    - Risk: Teacher viewing school-wide data without permission

- **Injection via UI input**
    - Risk: Malicious user inputs script/injection in Notes, TEMP-ID, etc.

---

### B. Data Integrity Risks

- **False state creation**
    - Ex: Teacher force-closes pass while student IN elsewhere

- **Injection attacks corrupting Pass Log**
    - Ex: Malicious notes field causing broken Pass Log rows

- **Improper TEMP-ID cleanup**
    - Risk: Orphan TEMP-IDs causing audit/report errors

---

### C. Availability Risks

- **GAS latency / degradation**
    - UX degraded → user confusion

- **Emergency Mode state loss**
    - Ex: Emergency Mode flag not persisting across UIs

- **Abuse of Emergency Mode triggers**
    - Unrestricted triggers in Phase 1

---

### D. Role/Permission Violations

- **Role escalation**
    - Ex: Teacher gaining Admin or Dev rights through bypass

- **Bypass of truth-check flows**
    - Ex: Force close without valid state → false state in system

---

### E. External Integrations

- **SIS sync** (future)
    - API credentials leakage
    - Insecure sync flows

- **Google API rate limits / abuse**
    - Potential GAS quota exhaustion

---

### F. Code Injection / Prompt Injection (Codex / AI agents)

- **GAS script injection**
    - Malicious code via dynamic GAS eval (if misused)

- **Prompt injection**
    - (Future risk if AI used in future Phase 1.5 features)

---

## 4️⃣ Risk Prioritization

| Threat                        | Likelihood | Impact | Mitigation |
|-------------------------------|------------|--------|------------|
| Unauthorized data access      | Low        | High   | SSO auth + role checks |
| Role escalation               | Low        | High   | Explicit permission checks |
| GAS latency                   | Medium     | Medium | UI pending state, debounce |
| Injection via UI              | Medium     | High   | Input validation, sanitize |
| Emergency Mode abuse          | Medium     | High   | Define role restrictions (Phase 1.5) |
| TEMP-ID persistence           | Low        | Medium | Admin cleanup tools |
| Pass Log corruption           | Low        | High   | Canonical Pass Log validation |
| SIS sync API leakage (future) | High (future) | High  | Secure key storage, vetted flows |
| Prompt injection (future)     | Low (future) | High  | No AI-based inputs in MVP |

---

## 5️⃣ Mitigations Summary

✅ GAS Web App access:

- **Published to domain only**
- **Enforce Google SSO**
- **Strict role checks per SPEC**

✅ GAS backend:

- Canonical Pass Log flow prevents false state
- No dynamic GAS eval
- Input sanitization on Notes, TEMP-ID, free-text fields
- Audit logging of all role-modifying actions

✅ UI:

- Debounce on all user actions
- Pending state shown on GAS latency
- No untrusted external content included

✅ Emergency Mode:

- Global state → persisted across UI
- Role restrictions to be finalized Phase 1.5

✅ TEMP-ID:

- Flagged clearly
- Admin tools for cleanup

✅ Future integrations:

- SIS sync not MVP — to follow separate reviewed security plan
- No AI-driven flows in MVP → mitigates prompt injection

---

## 6️⃣ Out of Scope for MVP

- SIS integration
- Group-based passes
- AI-driven behavior analysis
- External API integrations beyond Google Workspace

---

## 7️⃣ Final Notes

Current security posture for MVP:

- **Low to Medium risk**
- Architecture favors **truthfulness, auditability, explicit roles**
- Known high-risk areas (Emergency Mode permissions, SIS sync) deferred to Phase 1.5 with planned mitigations

---

## Security Review Commitments

- Security GPT will review:
    - All PRs touching GAS logic or UI affecting permissions
    - All PRs adding new roles/flows
    - All PRs adding integrations/API usage

- Special flags:
    - Any bypass of truth-check must be reviewed
    - Any role escalation mechanism must be reviewed
    - Any external API integration must be reviewed

---

✅ End of `Threat_Model_v2.md`
