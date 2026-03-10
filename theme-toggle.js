// ── THEME TOGGLE ──
// Reads preference from localStorage, falls back to system preference, defaults to dark.
(function () {
  const STORAGE_KEY = 'heroes-theme';

  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function apply(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Apply immediately (script should be in <head> or early in <body>)
  const initial = getPreferred();
  apply(initial);

  // Expose toggle for the button
  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    apply(next);
    localStorage.setItem(STORAGE_KEY, next);
  };
})();
