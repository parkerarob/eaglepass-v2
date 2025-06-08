const InMemoryDB = require('./api/db');
const PassLog = require('./api/passLog');
const ActivePasses = require('./api/activePasses');
const PermanentRecord = require('./api/permanentRecord');
const EmergencyMode = require('./api/emergencyMode');
const Settings = require('./api/settings');

module.exports = {
  InMemoryDB,
  PassLog,
  ActivePasses,
  PermanentRecord,
  EmergencyMode,
  Settings,
};
