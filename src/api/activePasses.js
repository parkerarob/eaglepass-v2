class ActivePasses {
  constructor(db) {
    this.db = db;
  }

  addPass(passId, data) {
    if (this.db.activePasses.has(passId)) {
      throw new Error('Active pass already exists');
    }
    this.db.activePasses.set(passId, { passId, status: 'OUT', ...data });
    console.log('[ActivePasses] addPass', passId);
    return this.db.activePasses.get(passId);
  }

  updateStatus(passId, status) {
    const pass = this.db.activePasses.get(passId);
    if (!pass) {
      throw new Error('Active pass not found');
    }
    pass.status = status;
    console.log('[ActivePasses] updateStatus', passId, status);
    return pass;
  }

  closePass(passId) {
    const pass = this.db.activePasses.get(passId);
    if (!pass) {
      throw new Error('Active pass not found');
    }
    this.db.activePasses.delete(passId);
    console.log('[ActivePasses] closePass', passId);
    return pass;
  }

  list() {
    return Array.from(this.db.activePasses.values());
  }
}

module.exports = ActivePasses;
