/* ════════════════════════════════════════════════════════════════
   cards.js — card data setup, image helpers, modal, grid rendering
   ════════════════════════════════════════════════════════════════ */


/* ── CARD DATA ───────────────────────────────────────────────── */

// Deduplicate in case the same card name appears more than once
var _seen = new Set();
var CARDS = BANNED_CARDS.filter(function (card) {
  if (_seen.has(card.name)) return false;
  _seen.add(card.name);
  if (card.cat === 'extra-turn') return false;  // listed separately in the manifesto
  return true;
});

function PILL_LABEL(pill) {
  var map = {
    'pill-edh':  'pill.edh',
    'pill-2hg':  'pill.2hg',
    'pill-both': 'pill.both',
    'pill-2hc':  'pill.2hc',
    'pill-new':  'pill.new',
  };
  return map[pill] ? T(map[pill]) : T('pill.edh');
}


/* ── IMAGE URLS ──────────────────────────────────────────────── */

function localImg(name) {
  var filename = name.replace(/[^a-zA-Z0-9\-_' ]/g, '_').replace(/\s+/g, '_') + '.jpg';
  return 'images/cards/' + filename;
}

function scryfallImg(name) {
  return 'https://api.scryfall.com/cards/named?exact=' + encodeURIComponent(name) + '&format=image&version=normal';
}


/* ── MODAL ───────────────────────────────────────────────────── */

var modal, modalImg, modalName, modalType, modalPill, modalOrigin, modalWhy, modalWhyLbl, modalScryfall;
var _modalKeyHandler = null;

function initCardModal() {
  modal         = document.getElementById('card-modal');
  modalImg      = document.getElementById('modal-img');
  modalName     = document.getElementById('modal-name');
  modalType     = document.getElementById('modal-type');
  modalPill     = document.getElementById('modal-pill');
  modalOrigin   = document.getElementById('modal-origin');
  modalWhy      = document.getElementById('modal-why');
  modalWhyLbl   = document.getElementById('modal-why-label');
  modalScryfall = document.getElementById('modal-scryfall');

  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.getElementById('modal-close').addEventListener('click', closeModal);

  if (_modalKeyHandler) document.removeEventListener('keydown', _modalKeyHandler);
  _modalKeyHandler = function (e) { if (e.key === 'Escape') closeModal(); };
  document.addEventListener('keydown', _modalKeyHandler);
}

function scryfallLink(name) {
  return 'https://scryfall.com/search?q=!' + encodeURIComponent('"' + name + '"');
}

function openModal(card, isWatchlist) {
  modalImg.src     = localImg(card.name);
  modalImg.onerror = function () { modalImg.src = scryfallImg(card.name); modalImg.onerror = null; };
  modalImg.alt     = card.name;

  modalName.textContent = card.name;
  modalType.textContent = card.type;
  modalScryfall.href        = scryfallLink(card.name);
  modalScryfall.textContent = T('modal.scryfall');

  if (isWatchlist) {
    modalPill.textContent     = T('pill.watch');
    modalPill.className       = 'ban-pill pill-watch';
    modalOrigin.style.display = 'none';
  } else {
    modalPill.textContent     = PILL_LABEL(card.pill);
    modalPill.className       = 'ban-pill ' + card.pill;
    modalOrigin.textContent   = card.origin || '';
    modalOrigin.style.display = '';
  }
  modalWhyLbl.style.display = 'none';
  modalWhy.style.display    = 'none';

  if (window.gtag) {
    window.gtag('event', 'card_view', {
      card_name:     card.name,
      card_category: card.cat,
      card_origin:   card.origin || (isWatchlist ? 'watchlist' : 'banned')
    });
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(function () {
    if (!modal.classList.contains('open')) modalImg.src = '';
  }, 300);
}



/* ── RENDER BANNED CARDS ─────────────────────────────────────── */

function renderCards(cards) {
  var grid = document.getElementById('banned-grid');
  grid.innerHTML = '';

  cards.forEach(function (card, index) {
    var el = document.createElement('div');
    el.className = 'ban-card' + (card.cat === 'banned-commander' ? ' cmdr-ban' : '');
    el.style.animationDelay = (index * 0.02) + 's';

    var safeName    = card.name.replace(/"/g, '&quot;');
    var pillLabel   = PILL_LABEL(card.pill);
    var fallbackSrc = scryfallImg(card.name).replace(/'/g, "\\'");

    el.innerHTML =
      '<div class="ban-card-img-wrap">' +
        '<img class="ban-card-img" src="' + localImg(card.name) + '" alt="' + safeName + '" loading="lazy"' +
          ' onerror="this.src=\'' + fallbackSrc + '\';this.onerror=function(){this.parentElement.classList.add(\'img-error\')}">' +
        '<div class="ban-card-overlay"><span class="ban-pill ' + card.pill + '">' + pillLabel + '</span></div>' +
      '</div>' +
      '<div class="ban-card-label">' + card.name + '</div>';

    el.addEventListener('click', function () { openModal(card, false); });
    grid.appendChild(el);
  });

  document.getElementById('visible-count').textContent = cards.length;
  document.getElementById('total-count').textContent   = CARDS.length;
}


/* ── RENDER WATCHLIST ────────────────────────────────────────── */

function renderWatchlist() {
  var grid = document.getElementById('watchlist-grid');
  if (!grid || typeof WATCHLIST_CARDS === 'undefined') return;

  WATCHLIST_CARDS.forEach(function (card, index) {
    var el = document.createElement('div');
    el.className = 'ban-card watch-card';
    el.style.animationDelay = (index * 0.02) + 's';

    var safeName    = card.name.replace(/"/g, '&quot;');
    var fallbackSrc = scryfallImg(card.name).replace(/'/g, "\\'");

    el.innerHTML =
      '<div class="ban-card-img-wrap">' +
        '<img class="ban-card-img" src="' + localImg(card.name) + '" alt="' + safeName + '" loading="lazy"' +
          ' onerror="this.src=\'' + fallbackSrc + '\';this.onerror=function(){this.parentElement.classList.add(\'img-error\')}">' +
        '<div class="ban-card-overlay"><span class="ban-pill pill-watch">Watchlist</span></div>' +
      '</div>' +
      '<div class="ban-card-label">' + card.name + '</div>';

    el.addEventListener('click', function () { openModal(card, true); });
    grid.appendChild(el);
  });
}
