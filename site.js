/* =====================================================================
   Gitly site — theme / accent / glow (same model as the app's Settings),
   heatmap mocks, nav highlighting and section reveals.
   ===================================================================== */
(function () {
  'use strict';

  var LS = { theme: 'gitly-site-theme', accent: 'gitly-site-accent', glow: 'gitly-site-glow', chosen: 'gitly-site-theme-chosen' };

  /* system dark-mode detection — used until the visitor picks a theme */
  var mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function systemTheme() { return (mql && mql.matches) ? 'dark' : ''; }

  /* ---------- theme ---------- */
  function applyTheme(mode, chosen) {
    document.body.classList.remove('dark', 'pitch');
    if (mode === 'dark') document.body.classList.add('dark');
    if (mode === 'pitch') document.body.classList.add('pitch');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'pitch' ? '#000000' : mode === 'dark' ? '#161719' : '#F2F2F2');
    var segs = document.querySelectorAll('#themeSeg .segb');
    segs.forEach(function (b) {
      b.classList.toggle('on', (b.dataset.theme || '') === (mode || ''));
    });
    try {
      localStorage.setItem(LS.theme, mode || '');
      if (chosen) localStorage.setItem(LS.chosen, '1');
    } catch (e) {}
  }

  /* ---------- accent ---------- */
  function applyAccent(name) {
    if (name !== 'custom') document.documentElement.setAttribute('data-accent', name);
    document.querySelectorAll('#accentRow .accentdot').forEach(function (d) {
      d.classList.toggle('on', d.dataset.accent === name);
    });
    try { localStorage.setItem(LS.accent, name); } catch (e) {}
  }

  /* ---------- glow ---------- */
  function applyGlow(on) {
    if (on) document.documentElement.removeAttribute('data-glow');
    else document.documentElement.setAttribute('data-glow', 'off');
    var sw = document.getElementById('glowSwitch');
    if (sw) { sw.classList.toggle('on', !!on); sw.setAttribute('aria-checked', on ? 'true' : 'false'); }
    document.body.classList.toggle('navglow', !!on);
    try { localStorage.setItem(LS.glow, on ? '1' : '0'); } catch (e) {}
  }

  /* ---------- restore ----------
     Priority: ?theme=dark|pitch URL param > the visitor's saved choice >
     the system preference (dark / light), live-followed until they pick.
     Params also make links pre-themed. */
  var qp = new URLSearchParams(location.search);
  var savedAccent = qp.get('accent') || 'blue';
  var savedGlow = qp.has('glow') ? (qp.get('glow') === '0' ? '0' : '1') : '1';
  var hasChosen = false, savedTheme = systemTheme();
  try {
    if (!qp.has('theme')) {
      hasChosen = localStorage.getItem(LS.chosen) === '1';
      savedTheme = hasChosen ? (localStorage.getItem(LS.theme) || '') : systemTheme();
    } else { savedTheme = qp.get('theme'); }
    if (!qp.has('accent')) savedAccent = localStorage.getItem(LS.accent) || savedAccent;
    if (!qp.has('glow')) savedGlow = localStorage.getItem(LS.glow) !== '0' ? '1' : '0';
  } catch (e) { if (qp.has('theme')) savedTheme = qp.get('theme'); }
  applyTheme(savedTheme);
  applyAccent(savedAccent);
  applyGlow(savedGlow === '1');

  /* while the visitor hasn't made an explicit choice, follow the OS in real time */
  if (mql && mql.addEventListener && !qp.has('theme')) {
    var followTimer = null;
    mql.addEventListener('change', function () {
      var chose = false;
      try { chose = localStorage.getItem(LS.chosen) === '1'; } catch (e) {}
      if (chose) return;
      clearTimeout(followTimer);
      followTimer = setTimeout(function () { applyTheme(systemTheme()); }, 60);
    });
  }

  /* ---------- wire controls ---------- */
  document.querySelectorAll('#themeSeg .segb').forEach(function (b) {
    b.addEventListener('click', function () { applyTheme(b.dataset.theme || '', true); });
  });
  document.querySelectorAll('#accentRow .accentdot').forEach(function (d) {
    d.addEventListener('click', function () { applyAccent(d.dataset.accent); });
  });
  var glowSwitch = document.getElementById('glowSwitch');
  if (glowSwitch) {
    var toggleGlow = function () { applyGlow(!glowSwitch.classList.contains('on')); };
    glowSwitch.addEventListener('click', toggleGlow);
    glowSwitch.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGlow(); }
    });
  }

  /* topbar sun button cycles light -> dark -> pitch */
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var order = ['', 'dark', 'pitch'];
      var cur = document.body.classList.contains('pitch') ? 'pitch'
        : document.body.classList.contains('dark') ? 'dark' : '';
      applyTheme(order[(order.indexOf(cur) + 1) % order.length], true);
    });
  }

  /* ---------- heatmap mocks (deterministic so they look composed) ---------- */
  document.querySelectorAll('.heatwrap').forEach(function (wrap) {
    var weeks = parseInt(wrap.dataset.heat || '20', 10);
    var frag = document.createDocumentFragment();
    var seed = 7;
    function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    for (var w = 0; w < weeks; w++) {
      var col = document.createElement('div');
      col.className = 'heatcol';
      for (var d = 0; d < 7; d++) {
        var cell = document.createElement('div');
        cell.className = 'heatcell';
        var r = rnd();
        if (r > .82) cell.classList.add('l4');
        else if (r > .68) cell.classList.add('l3');
        else if (r > .52) cell.classList.add('l2');
        else if (r > .36) cell.classList.add('l1');
        col.appendChild(cell);
      }
      frag.appendChild(col);
    }
    wrap.appendChild(frag);
  });

  /* ---------- active nav link while scrolling ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.tnavlink'));
  var sections = links.map(function (l) { return document.querySelector(l.getAttribute('href')); });
  function updateNav() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var best = -1;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) best = i; });
    links.forEach(function (l, i) { l.classList.toggle('active', i === best); });
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---------- section reveals (the app's rise animation) ----------
     ?noreveal skips the animation (used for testing / full-page renders) */
  var toReveal = document.querySelectorAll('section .wrap > *');
  var noReveal = /noreveal/.test(location.search);
  if (noReveal) { /* static mode: leave content visible */ }
  else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    toReveal.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.animationDelay = (Math.min(i, 5) * 0.05) + 's';
      io.observe(el);
    });
  }
})();
