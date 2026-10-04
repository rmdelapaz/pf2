/* Pathfinder 2e Guide — shared theme handling.
   Load in <head> (render-blocking) so the saved theme applies before first paint.
   Wires the #theme-toggle button and fires a "themechange" event for diagrams. */
(function () {
  var KEY = 'pf2-theme';   // same key/values as the old per-page toggle, so saved choices carry over
  var root = document.documentElement;
  var osDark = function () { return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); };
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* storage blocked: follow the OS preference */ }
  // Always set data-theme explicitly so page scripts can read the current theme.
  root.setAttribute('data-theme', saved === 'light' || saved === 'dark' ? saved : (osDark() ? 'dark' : 'light'));

  function current() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function label() {
    var b = document.getElementById('theme-toggle');
    if (!b) return;
    var dark = current() === 'dark';
    b.textContent = dark ? '☀️' : '🌙';
    b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    b.setAttribute('aria-pressed', String(dark));
  }
  function toggle() {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* ignore */ }
    label();
    document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  }
  window.pf2Theme = current;
  window.toggleTheme = toggle;
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      var stored = null; try { stored = localStorage.getItem(KEY); } catch (e) { /* ignore */ }
      if (!stored) { root.setAttribute('data-theme', osDark() ? 'dark' : 'light'); label(); document.dispatchEvent(new CustomEvent('themechange', { detail: current() })); }
    });
  }
  // Hand-drawn canvases scale down with the page; below 75% their labels get
  // too small to read, so wide canvases scroll sideways at a readable size instead.
  var MIN_SCALE = 0.75;
  function fitCanvases() {
    var list = document.querySelectorAll('main canvas');
    for (var i = 0; i < list.length; i++) {
      var c = list[i], natural = c.width;
      if (!natural || c.closest('.hero-section')) continue;
      var wrap = c.parentElement && c.parentElement.hasAttribute('data-figure-scroll') ? c.parentElement : null;
      var host = wrap ? wrap.parentElement : c.parentElement;
      var cs = getComputedStyle(host);
      var avail = host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var needs = avail > 0 && avail / natural < MIN_SCALE;
      if (needs && !wrap) {
        wrap = document.createElement('div');
        wrap.setAttribute('data-figure-scroll', '');
        c.parentNode.insertBefore(wrap, c);
        wrap.appendChild(c);
        var hint = document.createElement('p');
        hint.className = 'diagram-hint';
        hint.textContent = '\u2194 This figure is wide \u2014 scroll sideways to see all of it.';
        wrap.parentNode.insertBefore(hint, wrap);
      }
      if (needs) { c.style.width = Math.round(natural * MIN_SCALE) + 'px'; c.style.maxWidth = 'none'; }
      else if (wrap) {
        c.style.width = ''; c.style.maxWidth = '';
        var h = wrap.previousElementSibling;
        if (h && h.classList.contains('diagram-hint')) h.remove();
        wrap.parentNode.insertBefore(c, wrap); wrap.remove();
      }
    }
  }
  var fitTimer;
  window.addEventListener('resize', function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitCanvases, 150); });

  document.addEventListener('DOMContentLoaded', function () {
    fitCanvases();
    label();
    var b = document.getElementById('theme-toggle');
    if (b) b.addEventListener('click', toggle);
  });
})();
