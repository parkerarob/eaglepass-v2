const student = require('../src/gas/student.gs');
const init = require('../src/gas/init');

describe('Student Panel backend integration', () => {
  test('requestOut creates active pass', () => {
    student.requestOut('LIB');
    expect(init.activePasses.list().length).toBe(1);
  });
});
