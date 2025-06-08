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
