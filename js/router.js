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

  function buildPageHtml(key) {
    switch (key) {
      case 'index.html':
        return '<section class="hero"></section>';

      case 'how-to-play.html':
        return '<section id="how"></section>' +
          '<section id="differences"></section>' +
          '<div class="rules-cta-wrap">' +
            '<p class="rules-cta-lead">' + T('cta.rules-lead') + '</p>' +
            '<div class="rules-cta-btns">' +
              '<button id="open-rules-modal" class="rules-cta-btn">' + T('cta.rules-btn') + '</button>' +
              '<a href="https://magic.wizards.com/en/formats/two-headed-giant" target="_blank" rel="noopener" class="rules-cta-btn rules-cta-link">' + T('cta.wizards-btn') + '</a>' +
            '</div>' +
          '</div>' +
          '<div id="rules-modal">' +
            '<div class="rules-modal-inner">' +
              '<div class="rules-modal-header">' +
                '<div>' +
                  '<div class="rules-modal-title">' + T('modal.rules-title') + '</div>' +
                  '<div class="rules-modal-source">' + T('modal.rules-source') + '</div>' +
                '</div>' +
                '<button id="rules-modal-close" aria-label="Close">✕</button>' +
              '</div>' +
              '<div class="rules-modal-body" id="rules-modal-body"></div>' +
            '</div>' +
          '</div>';

      case 'run-an-event.html':
        return '<section id="lgs"></section>';

      case 'banned-list.html':
        return '<section id="banned"></section>' +
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
                  '<a id="modal-scryfall" class="modal-scryfall-link" target="_blank" rel="noopener">' + T('modal.scryfall') + '</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>';

      default:
        return null;
    }
  }

  var PAGE_TITLE_KEYS = {
    'index.html':        'page.home',
    'how-to-play.html':  'page.how',
    'run-an-event.html': 'page.run',
    'banned-list.html':  'page.banned',
  };

  function getPageTitle(key) {
    return PAGE_TITLE_KEYS[key] ? T(PAGE_TITLE_KEYS[key]) : document.title;
  }

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
    var html = buildPageHtml(key);
    if (!html) { location.href = url.href; return; }

    // Stop particle loops before leaving current page
    if (window.destroyParticles)     destroyParticles();
    closeMobileNav();
    if (window.destroyPageParticles) destroyPageParticles();
    document.body.style.overflow = '';

    pageContent.classList.add('page-exit');

    setTimeout(function () {
      pageContent.innerHTML = html;
      document.title = getPageTitle(key);
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
    if (!buildPageHtml(key)) return;
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

  /* ── Re-render hook for language switching ───────────────────── */
  window._rerenderPage = function () {
    var key  = getPageKey(location.pathname);
    var html = buildPageHtml(key);
    if (!html) return;
    if (window.destroyParticles)     destroyParticles();
    if (window.destroyPageParticles) destroyPageParticles();
    pageContent.innerHTML = html;
    document.title = getPageTitle(key);
    var fn = PAGE_INIT[key];
    if (fn) fn();
    if (window.initPageParticles) initPageParticles();
  };

  try { history.replaceState({ key: firstKey, href: location.href }, '', location.href); } catch (err) {}

}());
