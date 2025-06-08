class InMemoryDB {
  constructor() {
    this.passLog = [];
    this.activePasses = new Map();
    this.permanentRecord = [];
    this.settings = {};
    this.emergencyMode = false;
  }
}

module.exports = InMemoryDB;
