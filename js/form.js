/* ─────────────────────────────────────────────
   form.js — Contact form: validation, security
───────────────────────────────────────────── */
'use strict';

const RATE_LIMIT_MS = 15000; // 15 seconds between submissions
let lastSubmitTime  = 0;

// ─── Sanitise user input ───
function sanitise(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// ─── Basic email format check ───
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// ─── Main submit handler ───
function handleFormSubmit() {
  // 1. Honeypot check (bot trap — should always be empty)
  const hp = document.getElementById('hp-field');
  if (hp && hp.value.trim() !== '') {
    // Silently reject — bots shouldn't know they've been caught
    return;
  }

  // 2. Rate limit
  const now = Date.now();
  if (now - lastSubmitTime < RATE_LIMIT_MS) {
    showFormError('Please wait a moment before submitting again.');
    return;
  }

  // 3. Gather & sanitise values
  const fname   = sanitise(document.getElementById('fname').value);
  const email   = sanitise(document.getElementById('email').value);
  const message = sanitise(document.getElementById('message').value);

  // 4. Validate
  if (!fname) {
    showFormError('Please enter your first name.');
    document.getElementById('fname').focus();
    return;
  }
  if (!email || !isValidEmail(email)) {
    showFormError('Please enter a valid email address.');
    document.getElementById('email').focus();
    return;
  }
  if (!message) {
    showFormError('Please enter a message.');
    document.getElementById('message').focus();
    return;
  }
  if (message.length > 1200) {
    showFormError('Your message is too long (max 1200 characters).');
    return;
  }

  // 5. Lock button & update timestamp
  lastSubmitTime = now;
  const btn = document.getElementById('form-submit-btn');
  btn.disabled     = true;
  btn.textContent  = 'Sending…';

  // 6. TODO: Replace setTimeout with real fetch() to your backend/email service
  //    e.g. Formspree, EmailJS, or your own server endpoint.
  //    Example with Formspree:
  //
  //    fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //      method: 'POST',
  //      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  //      body: JSON.stringify({ name: fname, email, message })
  //    })
  //    .then(r => r.ok ? onSuccess() : onError())
  //    .catch(onError);

  setTimeout(onSuccess, 900); // ← remove this once real submission is wired up
}

function onSuccess() {
  document.getElementById('form-success').classList.add('show');
  document.getElementById('form-error').classList.remove('show');

  // Reset fields
  document.querySelectorAll('#enquiry-form input, #enquiry-form textarea, #enquiry-form select')
    .forEach(el => { el.value = ''; });

  // Re-enable button
  const btn = document.getElementById('form-submit-btn');
  btn.disabled  = false;
  btn.innerHTML = 'Send Enquiry <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
}

function onError() {
  showFormError('Something went wrong. Please email us directly at info@bdsb.com.my');
  const btn = document.getElementById('form-submit-btn');
  btn.disabled  = false;
  btn.innerHTML = 'Try Again';
}

function showFormError(msg) {
  const el = document.getElementById('form-error');
  if (el) { el.textContent = msg; el.classList.add('show'); }
}
