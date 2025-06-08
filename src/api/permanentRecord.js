class PermanentRecord {
  constructor(db) {
    this.db = db;
  }

  archive(passId, entries) {
    this.db.permanentRecord.push({ passId, entries });
    return { passId, entries };
  }

  list() {
    return this.db.permanentRecord;
  }
}

module.exports = PermanentRecord;
