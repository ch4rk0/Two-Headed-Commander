/* particles.js — hero canvas sparkles + mouse parallax + page-wide background */
(function () {
  'use strict';

  var _tickRAF     = null;
  var _parallaxRAF = null;

  window.destroyParticles = function () {
    if (_tickRAF)     { cancelAnimationFrame(_tickRAF);     _tickRAF     = null; }
    if (_parallaxRAF) { cancelAnimationFrame(_parallaxRAF); _parallaxRAF = null; }
  };

  /* ── PAGE-WIDE background particles ──────────────────────────── */

  var _pageTickRAF      = null;
  var _pageCanvas       = null;
  var _pageResizeHandler = null;

  window.destroyPageParticles = function () {
    if (_pageTickRAF) { cancelAnimationFrame(_pageTickRAF); _pageTickRAF = null; }
    if (_pageResizeHandler) { window.removeEventListener('resize', _pageResizeHandler); _pageResizeHandler = null; }
    if (_pageCanvas && _pageCanvas.parentNode) { _pageCanvas.parentNode.removeChild(_pageCanvas); }
    _pageCanvas = null;
  };

  window.initPageParticles = function () {
    destroyPageParticles();

    var canvas = document.createElement('canvas');
    canvas.id = 'page-particles';
    document.body.appendChild(canvas);
    _pageCanvas = canvas;

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0;

    var PALETTE = [
      [140, 100, 220],
      [168, 128, 248],
      [212, 176,  90],
      [240, 208, 112],
      [200, 165, 255],
      [248, 244, 255],
      [180,  60,  90],
    ];

    var COUNT = 55;
    var particles = [];

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(arr)  { return arr[Math.floor(Math.random() * arr.length)]; }

    function makeParticle(warmup) {
      var col = pick(PALETTE);
      return {
        x:     rand(0, W),
        y:     warmup ? rand(0, H) : H + rand(0, 30),
        r:     rand(0.4, 2.0),
        vx:    rand(-0.18, 0.18),
        vy:    -rand(0.12, 0.4),
        alpha: rand(0.04, 0.3),
        dA:    (Math.random() > 0.5 ? 1 : -1) * rand(0.001, 0.003),
        col:   col,
        glow:  Math.random() < 0.2,
      };
    }

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < COUNT; i++) particles.push(makeParticle(true));
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        p.x     += p.vx;
        p.y     += p.vy;
        p.alpha += p.dA;
        if (p.alpha < 0.03) { p.alpha = 0.03; p.dA *= -1; }
        if (p.alpha > 0.35) { p.alpha = 0.35; p.dA *= -1; }

        if (p.y < -12 || p.x < -20 || p.x > W + 20) {
          particles[i] = makeParticle(false);
          particles[i].x = rand(0, W);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        if (p.glow) {
          ctx.shadowBlur  = 7;
          ctx.shadowColor = 'rgba(' + p.col[0] + ',' + p.col[1] + ',' + p.col[2] + ',1)';
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(' + p.col[0] + ',' + p.col[1] + ',' + p.col[2] + ')';
        ctx.fill();
        ctx.restore();
      }

      _pageTickRAF = requestAnimationFrame(tick);
    }

    _pageResizeHandler = resize;
    window.addEventListener('resize', _pageResizeHandler);

    init();
    tick();
  };

  window.initParticles = function () {
    destroyParticles();

    var hero   = document.querySelector('section.hero');
    var canvas = document.getElementById('hero-particles');
    if (!hero || !canvas) return;

    var ctx = canvas.getContext('2d');
    var W = 0, H = 0;

    /* ── Colour palette ────────────────────────────────────────── */
    var PALETTE = [
      [140, 100, 220],   /* purple          */
      [168, 128, 248],   /* light purple    */
      [212, 176,  90],   /* gold            */
      [240, 208, 112],   /* light gold      */
      [200, 165, 255],   /* lavender        */
      [248, 244, 255],   /* near-white      */
      [180,  60,  90],   /* ember red       */
    ];

    var COUNT = 95;
    var particles = [];

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(arr)  { return arr[Math.floor(Math.random() * arr.length)]; }

    function makeParticle(warmup) {
      var col = pick(PALETTE);
      return {
        x:      rand(0, W),
        y:      warmup ? rand(0, H) : H + rand(0, 30),
        r:      rand(0.5, 2.6),
        vx:     rand(-0.22, 0.22),
        vy:     -rand(0.15, 0.5),
        alpha:  rand(0.06, 0.5),
        dA:     (Math.random() > 0.5 ? 1 : -1) * rand(0.0015, 0.004),
        col:    col,
        glow:   Math.random() < 0.28,
      };
    }

    function resize() {
      W = canvas.width  = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < COUNT; i++) particles.push(makeParticle(true));
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        p.x     += p.vx;
        p.y     += p.vy;
        p.alpha += p.dA;
        if (p.alpha < 0.04) { p.alpha = 0.04; p.dA *= -1; }
        if (p.alpha > 0.6)  { p.alpha = 0.6;  p.dA *= -1; }

        if (p.y < -12 || p.x < -20 || p.x > W + 20) {
          particles[i] = makeParticle(false);
          particles[i].x = rand(0, W);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        if (p.glow) {
          ctx.shadowBlur  = 9;
          ctx.shadowColor = 'rgba(' + p.col[0] + ',' + p.col[1] + ',' + p.col[2] + ',1)';
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(' + p.col[0] + ',' + p.col[1] + ',' + p.col[2] + ')';
        ctx.fill();
        ctx.restore();
      }

      _tickRAF = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);

    /* ── Mouse parallax ────────────────────────────────────────── */
    var chars   = document.querySelectorAll('.hero-char');
    var content = document.querySelector('.hero-content');
    var tx = 0, ty = 0;
    var cx = 0, cy = 0;

    document.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      if (e.clientY > rect.bottom + 60) return;
      tx = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
      ty = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;
    });

    function parallax() {
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;

      chars.forEach(function (el, i) {
        var dir = (i === 0) ? -1 : 1;
        el.style.transform =
          'translateX(' + (cx * dir * 18) + 'px) ' +
          'translateY(' + (cy * -10)      + 'px)';
      });

      if (content) {
        content.style.transform =
          'translateX(' + (cx * -6) + 'px) ' +
          'translateY(' + (cy * -4) + 'px)';
      }

      _parallaxRAF = requestAnimationFrame(parallax);
    }

    init();
    tick();
    parallax();
  };

}());
