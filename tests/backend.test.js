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
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  test('logging occurs for key actions', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const passId = 'P2';
    passLog.createPass(passId, { studentId: 'S2' });
    expect(logSpy).toHaveBeenCalledWith('[PassLog] createPass', passId);
    emergency.activate();
    expect(logSpy).toHaveBeenCalledWith('[EmergencyMode] activate');
    logSpy.mockRestore();
  });
});
