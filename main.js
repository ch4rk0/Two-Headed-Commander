/* ════════════════════════════════════════════════════════════════
   TWO-HEADED COMMANDER — main.js
   ════════════════════════════════════════════════════════════════

   TABLE OF CONTENTS
   ─────────────────
   1.  CARD DATA SETUP       (deduplicate, label map)
   2.  SCRYFALL IMAGE URL    (helper)
   3.  MODAL                 (open / close)
   4.  BANNED CARD RENDERING (image grid)
   5.  WATCHLIST RENDERING   (image grid)
   6.  FILTER & SEARCH       (state + applyFilters)
   7.  FILTER BUTTON EVENTS
   8.  SEARCH INPUT EVENT
   9.  FAQ ACCORDION
   10. INIT

   ════════════════════════════════════════════════════════════════ */


/* ── 1. CARD DATA SETUP ──────────────────────────────────────── */

// Deduplicate in case the same card name appears more than once
const seen = new Set();
const CARDS = BANNED_CARDS.filter(card => {
  if (seen.has(card.name)) return false;
  seen.add(card.name);
  return true;
});

// Human-readable labels for each pill class
const PILL_LABEL = {
  'pill-edh':  'EDH Ban',
  'pill-2hg':  '2HG Ban',
  'pill-both': 'EDH + 2HG',
  'pill-2hc':  '2HC-Specific',
  'pill-new':  'New Ban',
};


/* ── 2. IMAGE URL ────────────────────────────────────────────── */

/**
 * Converts a card name to the local filename used in /images/.
 * Matches the convention in download-images.js.
 */
