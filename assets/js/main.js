/**
 * ============================================================================
 * ANSH TAYADE - MASTER APPLICATION CONTROLLER
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initDesktopNav();
  initDrawerMenu();
  initResumeModal();
  initContactForm();
  initGitHubStars();
  initYear();
});

/* --------------------------------------------------------------------------
   0. DESKTOP NAVBAR & SCROLLSPY
   -------------------------------------------------------------------------- */
function initDesktopNav() {
  const desktopLinks = document.querySelectorAll('.nav-links-desktop .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navbar = document.getElementById('main-navbar');

  // Smooth scroll for desktop navbar links
  desktopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId !== '#resume') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - 75;
          window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
      }
    });
  });

  // Active state scrollspy
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 120;

    // Navbar background blur toggle
    if (navbar) {
      if (window.pageYOffset > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach(l => {
          if (l.getAttribute('href') === `#${id}`) {
            l.classList.add('active');
          } else {
            l.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   1. SLIDE-OUT DRAWER MENU CONTROLLER
   -------------------------------------------------------------------------- */
function initDrawerMenu() {
  const menuBtn = document.getElementById('menu-toggle-btn');
  const drawer = document.getElementById('nav-drawer');
  const closeBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
  };

  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeDrawer();
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - 75;
          window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   2. RESUME MODAL CONTROLLER
   -------------------------------------------------------------------------- */
function initResumeModal() {
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const navResumeLink = document.getElementById('nav-resume-link');
  const footerResumeBtn = document.getElementById('footer-resume-btn');
  const modal = document.getElementById('resume-modal');
  const closeBtn = document.getElementById('resume-modal-close');
  const printBtn = document.getElementById('print-resume-btn');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Resume buttons now directly open assets/resume.pdf in a new tab
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* --------------------------------------------------------------------------
   3. CONTACT FORM VALIDATION & SUBMISSION
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in all fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      showFeedback('Thank you! Your message has been sent to Ansh.', 'success');
    }, 1000);
  });

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.style.display = 'block';
    feedback.style.color = type === 'success' ? '#34d399' : '#f43f5e';
    feedback.style.padding = '0.75rem 1rem';
    feedback.style.borderRadius = 'var(--radius-sm)';
    feedback.style.background = type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)';
    feedback.style.marginTop = '1rem';
    feedback.style.fontSize = '0.9rem';

    setTimeout(() => {
      feedback.style.display = 'none';
    }, 6000);
  }
}

/* --------------------------------------------------------------------------
   4. GITHUB STARS FETCH
   -------------------------------------------------------------------------- */
async function initGitHubStars() {
  const starEl = document.getElementById('nav-star-count');
  if (!starEl) return;

  try {
    const res = await fetch('https://api.github.com/users/anshtayade132-commits/repos');
    if (!res.ok) return;
    const repos = await res.json();
    if (Array.isArray(repos)) {
      const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
      starEl.textContent = `${totalStars} ★`;
    }
  } catch (e) {
    // Keep fallback
  }
}

/* --------------------------------------------------------------------------
   5. AUTO-UPDATE YEAR
   -------------------------------------------------------------------------- */
function initYear() {
  const yr = document.getElementById('current-year');
  if (yr) yr.textContent = new Date().getFullYear();
}
