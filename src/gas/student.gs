const { passLog, activePasses, emergency } = require('./init');

function doGet() {
  return HtmlService.createTemplateFromFile('webapp/student').evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function requestOut(destination) {
  console.log('[UI-StudentPanel] requestOut');
  const passId = 'P-' + Date.now();
  passLog.createPass(passId, {
    studentId: 'S1',
    destination,
    timestamp: Date.now(),
  });
  activePasses.addPass(passId, {
    studentId: 'S1',
    destination,
    start: Date.now(),
  });
  return { passId };
}

function checkIn() {
  console.log('[UI-StudentPanel] checkIn');
  const passes = activePasses.list();
  if (passes.length === 0) return null;
  const passId = passes[0].passId;
  passLog.updateStatus(passId, 'IN');
  activePasses.updateStatus(passId, 'IN');
  return { passId };
}

function restroomOut() {
  console.log('[UI-StudentPanel] restroomOut');
  const passId = 'P-' + Date.now();
  passLog.createPass(passId, { studentId: 'S1', type: 'RESTROOM' });
  activePasses.addPass(passId, { studentId: 'S1', type: 'RESTROOM' });
  return { passId };
}

function currentStatus() {
  const passes = activePasses.list();
  if (passes.length === 0) return { status: 'IN' };
  const p = passes[0];
  return { status: p.status || 'OUT', start: p.start };
}

function isEmergency() {
  return emergency.isActive();
}

function getStudentInfo() {
  return { name: 'Jane Doe', grade: '10', id: 'S1' };
}

function getDestinations() {
  return [
    { id: 'LIB', name: 'Library' },
    { id: 'OFF', name: 'Office' },
  ];
}

module.exports = {
  doGet,
  include,
  requestOut,
  checkIn,
  restroomOut,
  currentStatus,
  isEmergency,
  getStudentInfo,
  getDestinations,
};
