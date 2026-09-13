/**
 * ============================================================================
 * ANSH TAYADE - CONVERTIBLE LIGHT / DARK THEME CONTROLLER
 * ============================================================================
 * Seamlessly transitions between Deep Space Dark Mode and Celestial Dawn Light Mode.
 * Persists user preference via localStorage.
 * ============================================================================
 */

class ThemeController {
  constructor() {
    this.STORAGE_KEY = 'ansh_portfolio_theme';
    this.toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    
    // Icons
    this.moonSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
    this.sunSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;

    this.init();
  }

  init() {
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // default dark galaxy theme

    this.applyTheme(initialTheme, false);

    this.toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme, true);
      });
    });
  }

  applyTheme(theme, animate = true) {
    if (animate) {
      document.documentElement.classList.add('theme-transitioning');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 350);
    }

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    // Update button icon & aria-label
    this.toggleBtns.forEach(btn => {
      btn.innerHTML = theme === 'dark' ? this.moonSvg : this.sunSvg;
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      btn.setAttribute('title', theme === 'dark' ? 'Toggle Light Mode' : 'Toggle Dark Mode');
    });

    // Notify Galaxy canvas if needed
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
  }
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ThemeController());
} else {
  new ThemeController();
}
