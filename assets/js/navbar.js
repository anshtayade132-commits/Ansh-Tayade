/**
 * ============================================================================
 * ANSH TAYADE - NAVBAR CONTROLLER & SCROLL SPY
 * ============================================================================
 */

class NavbarController {
  constructor() {
    this.navbar = document.getElementById('main-navbar');
    this.mobileToggle = document.getElementById('mobile-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');

    if (!this.navbar) return;

    this.init();
  }

  init() {
    this.bindScroll();
    this.bindMobileMenu();
    this.bindScrollSpy();
    this.bindSmoothScroll();
  }

  bindScroll() {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  bindMobileMenu() {
    if (!this.mobileToggle || !this.navMenu) return;

    this.mobileToggle.addEventListener('click', () => {
      this.mobileToggle.classList.toggle('active');
      this.navMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking any nav link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.mobileToggle.classList.remove('active');
        this.navMenu.classList.remove('open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('open')) {
        this.mobileToggle.classList.remove('active');
        this.navMenu.classList.remove('open');
      }
    });
  }

  bindScrollSpy() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    this.sections.forEach(sec => observer.observe(sec));
  }

  bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#' || !targetId.startsWith('#')) return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 75;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new NavbarController());
} else {
  new NavbarController();
}
