// Rishika Choudhary Portfolio — Multi-page hash router + Mobile drawer + Discord copy

(function () {
  'use strict';

  /* ===================================================================
     ROUTE CONFIG
     Maps hash → page div id + nav data-route value + document title
     =================================================================== */
  const ROUTES = {
    'home':     { pageId: 'page-home',     title: 'Rishika Choudhary — UI/UX & Product Designer' },
    'projects': { pageId: 'page-projects', title: 'Projects — Rishika Choudhary' },
    'work':     { pageId: 'page-work',     title: 'Work — Rishika Choudhary' },
    'contact':  { pageId: 'page-contact',  title: 'Contact — Rishika Choudhary' },
  };
  const DEFAULT_ROUTE = 'home';

  /* ===================================================================
     ELEMENTS
     =================================================================== */
  const sidebar      = document.getElementById('sidebar');
  const menuToggle   = document.getElementById('mobileMenuToggle');
  const backdrop     = document.getElementById('sidebarBackdrop');
  const navLinks     = Array.from(document.querySelectorAll('[data-route]'));   // sidebar + hero btn
  const allPages     = Array.from(document.querySelectorAll('.page'));
  const copyToast    = document.getElementById('copyToast');
  const discordBtns  = document.querySelectorAll('.discord-copy-btn');
  const mainContent  = document.getElementById('mainContent');

  let toastTimer = null;

  /* ===================================================================
     ROUTER
     =================================================================== */
  function getRouteFromHash() {
    const hash = window.location.hash.replace(/^#/, '').toLowerCase().trim();
    return ROUTES[hash] ? hash : DEFAULT_ROUTE;
  }

  function navigate(route) {
    if (!ROUTES[route]) route = DEFAULT_ROUTE;

    // Update hash in URL (triggers hashchange but we guard with flag)
    const newHash = '#' + route;
    if (window.location.hash !== newHash) {
      window.location.hash = newHash;
    }

    renderPage(route);
  }

  function renderPage(route) {
    const config = ROUTES[route];
    if (!config) return;

    // Hide all pages, show target
    allPages.forEach(p => {
      p.hidden = true;
      p.classList.remove('is-active');
    });
    const target = document.getElementById(config.pageId);
    if (target) {
      target.hidden = false;
      // Trigger reflow for animation
      void target.offsetWidth;
      target.classList.add('is-active');
    }

    // Update nav active state
    navLinks.forEach(link => {
      const match = link.getAttribute('data-route') === route;
      link.classList.toggle('is-active', match);
      match ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
    });

    // Update document title
    document.title = config.title;

    // Scroll main content to top
    if (mainContent) mainContent.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  // Handle hash changes (back/forward button, direct URL)
  window.addEventListener('hashchange', () => {
    renderPage(getRouteFromHash());
  });

  // On first load, render from current hash
  document.addEventListener('DOMContentLoaded', () => {
    renderPage(getRouteFromHash());
    initMobileDrawer();
    initDiscordCopy();
    initNavClicks();
  });

  /* ===================================================================
     NAV CLICK INTERCEPTION (all [data-route] anchors + buttons)
     =================================================================== */
  function initNavClicks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (!link) return;

      const route = link.getAttribute('data-route');
      if (!route || !ROUTES[route]) return;

      e.preventDefault();
      closeMobileMenu();
      navigate(route);
    });
  }

  /* ===================================================================
     MOBILE SIDEBAR DRAWER
     =================================================================== */
  function initMobileDrawer() {
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
      });
    }
    if (backdrop) backdrop.addEventListener('click', closeMobileMenu);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });
  }

  function openMobileMenu() {
    sidebar.classList.add('is-open');
    backdrop.classList.add('is-visible');
    backdrop.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    sidebar.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    backdrop.setAttribute('aria-hidden', 'true');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  /* ===================================================================
     DISCORD COPY-TO-CLIPBOARD
     =================================================================== */
  function initDiscordCopy() {
    discordBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        const username = btn.getAttribute('data-discord') || 'rishikarc';
        try {
          await copyToClipboard(username);
          showToast('Discord username copied');
        } catch {
          showToast('Discord: rishikarc');
        }
      });
    });
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for file:// protocol
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  function showToast(msg) {
    if (!copyToast) return;
    copyToast.textContent = msg;
    copyToast.hidden = false;
    requestAnimationFrame(() => copyToast.classList.add('is-visible'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      copyToast.classList.remove('is-visible');
      setTimeout(() => { copyToast.hidden = true; }, 220);
    }, 2500);
  }

})();
