class EmergencyMode {
  constructor(db) {
    this.db = db;
  }

  activate() {
    this.db.emergencyMode = true;
    console.log('[EmergencyMode] activate');
  }

  deactivate() {
    this.db.emergencyMode = false;
    console.log('[EmergencyMode] deactivate');
  }

  isActive() {
    return this.db.emergencyMode;
  }
}

module.exports = EmergencyMode;
