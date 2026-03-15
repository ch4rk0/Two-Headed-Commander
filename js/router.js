/* router.js — client-side navigation with persistent nav */
(function () {
  'use strict';

  var pageContent = document.getElementById('page-content');

  var hamburger  = document.getElementById('nav-hamburger');
  var navLinks   = document.querySelector('.nav-links');

  function closeMobileNav() {
    if (navLinks)  navLinks.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* ── Page init functions ────────────────────────────────────── */

  function initIndex() {
    if (window.destroyParticles) destroyParticles();
    renderHero();
    var hero = document.querySelector('section.hero');

    var bgLayer = document.createElement('div');
    bgLayer.className = 'hero-bg-anim';
    hero.appendChild(bgLayer);

    var cvs = document.createElement('canvas');
    cvs.id = 'hero-particles';
    hero.appendChild(cvs);

    ['images/characters/orc-zombie.png', 'images/characters/human-elf.png'].forEach(function (src, i) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.className = 'hero-char ' + (i === 0 ? 'hero-char-left' : 'hero-char-right');
      hero.appendChild(img);
    });

    if (window.initParticles) initParticles();
  }

  function initHowToPlay() {
    renderHowToPlay();
    renderDifferences();
    renderRulesModal();
    document.getElementById('open-rules-modal').addEventListener('click', function () {
      document.getElementById('rules-modal').classList.add('open');
    });
    document.getElementById('rules-modal-close').addEventListener('click', function () {
      document.getElementById('rules-modal').classList.remove('open');
    });
    document.getElementById('rules-modal').addEventListener('click', function (e) {
      if (e.target === this) this.classList.remove('open');
    });
  }

  function initRunEvent() {
    renderLgs();
  }

  function initBannedList() {
    currentFilter = 'all';
    currentSearch = '';
    renderBanned();
    renderWatchlistSection();
    initCardModal();
    renderCards(CARDS);
    renderWatchlist();
    initFilters();
    if (window.innerWidth <= 600) {
      setTimeout(function () {
        var target = document.querySelector('.filter-row');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  /* ── Page shell HTML (empty containers — content injected by init fns) ── */

  var PAGE_HTML = {
    'index.html': '<section class="hero"></section>',

    'how-to-play.html':
      '<section id="how"></section>' +
      '<section id="differences"></section>' +
      '<div class="rules-cta-wrap">' +
        '<p class="rules-cta-lead">Curious about the underlying Two-Headed Giant rules?</p>' +
        '<button id="open-rules-modal" class="rules-cta-btn">View Official Two-Headed Giant Rules ↗</button>' +
      '</div>' +
      '<div id="rules-modal">' +
        '<div class="rules-modal-inner">' +
          '<div class="rules-modal-header">' +
            '<div>' +
              '<div class="rules-modal-title">Official Two-Headed Giant Rules</div>' +
              '<div class="rules-modal-source">Source: MtG Comprehensive Rules · June 2025</div>' +
            '</div>' +
            '<button id="rules-modal-close" aria-label="Close">✕</button>' +
          '</div>' +
          '<div class="rules-modal-body" id="rules-modal-body"></div>' +
        '</div>' +
      '</div>',

    'run-an-event.html': '<section id="lgs"></section>',

    'banned-list.html':
      '<section id="banned"></section>' +
      '<section id="watchlist"></section>' +
      '<div id="card-modal">' +
        '<div class="modal-content">' +
          '<button id="modal-close" aria-label="Close">✕</button>' +
          '<div class="modal-img-wrap"><img id="modal-img" alt=""></div>' +
          '<div class="modal-info">' +
            '<div id="modal-name"></div>' +
            '<div id="modal-type"></div>' +
            '<span id="modal-pill" class="ban-pill"></span>' +
            '<hr class="modal-divider">' +
            '<div id="modal-why-label" class="ban-why-label"></div>' +
            '<p id="modal-why" class="ban-why"></p>' +
            '<div class="ban-footer">' +
              '<span id="modal-origin" class="ban-origin"></span>' +
              '<a id="modal-scryfall" class="modal-scryfall-link" target="_blank" rel="noopener">View on Scryfall ↗</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>',
  };

  var PAGE_TITLES = {
    'index.html':        'Two-Headed Commander',
    'how-to-play.html':  'How to Play \u2014 Two-Headed Commander',
    'run-an-event.html': 'Run an Event \u2014 Two-Headed Commander',
    'banned-list.html':  'Banned List \u2014 Two-Headed Commander',
  };

  var PAGE_INIT = {
    '':                  initIndex,
    'index.html':        initIndex,
    'how-to-play.html':  initHowToPlay,
    'run-an-event.html': initRunEvent,
    'banned-list.html':  initBannedList,
  };

  /* ── Navigation ─────────────────────────────────────────────── */

  function getPageKey(pathname) {
    return pathname.split('/').pop() || 'index.html';
  }

  function updateNavActive(key) {
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.classList.toggle('nav-active', a.getAttribute('href') === key);
    });
  }

  function navigate(href) {
    var url  = new URL(href, location.href);
    var key  = getPageKey(url.pathname);
    var html = PAGE_HTML[key];
    if (!html) { location.href = url.href; return; }

    // Stop particle loops before leaving current page
    if (window.destroyParticles)     destroyParticles();
    closeMobileNav();
    if (window.destroyPageParticles) destroyPageParticles();
    document.body.style.overflow = '';

    pageContent.classList.add('page-exit');

    setTimeout(function () {
      pageContent.innerHTML = html;
      document.title = PAGE_TITLES[key] || document.title;
      updateNavActive(key);
      window.scrollTo(0, 0);

      var fn = PAGE_INIT[key];
      if (fn) fn();
      if (window.initPageParticles) initPageParticles();

      pageContent.classList.remove('page-exit');
      pageContent.classList.add('page-enter');
      setTimeout(function () { pageContent.classList.remove('page-enter'); }, 300);

      try { history.pushState({ key: key, href: url.href }, '', url.href); } catch (err) {}
    }, 150);
  }

  /* ── Intercept nav clicks ───────────────────────────────────── */

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('://') !== -1 || href.indexOf('mailto:') === 0) return;
    var key = getPageKey(new URL(a.href, location.href).pathname);
    if (!PAGE_HTML[key]) return;
    e.preventDefault();
    navigate(a.href);
  });

  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.href) navigate(e.state.href);
  });

  /* ── First-load init ────────────────────────────────────────── */

  var firstKey = getPageKey(location.pathname);
  var firstFn  = PAGE_INIT[firstKey];
  if (firstFn) firstFn();
  if (window.initPageParticles) initPageParticles();

  try { history.replaceState({ key: firstKey, href: location.href }, '', location.href); } catch (err) {}

}());