function localImg(name) {
  var filename = name.replace(/[^a-zA-Z0-9\-_' ]/g, '_').replace(/\s+/g, '_') + '.jpg';
  return 'images/' + filename;
}

/**
 * Returns the Scryfall fallback URL for a card name.
 */
function scryfallImg(name) {
  return 'https://api.scryfall.com/cards/named?exact=' + encodeURIComponent(name) + '&format=image&version=normal';
}


/* ── 3. MODAL ────────────────────────────────────────────────── */

const modal       = document.getElementById('card-modal');
const modalImg    = document.getElementById('modal-img');
const modalName   = document.getElementById('modal-name');
const modalType   = document.getElementById('modal-type');
const modalPill   = document.getElementById('modal-pill');
const modalOrigin = document.getElementById('modal-origin');
const modalWhy    = document.getElementById('modal-why');
const modalWhyLbl = document.getElementById('modal-why-label');

/**
 * Opens the card detail modal.
 * @param {Object}  card        - card object from CARDS or WATCHLIST_CARDS
 * @param {boolean} isWatchlist - true when card comes from the watchlist
 */
function openModal(card, isWatchlist) {
  modalImg.src          = localImg(card.name);
  modalImg.onerror      = function() { modalImg.src = scryfallImg(card.name); modalImg.onerror = null; };
  modalImg.alt          = card.name;
  modalName.textContent = card.name;
  modalType.textContent = card.type;

  if (isWatchlist) {
    modalPill.textContent     = 'Watchlist';
    modalPill.className       = 'ban-pill pill-watch';
    modalWhyLbl.textContent   = 'Why It\'s Being Watched';
    modalWhy.textContent      = card.discuss;
    modalOrigin.style.display = 'none';
  } else {
    modalPill.textContent     = PILL_LABEL[card.pill] || 'Banned';
    modalPill.className       = 'ban-pill ' + card.pill;
    modalWhyLbl.textContent   = 'Why It\'s Banned';
    modalWhy.textContent      = card.reason;
    modalOrigin.textContent   = card.origin || '';
    modalOrigin.style.display = '';
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  // Clear the image src after the fade-out so the old card doesn't flash next open
  setTimeout(function () {
    if (!modal.classList.contains('open')) modalImg.src = '';
  }, 300);
}

// Close when clicking the dark backdrop
modal.addEventListener('click', function (e) {
  if (e.target === modal) closeModal();
});

// Close button
document.getElementById('modal-close').addEventListener('click', closeModal);

// Close with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});


/* ── 4. BANNED CARD RENDERING ────────────────────────────────── */

/**
 * Renders an array of card objects into #banned-grid as image cards.
 * Also updates the "Showing X of Y" counter.
 *
 * @param {Array} cards - filtered subset of CARDS to display
 */
function renderCards(cards) {
  var grid = document.getElementById('banned-grid');
  grid.innerHTML = '';

  cards.forEach(function (card, index) {
    var el = document.createElement('div');
    el.className = 'ban-card';
    el.style.animationDelay = (index * 0.02) + 's';

    var safeName = card.name.replace(/"/g, '&quot;');
    var pillLabel = PILL_LABEL[card.pill] || 'Banned';

    el.innerHTML =
      '<div class="ban-card-img-wrap">' +
        '<img class="ban-card-img" src="' + localImg(card.name) + '" alt="' + safeName + '" loading="lazy" onerror="this.src=\'' + scryfallImg(card.name).replace(/'/g, "\\'") + '\';this.onerror=function(){this.parentElement.classList.add(\'img-error\')}">' +
        '<div class="ban-card-overlay">' +
          '<span class="ban-pill ' + card.pill + '">' + pillLabel + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="ban-card-label">' + card.name + '</div>';

    el.addEventListener('click', function () { openModal(card, false); });
    grid.appendChild(el);
  });

  document.getElementById('visible-count').textContent = cards.length;
  document.getElementById('total-count').textContent   = CARDS.length;
}


/* ── 5. WATCHLIST RENDERING ──────────────────────────────────── */

/**
 * Renders WATCHLIST_CARDS into #watchlist-grid as image cards.
 * Silently does nothing if the grid or the data array is missing.
 */
function renderWatchlist() {
  var grid = document.getElementById('watchlist-grid');
  if (!grid || typeof WATCHLIST_CARDS === 'undefined') return;

  WATCHLIST_CARDS.forEach(function (card, index) {
    var el = document.createElement('div');
    el.className = 'ban-card watch-card';
    el.style.animationDelay = (index * 0.02) + 's';

    var safeName = card.name.replace(/"/g, '&quot;');

    el.innerHTML =
      '<div class="ban-card-img-wrap">' +
        '<img class="ban-card-img" src="' + localImg(card.name) + '" alt="' + safeName + '" loading="lazy" onerror="this.src=\'' + scryfallImg(card.name).replace(/'/g, "\\'") + '\';this.onerror=function(){this.parentElement.classList.add(\'img-error\')}">' +
        '<div class="ban-card-overlay">' +
          '<span class="ban-pill pill-watch">Watchlist</span>' +
        '</div>' +
      '</div>' +
      '<div class="ban-card-label">' + card.name + '</div>';

    el.addEventListener('click', function () { openModal(card, true); });
    grid.appendChild(el);
  });
}


/* ── 6. FILTER & SEARCH STATE ────────────────────────────────── */

var currentFilter = 'all'; // matches data-filter attribute on .filt buttons
var currentSearch = '';    // lowercased search string

/**
 * Re-filters CARDS using the current filter + search state,
 * then re-renders the grid.
 * Call this whenever either state value changes.
 */
function applyFilters() {
  var results = CARDS;

  // Category filter
  if (currentFilter !== 'all') {
    results = results.filter(function (card) { return card.cat === currentFilter; });
  }

  // Text search — matches name, type, or reason text
  if (currentSearch) {
    var q = currentSearch.toLowerCase();
    results = results.filter(function (card) {
      return card.name.toLowerCase().includes(q)   ||
             card.reason.toLowerCase().includes(q) ||
             card.type.toLowerCase().includes(q);
    });
  }

  renderCards(results);
}


/* ── 7. FILTER BUTTON EVENTS ─────────────────────────────────── */

document.querySelectorAll('.filt').forEach(function (btn) {
  btn.addEventListener('click', function () {
    // Toggle active state
    document.querySelectorAll('.filt').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');

    // Update state and re-render
    currentFilter = btn.dataset.filter;
    applyFilters();
  });
});


/* ── 8. SEARCH INPUT EVENT ───────────────────────────────────── */

document.getElementById('card-search').addEventListener('input', function (e) {
  currentSearch = e.target.value.trim();
  applyFilters();
});


/* ── 9. FAQ ACCORDION ────────────────────────────────────────── */

document.querySelectorAll('.faq-q').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var item    = btn.parentElement;
    var wasOpen = item.classList.contains('open');

    // Close all items first
    document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });

    // Re-open the clicked one if it was previously closed
    if (!wasOpen) item.classList.add('open');
  });
});


/* ── 10. INIT ─────────────────────────────────────────────────── */

// Render all cards on page load
renderCards(CARDS);
renderWatchlist();
