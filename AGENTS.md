# EaglePass v2 — AGENTS.md

## Repo Overview

This repo implements **EaglePass v2** — a Google Workspace hall pass accountability system.

Reference spec: [`SPEC_v2.md`](./SPEC_v2.md)  
Migration plan: [`migration_plan_v2.md`](./migration_plan_v2.md)

---

## Current Phase

🚀 Currently implementing **Phase 1**: core backend modules.

✅ Scaffold and CI are complete.  
✅ Node-first architecture — plain Node modules with unit tests.  
✅ GAS bindings and UI will come in later phases.

---

## Folder Conventions

- `src/` — All core logic modules.
    - Example: `src/api/passLog.js`, `src/api/activePass.js`, etc.
- `tests/` — All Jest unit tests.
    - Example: `tests/passLog.test.js`, etc.
- `docs/` — Project docs (spec, logs, migration notes).

---

## How to validate changes

- **Run ESLint**:
    ```bash
    npm run lint
    ```

- **Run tests**:
    ```bash
    npm test
    ```

---

## How agent should work

- Implement **clean Node modules** in `src/`
- Write **unit tests** in `tests/`
- Target current branch (Phase 1 → `phase-1/backend-api`)
- Follow SPEC for behavior and edge cases
- For now, **do NOT build UI or GAS wrappers** — those are later phases

---

## PR instructions

PR title format:

```text
[Phase 1] Implement core backend modules for Pass Log, Active Passes, Permanent Record, Emergency Mode, Settings
```

---

## Notes for Codex agent
- Keep Phase 1 PR backend-only — no UI.
- Use test-driven development
- Write unit tests for each new module.
- Log key actions where appropriate (per SPEC “backend logging from day 1”).
- For GAS bindings: STOP after backend modules — next PR will handle GAS wrapping.