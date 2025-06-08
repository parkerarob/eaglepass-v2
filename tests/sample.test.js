const api = require('../src');

test('exports include expected modules', () => {
  expect(api.InMemoryDB).toBeDefined();
  expect(api.PassLog).toBeDefined();
  expect(api.ActivePasses).toBeDefined();
  expect(api.PermanentRecord).toBeDefined();
  expect(api.EmergencyMode).toBeDefined();
  expect(api.Settings).toBeDefined();
});
