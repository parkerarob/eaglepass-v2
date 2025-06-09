/* global google */
(function () {
  const statusEl = document.getElementById('status');
  const pendingEl = document.getElementById('pending');
  const emergencyBanner = document.getElementById('emergency-banner');
  const infoName = document.getElementById('info-name');
  const infoGrade = document.getElementById('info-grade');
  const infoId = document.getElementById('info-id');
  const destSelect = document.getElementById('destination');
  const checkInBtn = document.getElementById('check-in');
  const requestBtn = document.getElementById('request-out');
  const restroomBtn = document.getElementById('restroom');

  function setDisabled(disabled) {
    [requestBtn, checkInBtn, restroomBtn, destSelect].forEach((el) => {
      if (el) el.disabled = disabled;
    });
  }

  function showPending(show) {
    pendingEl.classList.toggle('hidden', !show);
    setDisabled(show);
  }

  function updateStatus(msg) {
    statusEl.textContent = msg || '';
  }

  function checkEmergency() {
    google.script.run
      .withSuccessHandler(function (active) {
        if (active) {
          emergencyBanner.classList.remove('hidden');
          setDisabled(true);
        } else {
          emergencyBanner.classList.add('hidden');
          setDisabled(false);
        }
      })
      .isEmergency();
  }

  requestBtn.addEventListener('click', function () {
    const dest = destSelect.value;
    showPending(true);
    google.script.run
      .withSuccessHandler(function () {
        updateStatus('OUT');
        checkInBtn.classList.remove('hidden');
        showPending(false);
      })
      .requestOut(dest);
  });

  checkInBtn.addEventListener('click', function () {
    showPending(true);
    google.script.run
      .withSuccessHandler(function () {
        updateStatus('IN');
        checkInBtn.classList.add('hidden');
        showPending(false);
      })
      .checkIn();
  });

  restroomBtn.addEventListener('click', function () {
    showPending(true);
    google.script.run
      .withSuccessHandler(function () {
        updateStatus('RESTROOM OUT');
        checkInBtn.classList.remove('hidden');
        showPending(false);
      })
      .restroomOut();
  });

  function loadStudent() {
    google.script.run
      .withSuccessHandler(function (info) {
        infoName.textContent = info.name;
        infoGrade.textContent = 'Grade: ' + (info.grade || 'N/A');
        infoId.textContent = info.id.startsWith('TEMP')
          ? 'TEMP-ID: ' + info.id
          : 'ID: ' + info.id;
      })
      .getStudentInfo();
  }

  function loadDestinations() {
    google.script.run
      .withSuccessHandler(function (list) {
        destSelect.innerHTML = '<option value="">Select Destination</option>';
        list.forEach(function (d) {
          const opt = document.createElement('option');
          opt.value = d.id;
          opt.textContent = d.name;
          destSelect.appendChild(opt);
        });
      })
      .getDestinations();

    destSelect.addEventListener('change', function () {
      requestBtn.disabled = !destSelect.value;
    });
  }

  function loadStatus() {
    google.script.run
      .withSuccessHandler(function (data) {
        updateStatus(data.status);
        if (data.status === 'OUT') {
          checkInBtn.classList.remove('hidden');
        } else {
          checkInBtn.classList.add('hidden');
        }
        checkEmergency();
      })
      .currentStatus();
  }

  // initial load
  loadStudent();
  loadDestinations();
  loadStatus();
})();
