/* eslint-env jest */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Student Panel UI', () => {
  let dom;
  let runMock;

  beforeEach(() => {
    const html = `
      <div id="emergency-banner" class="hidden"></div>
      <div id="info-name"></div>
      <div id="info-grade"></div>
      <div id="info-id"></div>
      <button id="restroom" class="action restroom">RESTROOM PASS</button>
      <select id="destination"></select>
      <button id="request-out" class="action out" disabled>Request OUT Pass</button>
      <div id="status" class="status"></div>
      <button id="check-in" class="action checkin hidden">Check IN</button>
      <div id="pending" class="hidden">Loading...</div>`;
    dom = new JSDOM(html, { runScripts: 'outside-only' });
    global.window = dom.window;
    global.document = dom.window.document;

    runMock = {
      requestOut: jest.fn().mockReturnThis(),
      checkIn: jest.fn().mockReturnThis(),
      restroomOut: jest.fn().mockReturnThis(),
      currentStatus: jest.fn().mockReturnThis(),
      isEmergency: jest.fn().mockReturnThis(),
      getStudentInfo: jest.fn().mockReturnThis(),
      getDestinations: jest.fn().mockReturnThis(),
      withSuccessHandler(cb) {
        this.cb = cb;
        return this;
      },
    };
    dom.window.google = { script: { run: runMock } };

    const script = fs.readFileSync(
      path.join(__dirname, '../src/webapp/student.js'),
      'utf8'
    );
    dom.window.eval(script);
  });

  afterEach(() => {
    delete global.window;
    delete global.document;
    delete global.google;
  });

  test('clicking Request OUT calls backend', () => {
    const select = dom.window.document.getElementById('destination');
    const option = dom.window.document.createElement('option');
    option.value = 'LIB';
    option.selected = true;
    select.appendChild(option);

    const button = dom.window.document.getElementById('request-out');
    button.disabled = false;
    button.click();
    expect(runMock.requestOut).toHaveBeenCalledWith('LIB');
  });
});
