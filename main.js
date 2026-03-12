/* ════════════════════════════════════════════════════════════════
   main.js — initialisation
   Load order: banned-cards.js → content.js → cards.js → filters.js → main.js
   ════════════════════════════════════════════════════════════════ */

// 1. Render all static section content (text, tiles, manifestos, filter UI)
renderHero();
renderHowToPlay();
renderDifferences();
renderLgs();
renderBanned();          // also injects #banned-grid, filter buttons, #card-search
renderWatchlistSection(); // also injects #watchlist-grid

// 2. Render dynamic card grids (must run after renderBanned / renderWatchlistSection)
renderCards(CARDS);
renderWatchlist();

// 3. Wire up filter buttons and search (must run after renderBanned)
initFilters();
