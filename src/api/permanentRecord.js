class PermanentRecord {
  constructor(db) {
    this.db = db;
  }

  archive(passId, entries) {
    this.db.permanentRecord.push({ passId, entries });
    console.log('[PermanentRecord] archive', passId);
    return { passId, entries };
  }

  list() {
    return this.db.permanentRecord;
  }
}

module.exports = PermanentRecord;
