// Schedule page
const scheduleBody = document.getElementById('scheduleBody');
if (scheduleBody) {

  const statusLabels = {
    'attended':       '<span class="status-attended">Attended</span>',
    'booked':         '<span class="status-booked">Booked</span>',
    'noshow':         '<span class="status-noshow">No Show</span>',
    'cancelled':      '<span class="status-cancelled">Cancelled</span>',
    'cancelled-late': '<span style="color:#8e44ad;font-weight:bold;">Cancelled Late</span>'
  };

  let allSessions = [];

  function renderSessions(sessions) {
    if (!sessions.length) {
      scheduleBody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:1.5rem;color:var(--text-muted);">No sessions found.</td></tr>';
      return;
    }
    scheduleBody.innerHTML = sessions.map(function (s) {
      var noteHtml = s.note ? '<br><small style="color:var(--text-muted);">' + s.note + '</small>' : '';
      return '<tr>' +
        '<td>' + s.day + '</td>' +
        '<td>' + s.time + '</td>' +
        '<td>' + s.room + '</td>' +
        '<td>' + s.tutor + '</td>' +
        '<td>' + s.student + noteHtml + '</td>' +
        '<td>Yr ' + s.year + '</td>' +
        '<td>' + s.subject + '</td>' +
        '<td>' + s.duration + '</td>' +
        '<td>' + (statusLabels[s.status] || s.status) + '</td>' +
        '</tr>';
    }).join('');
  }

  fetch('data/sessions.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      allSessions = data;
      renderSessions(allSessions);
    })
    .catch(function () {
      scheduleBody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:1.5rem;color:#c0392b;">Could not load sessions.</td></tr>';
    });

  // Day filter buttons
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var day = btn.getAttribute('data-day');
      var filtered = day === 'All' ? allSessions : allSessions.filter(function (s) { return s.day === day; });
      renderSessions(filtered);
    });
  });
}

// Enrolment form validation and interactions

const form = document.getElementById('enrolForm');
if (form) {

  // Auto-calculate fee rate from year level
  const yearSelect = document.getElementById('yearLevel');
  const feeField  = document.getElementById('feeRate');

  yearSelect.addEventListener('change', function () {
    const yr = parseInt(this.value);
    if (!yr) {
      feeField.value = '';
    } else if (yr <= 9) {
      feeField.value = '$60/hr (Years 5–9)  ·  90-min session: $90';
    } else {
      feeField.value = '$72/hr (Years 10–12)  ·  90-min session: $108';
    }
  });

  // Show prepaid pack note
  const prepaidSelect = document.getElementById('prepaid');
  const prepaidNote   = document.getElementById('prepaidNote');

  prepaidSelect.addEventListener('change', function () {
    prepaidNote.style.display = this.value === 'yes' ? 'block' : 'none';
  });

  // Validation helpers
  function showError(fieldId, show) {
    const el = document.getElementById('err-' + fieldId);
    if (el) el.style.display = show ? 'block' : 'none';
    const input = document.getElementById(fieldId);
    if (input) input.style.borderColor = show ? '#c0392b' : '';
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function isValidPhone(val) {
    return /^[\d\s\+\-\(\)]{10,}$/.test(val) && val.replace(/\D/g, '').length >= 10;
  }

  function validateForm() {
    let valid = true;

    const required = ['studentName', 'dob', 'yearLevel', 'school', 'subjects', 'contactName', 'relationship', 'phone', 'email'];
    required.forEach(function (id) {
      const val = document.getElementById(id).value.trim();
      if (!val) {
        showError(id, true);
        valid = false;
      } else {
        showError(id, false);
      }
    });

    // Email format
    const emailVal = document.getElementById('email').value.trim();
    if (emailVal && !isValidEmail(emailVal)) {
      showError('email', true);
      valid = false;
    }

    // Phone format
    const phoneVal = document.getElementById('phone').value.trim();
    if (phoneVal && !isValidPhone(phoneVal)) {
      showError('phone', true);
      valid = false;
    }

    // Optional second contact phone
    const p2 = document.getElementById('contact2Phone').value.trim();
    if (p2 && !isValidPhone(p2)) {
      showError('contact2Phone', true);
      valid = false;
    } else {
      showError('contact2Phone', false);
    }

    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    // Simulate successful submission (Formspree handles real submit)
    document.getElementById('successMsg').style.display = 'block';
    form.querySelectorAll('input, select, button').forEach(function (el) {
      el.disabled = true;
    });

    // Scroll to success message
    document.getElementById('successMsg').scrollIntoView({ behavior: 'smooth' });
  });

  // Clear error on input
  form.querySelectorAll('input, select').forEach(function (el) {
    el.addEventListener('input', function () {
      showError(el.id, false);
    });
  });
}
