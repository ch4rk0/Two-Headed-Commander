/* ════════════════════════════════════════════════════════════════
   filters.js — filter button state, search, and applyFilters
   Depends on: cards.js (CARDS, renderCards)
   ════════════════════════════════════════════════════════════════ */

var currentFilter = 'all';
var currentSearch = '';

function applyFilters() {
  var results = CARDS;

  if (currentFilter !== 'all') {
    results = results.filter(function (card) { return card.cat === currentFilter; });
  }

  if (currentSearch) {
    var q = currentSearch.toLowerCase();
    results = results.filter(function (card) {
      return card.name.toLowerCase().includes(q) ||
             card.type.toLowerCase().includes(q);
    });
  }

  renderCards(results);
}

// Called from main.js after renderBanned() has injected the filter buttons and search input
function initFilters() {
  document.querySelectorAll('.filt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filt').forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      currentFilter = btn.dataset.filter;
      applyFilters();
    });
  });

  var searchDebounce = null;
  document.getElementById('card-search').addEventListener('input', function (e) {
    currentSearch = e.target.value.trim();
    applyFilters();
    clearTimeout(searchDebounce);
    if (currentSearch.length >= 2) {
      searchDebounce = setTimeout(function () {
        if (window.gtag) {
          gtag('event', 'search', { search_term: currentSearch });
        }
      }, 800);
    }
  });

  var skipBtn = document.getElementById('skip-to-cards');
  if (skipBtn) {
    skipBtn.addEventListener('click', function () {
      var target = document.querySelector('.filter-row');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  var etBtn = document.getElementById('et-toggle');
  if (etBtn) {
    etBtn.addEventListener('click', function () {
      var list = document.getElementById('et-card-list');
      var isOpen = list.classList.toggle('open');
      etBtn.textContent = isOpen ? 'Hide banned cards ▴' : 'See the banned cards ▾';
    });
  }
}
