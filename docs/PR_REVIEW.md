# Task: Implement Student Panel UI (PR-002)

Per SPEC_v2.md and Phase 2 plan — implement the **Student Panel** as a Google Apps Script Web App UI.

Source of Truth:
- SPEC_v2.md → "Student Panel" and "UI / UX Guidelines" sections
- UI_DESIGN_PHASE2_STUDENT_PANEL.md (v2.0, June 2025)

Functional Scope:
- Mobile-first Web App with large buttons
- Request OUT, RESTROOM, Check IN actions
- Current status display and Emergency Mode banner
- Pending state handling and backend logging prefix `[UI-StudentPanel]`

This PR targets branch `phase-2/student-panel-ui`.

## Lead Engineer Notes
- Initial Student Panel UI with basic backend integration.

# Task: Implement Phase 1 Core Backend Modules (Node-first)

Per SPEC_v2.md, migration_plan_v2.md, and the approved scaffold/CI PR:

✅ Scaffold is ready: Node env, ESLint, Jest, CI in place.
✅ No app logic yet — correct for this point.
✅ Next step per Master Build Plan: implement **Phase 1 backend modules**.

---

## Scope:

Implement the following **as clean Node modules** (testable, no GAS binding yet):

- Pass Log API
- Active Pass API
- Permanent Record archiving logic
- Emergency Mode state management
- System Settings management

---

## Notes:

- Implement as **plain Node modules** first:
    - Allows robust Jest tests and CI runs.
    - GAS binding layer will be added in a later PR.
- Match SPEC data model and flows exactly:
    - Pass state transitions, Emergency Mode persistence, edge cases, etc.
- Write **unit tests** for all modules:
    - Normal cases + key edge cases.
- Include basic **logging** in modules where appropriate.

---

## Out of scope for this PR:

🚫 Do NOT build UI yet — that is Phase 2.  
🚫 Do NOT wrap for GAS yet — next PR.  
🚫 No direct Sheet integration in this PR — use mocks or abstraction layer as needed.

---

## Branch:

Target branch: **phase-1/backend-api**

---

## PR title:

`[Phase 1] Implement core backend modules for Pass Log, Active Passes, Permanent Record, Emergency Mode, Settings`

---

## After PR:

- **Pause for review.**  
- Do not proceed to GAS wrapping or UI until this PR is reviewed and approved.

---

Summary: This is the **first functional code PR** — core backend logic, test-first.


 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/src/api/activePasses.js b/src/api/activePasses.js
index 251ff253a6cb48baacbbb7e3dbbbf41fd7c977f8..55a5bf49f44f9c563b1c4b1424aa81e65a2f9813 100644
--- a/src/api/activePasses.js
+++ b/src/api/activePasses.js
@@ -1,37 +1,40 @@
 class ActivePasses {
   constructor(db) {
     this.db = db;
   }
 
   addPass(passId, data) {
     if (this.db.activePasses.has(passId)) {
       throw new Error('Active pass already exists');
     }
     this.db.activePasses.set(passId, { passId, status: 'OUT', ...data });
+    console.log('[ActivePasses] addPass', passId);
     return this.db.activePasses.get(passId);
   }
 
   updateStatus(passId, status) {
     const pass = this.db.activePasses.get(passId);
     if (!pass) {
       throw new Error('Active pass not found');
     }
     pass.status = status;
+    console.log('[ActivePasses] updateStatus', passId, status);
     return pass;
   }
 
   closePass(passId) {
     const pass = this.db.activePasses.get(passId);
     if (!pass) {
       throw new Error('Active pass not found');
     }
     this.db.activePasses.delete(passId);
+    console.log('[ActivePasses] closePass', passId);
     return pass;
   }
 
   list() {
     return Array.from(this.db.activePasses.values());
   }
 }
 
 module.exports = ActivePasses;
