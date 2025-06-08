class EmergencyMode {
  constructor(db) {
    this.db = db;
  }

  activate() {
    this.db.emergencyMode = true;
  }

  deactivate() {
    this.db.emergencyMode = false;
  }

  isActive() {
    return this.db.emergencyMode;
  }
}

module.exports = EmergencyMode;
