class Settings {
  constructor(db) {
    this.db = db;
  }

  set(key, value) {
    this.db.settings[key] = value;
    console.log('[Settings] set', key, value);
  }

  get(key) {
    return this.db.settings[key];
  }

  getAll() {
    return { ...this.db.settings };
  }
}

module.exports = Settings;