diff --git a/src/api/emergencyMode.js b/src/api/emergencyMode.js
index c2f6c7b90c171d4d049bf423f878fefc1184fb9f..d58de16942d1253e92f35eb26b3a3652704661c2 100644
--- a/src/api/emergencyMode.js
+++ b/src/api/emergencyMode.js
@@ -1,19 +1,21 @@
 class EmergencyMode {
   constructor(db) {
     this.db = db;
   }
 
   activate() {
     this.db.emergencyMode = true;
+    console.log('[EmergencyMode] activate');
   }
 
   deactivate() {
     this.db.emergencyMode = false;
+    console.log('[EmergencyMode] deactivate');
   }
 
   isActive() {
     return this.db.emergencyMode;
   }
 }
 
 module.exports = EmergencyMode;
diff --git a/src/api/passLog.js b/src/api/passLog.js
index 228173956e2c14d29b016b4ad712e258670be82c..a97515cb875c2571fb24f744c6f12443447a8d78 100644
--- a/src/api/passLog.js
+++ b/src/api/passLog.js
@@ -1,66 +1,69 @@
 class PassLog {
   constructor(db) {
     this.db = db;
   }
 
   createPass(passId, data) {
     if (
       this.db.passLog.find((e) => e.passId === passId && e.state !== 'CLOSED')
     ) {
       throw new Error('Pass already exists');
     }
     const entry = {
       passId,
       legId: 1,
       state: 'OPEN',
       status: 'OUT',
       timestamp: data.timestamp || Date.now(),
       ...data,
     };
     this.db.passLog.push(entry);
+    console.log('[PassLog] createPass', passId);
     return entry;
   }
 
   updateStatus(passId, status, timestamp = Date.now()) {
     const last = this._getLastOpenEntry(passId);
     const entry = {
       ...last,
       legId: last.legId + 1,
       status,
       timestamp,
     };
     this.db.passLog.push(entry);
+    console.log('[PassLog] updateStatus', passId, status);
     return entry;
   }
 
   closePass(passId, closedByStaffId, timestamp = Date.now()) {
     const last = this._getLastOpenEntry(passId);
     const entry = {
       ...last,
       legId: last.legId + 1,
       state: 'CLOSED',
       closedByStaffId,
       timestamp,
     };
     this.db.passLog.push(entry);
+    console.log('[PassLog] closePass', passId);
     return entry;
   }
 
   getEntries(passId) {
     return this.db.passLog.filter((e) => e.passId === passId);
   }
 
   _getLastOpenEntry(passId) {
     const entries = this.getEntries(passId);
     if (entries.length === 0) {
       throw new Error('Pass not found');
     }
     const last = entries[entries.length - 1];
     if (last.state === 'CLOSED') {
       throw new Error('Pass already closed');
     }
     return last;
   }
 }
 
 module.exports = PassLog;
diff --git a/src/api/permanentRecord.js b/src/api/permanentRecord.js
index 63a2ecad63a708cbf776691381f16f2d5edda2d5..5d690d65ff4694ac51d494ffad0d46357e37e251 100644
--- a/src/api/permanentRecord.js
+++ b/src/api/permanentRecord.js
@@ -1,16 +1,17 @@
 class PermanentRecord {
   constructor(db) {
     this.db = db;
   }
 
   archive(passId, entries) {
     this.db.permanentRecord.push({ passId, entries });
+    console.log('[PermanentRecord] archive', passId);
     return { passId, entries };
   }
 
   list() {
     return this.db.permanentRecord;
   }
 }
 
 module.exports = PermanentRecord;
diff --git a/src/api/settings.js b/src/api/settings.js
index 06b93771184d163634a24843562072226083ec97..4980bb997463c0245e56fc7a02ca69eb0ae9d321 100644
--- a/src/api/settings.js
+++ b/src/api/settings.js
@@ -1,19 +1,20 @@
 class Settings {
   constructor(db) {
     this.db = db;
   }
 
   set(key, value) {
     this.db.settings[key] = value;
+    console.log('[Settings] set', key, value);
   }
 
   get(key) {
     return this.db.settings[key];
   }
 
   getAll() {
     return { ...this.db.settings };
   }
 }
 
 module.exports = Settings;
