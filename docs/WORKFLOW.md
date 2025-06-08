# EaglePass v2 — PR-Centered Delivery Workflow

_This is the official delivery workflow for EaglePass v2._  
_Center of process = Pull Request (PR)._  
_This document defines who does what, in what order, and when._

---

## Roles

| Role | GPT / Human |
|------|-------------|
| CEO | Rob (Human) |
| CEO Assistant | CEO Assistant GPT |
| Prompt Writer | Prompt Writer GPT |
| Lead Engineer | Codex |
| Code Reviewer | Code Reviewer GPT |
| Security | Security GPT |
| Docs Architect | Docs Architect GPT |
| QA Tester | QA Tester GPT |
| Codex Writer | Codex (on-demand) |
| UI/UX Designer | UI/UX Designer GPT |

---

## Core Flow (per PR)

### [ STEP 0 ] — Task Definition

1️⃣ CEO defines desired task / next milestone.  
2️⃣ CEO Assistant GPT + Prompt Writer GPT produce **finalized task prompt**.  
3️⃣ CEO sends finalized prompt to **Lead Engineer GPT**.

---

### [ STEP 1 ] — Lead Engineer → PR Creation

4️⃣ Lead Engineer GPT works → opens PR → **PR number is tracked** (`PR-XXX`).  
5️⃣ CEO creates `PR_REVIEW.md` for this PR: includes:
    - Prompt used
    - Lead Engineer notes
    - PR diff summary

---

### [ STEP 2 ] — Code Review Loop

6️⃣ CEO sends `PR_REVIEW.md` to **Code Reviewer GPT**.  
7️⃣ Code Reviewer GPT reviews → Approve / Changes Requested.  
8️⃣ If changes → CEO sends back to Lead Engineer → cycle continues until approved.

---

### [ STEP 3 ] — Security Review

9️⃣ After Code Reviewer approves → CEO sends `PR_REVIEW.md` + PR diff to **Security GPT**.  
10️⃣ Security GPT reviews → produces `SECURITY_REVIEW_NOTES_PHASEX.md`.  
11️⃣ If issues → back to Lead Engineer → cycle until Security GPT approves.

---

### [ STEP 4 ] — Merge

12️⃣ After Security GPT approves → CEO merges PR to `main`.  
13️⃣ CEO saves `SECURITY_REVIEW_NOTES_PHASEX.md` to Project → promotes to `/docs/` as approved.

---

### [ STEP 5 ] — Documentation

14️⃣ CEO sends merged PR info + `SECURITY_REVIEW_NOTES_PHASEX.md` + `PR_REVIEW.md` to **Docs Architect GPT**.  
15️⃣ Docs Architect GPT updates:
    - `/docs/SECURITY_REVIEW_NOTES.md` (cumulative)
    - `/docs/migration_plan_v2.md` (progress update)
    - `/docs/CHANGELOG.md` (optional)

---

### [ STEP 6 ] — QA

16️⃣ Once feature/API is merged → QA Tester GPT writes tests against `main`.  
17️⃣ QA GPT runs tests → bugs (if found) → new PR cycle.  
18️⃣ If all pass → phase complete → ready for next phase.

---

### Parallel Flows

✅ **Prompt Writer GPT** → involved **before each PR** → defines task prompts.  
✅ **UI/UX Designer GPT** → feeds designs to Lead Engineer → referenced in PRs.

---

### Notes

- **Each PR is numbered and tracked**.  
- **PR_REVIEW.md is required for each PR** → ensures full audit trail.  
- **Security review is MANDATORY before merge.**  
- **QA happens AFTER merge to main — testing actual production branch.**  

---

# Final Notes

This workflow is designed to:
✅ Produce auditable, testable, secure PRs.  
✅ Keep CEO fully in control.  
✅ Keep documentation aligned with what is actually merged.  
✅ Scale cleanly across phases.

---

# End of PR-Centered Workflow
