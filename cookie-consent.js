/* cookie-consent.js — GDPR consent manager
   Blocks Google Analytics until the user explicitly accepts.
   Consent choice is stored in localStorage.
   Expose window.showCookiePreferences() for the "Cookie Settings" footer link. */

(function () {
  'use strict';

  var GA_ID       = 'G-T25XEGD3QJ';
  var CONSENT_KEY = 'thc_cookie_consent'; /* 'accepted' | 'declined' */

  /* ── GA loader ──────────────────────────────────────────────── */

  function loadGA() {
    if (window._gaLoaded) return;
    window._gaLoaded = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  /* ── Consent storage ────────────────────────────────────────── */

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  /* ── Banner ─────────────────────────────────────────────────── */

  function injectBanner() {
    if (document.getElementById('cookie-banner')) return;

    var div = document.createElement('div');
    div.id = 'cookie-banner';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', 'Cookie consent');
    div.innerHTML =
      '<div class="cookie-inner">' +
        '<div class="cookie-text">' +
          '<strong>Cookie notice</strong> — ' +
          'We use Google Analytics to understand how visitors use this site. ' +
          'No data is collected until you accept. ' +
          '<a href="privacy.html" class="cookie-link">Privacy Policy</a>' +
        '</div>' +
        '<div class="cookie-actions">' +
          '<button id="cookie-decline" class="cookie-btn cookie-btn-decline">Decline</button>' +
          '<button id="cookie-accept"  class="cookie-btn cookie-btn-accept">Accept analytics</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(div);

    document.getElementById('cookie-accept').addEventListener('click', function () {
      setConsent('accepted');
      hideBanner();
      loadGA();
    });

    document.getElementById('cookie-decline').addEventListener('click', function () {
      setConsent('declined');
      hideBanner();
    });

    /* Animate in on next paint */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { div.classList.add('visible'); });
    });
  }

  function hideBanner() {
    var b = document.getElementById('cookie-banner');
    if (!b) return;
    b.classList.remove('visible');
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 400);
  }

  /* ── Public API (used by footer "Cookie Settings" button) ───── */

  window.showCookiePreferences = function () {
    /* Clear stored choice so the banner re-asks */
    try { localStorage.removeItem(CONSENT_KEY); } catch (e) {}
    /* If GA was loaded this session, flag it so the user knows a reload is needed */
    if (window._gaLoaded) {
      var note = 'Google Analytics was already loaded this session. ' +
                 'To stop data collection, please reload the page after declining.';
      if (window.confirm(note + '\n\nClick OK to reload now.')) {
        location.reload();
        return;
      }
    }
    injectBanner();
  };

  /* ── Init ───────────────────────────────────────────────────── */

  var consent = getConsent();

  if (consent === 'accepted') {
    loadGA();
  } else if (consent !== 'declined') {
    /* No decision yet — show banner once DOM is ready */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectBanner);
    } else {
      injectBanner();
    }
  }

}());
