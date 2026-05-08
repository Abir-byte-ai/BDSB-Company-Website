/* ─────────────────────────────────────────────
   nav.js — Page routing & mobile menu
───────────────────────────────────────────── */
'use strict';

const VALID_PAGES = ['about', 'products', 'contact'];

const PAGE_TITLES = {
  about:    'About Us — BDSB Basic Depth Sdn Bhd',
  products: 'Products & Services — BDSB Basic Depth Sdn Bhd',
  contact:  'Contact Us — BDSB Basic Depth Sdn Bhd',
};

function showPage(id) {
  if (!VALID_PAGES.includes(id)) id = 'about';

  // Toggle page visibility
  VALID_PAGES.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (!el) return;
    el.classList.toggle('active', p === id);
    el.setAttribute('aria-hidden', p !== id ? 'true' : 'false');
  });

  // Update nav active state
  VALID_PAGES.forEach(p => {
    const desktop = document.getElementById('nav-' + p);
    const mobile  = document.getElementById('mob-' + p);
    if (desktop) desktop.classList.toggle('active', p === id);
    if (mobile)  mobile.classList.toggle('active', p === id);
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update browser history & title
  try {
    history.pushState({ page: id }, '', '#' + id);
  } catch (e) {}
  document.title = PAGE_TITLES[id] || 'BDSB';

  // Re-trigger CSS fade-up animations on visible page
  document.querySelectorAll('#page-' + id + ' .fade-up').forEach(el => {
    el.style.animation = 'none';
    void el.offsetHeight; // reflow
    el.style.animation = '';
  });
}

// ─── Mobile menu ───
function toggleMobileMenu(btn) {
  const menu = document.getElementById('mobile-menu');
  const open  = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.querySelector('.nav-hamburger');
  menu.classList.remove('open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

// Close mobile menu on outside click
document.addEventListener('click', function (e) {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.querySelector('.nav-hamburger');
  if (menu && menu.classList.contains('open') &&
      !menu.contains(e.target) && btn && !btn.contains(e.target)) {
    closeMobileMenu();
  }
});

// ─── Browser back/forward ───
window.addEventListener('popstate', function (e) {
  const page = (e.state && e.state.page) ||
               location.hash.replace('#', '') ||
               'about';
  showPage(page);
});

// ─── Init on load ───
(function init() {
  const hash = location.hash.replace('#', '');
  showPage(VALID_PAGES.includes(hash) ? hash : 'about');
})();
