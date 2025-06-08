const { InMemoryDB, PassLog, ActivePasses, EmergencyMode } = require('../');

const db = new InMemoryDB();
const passLog = new PassLog(db);
const activePasses = new ActivePasses(db);
const emergency = new EmergencyMode(db);

module.exports = {
  db,
  passLog,
  activePasses,
  emergency,
};