diff --git a/tests/backend.test.js b/tests/backend.test.js
index 9f90330ddcbb2799a5f7824ddf0d5ea17eb7fc0d..247e2c5376da1a4a3a2b4541a800571518eeaffa 100644
--- a/tests/backend.test.js
+++ b/tests/backend.test.js
@@ -1,74 +1,89 @@
 const {
   InMemoryDB,
   PassLog,
   ActivePasses,
   PermanentRecord,
   EmergencyMode,
   Settings,
 } = require('../src');
 
 describe('Backend modules', () => {
   let db;
   let passLog;
   let activePasses;
   let permanentRecord;
   let emergency;
   let settings;
 
   beforeEach(() => {
     db = new InMemoryDB();
     passLog = new PassLog(db);
     activePasses = new ActivePasses(db);
     permanentRecord = new PermanentRecord(db);
     emergency = new EmergencyMode(db);
     settings = new Settings(db);
+    jest.spyOn(console, 'log').mockImplementation(() => {});
+  });
+
+  afterEach(() => {
+    jest.restoreAllMocks();
   });
 
   test('pass lifecycle logs and archives correctly', () => {
     const passId = 'P1';
     const timestamp = Date.now();
 
     // create pass
     passLog.createPass(passId, { studentId: 'S1', timestamp });
     activePasses.addPass(passId, { studentId: 'S1' });
 
     // student returns IN
     passLog.updateStatus(passId, 'IN', timestamp + 1000);
     activePasses.updateStatus(passId, 'IN');
 
     // student goes OUT again
     passLog.updateStatus(passId, 'OUT', timestamp + 2000);
     activePasses.updateStatus(passId, 'OUT');
 
     // close pass
     passLog.closePass(passId, 'T1', timestamp + 3000);
     const active = activePasses.closePass(passId);
     permanentRecord.archive(passId, passLog.getEntries(passId));
 
     expect(db.passLog).toHaveLength(4);
     expect(active.passId).toBe(passId);
     expect(activePasses.list()).toHaveLength(0);
     expect(db.permanentRecord).toHaveLength(1);
     expect(db.permanentRecord[0].entries).toHaveLength(4);
   });
 
   test('closing a non-existent pass throws error', () => {
     expect(() => passLog.closePass('unknown', 'T1')).toThrow('Pass not found');
   });
 
   test('emergency mode toggle', () => {
     expect(emergency.isActive()).toBe(false);
     emergency.activate();
     expect(emergency.isActive()).toBe(true);
     emergency.deactivate();
     expect(emergency.isActive()).toBe(false);
   });
 
   test('system settings management', () => {
     settings.set('notify', true);
     expect(settings.get('notify')).toBe(true);
     settings.set('notify', false);
     expect(settings.get('notify')).toBe(false);
     expect(settings.getAll()).toEqual({ notify: false });
   });
+
+  test('logging occurs for key actions', () => {
+    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
+    const passId = 'P2';
+    passLog.createPass(passId, { studentId: 'S2' });
+    expect(logSpy).toHaveBeenCalledWith('[PassLog] createPass', passId);
+    emergency.activate();
+    expect(logSpy).toHaveBeenCalledWith('[EmergencyMode] activate');
+    logSpy.mockRestore();
+  });
 });
 
EOF
)

Summary

Added console logging to pass lifecycle methods in PassLog so that creating, updating, and closing passes are recorded in the console logs

Logged actions for Active Pass additions, updates, and closings to aid in debugging active pass state

Logged archive events in PermanentRecord to track when closed passes are stored

Emergency Mode activation and deactivation now emit console logs for visibility

Unit tests now stub console logging and verify that key actions trigger logs, ensuring consistent behavior

Testing

✅ npm run lint

✅ npm test


Files (6)

src/api/activePasses.js
+3
-0

src/api/emergencyMode.js
+2
-0

src/api/passLog.js
+3
-0

src/api/permanentRecord.js
+1
-0

src/api/settings.js
+1
-0

tests/backend.test.js
+15
-0