/**
 * @file apps/web/src/lib/appearance-script.ts
 * @description Synchronous inline script preventing flash of unstyled theme on page load.
 * Runs in <head> before first paint.
 * @module @devlab/portal-web/lib/appearance-script
 */

export const appearanceScript = `
(function () {
  try {
    var root = document.documentElement;
    root.classList.add('portal-no-transition');

    var stored = localStorage.getItem('portal-theme') || 'dark';
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored === 'dark' || (stored === 'system' && prefersDark);

    root.setAttribute('data-brand', 'portal');
    root.setAttribute('data-theme', isDark ? 'portal-dark' : 'portal-light');

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.remove('portal-no-transition');
      });
    });
  } catch (e) {}
})();
`;
