/* cookie-consent.js — GDPR consent manager
   Blocks Google Analytics until the user explicitly accepts.
   Consent choice is stored in localStorage.
   Exposes window.showCookiePreferences() for the "Cookie Settings" footer link. */

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

  /* ── Modal overlay ──────────────────────────────────────────── */

  function injectBanner() {
    if (document.getElementById('cookie-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'cookie-overlay';

    var tFn = (typeof window.T === 'function') ? window.T : function (k) { return k; };

    overlay.innerHTML =
      '<div id="cookie-banner" role="dialog" aria-modal="true" aria-label="Cookie consent">' +
        '<div class="cookie-icon">🍪</div>' +
        '<h2 class="cookie-title">' + tFn('cookie.title') + '</h2>' +
        '<p class="cookie-body">' + tFn('cookie.desc') + '</p>' +
        '<p class="cookie-body">' + tFn('cookie.footer-note') + '</p>' +
        '<a href="privacy.html" class="cookie-link">' + tFn('cookie.privacy') + '</a>' +
        '<div class="cookie-actions">' +
          '<button id="cookie-decline" class="cookie-btn cookie-btn-decline">' + tFn('cookie.decline') + '</button>' +
          '<button id="cookie-accept"  class="cookie-btn cookie-btn-accept">'  + tFn('cookie.accept')  + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

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
      requestAnimationFrame(function () { overlay.classList.add('visible'); });
    });
  }

  function hideBanner() {
    var o = document.getElementById('cookie-overlay');
    if (!o) return;
    o.classList.remove('visible');
    setTimeout(function () { if (o.parentNode) o.parentNode.removeChild(o); }, 350);
  }

  /* ── Public API (footer "Cookie Settings" button) ───────────── */

  window.showCookiePreferences = function () {
    try { localStorage.removeItem(CONSENT_KEY); } catch (e) {}
    if (window._gaLoaded) {
      var tFn2 = (typeof window.T === 'function') ? window.T : function (k) { return k; };
      if (window.confirm(tFn2('cookie.reload-alert'))) {
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
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectBanner);
    } else {
      injectBanner();
    }
  }

}());
