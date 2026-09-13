/**
 * ============================================================================
 * ANSH TAYADE - COSMIC MOUSE CURSOR GLOW & INTERACTION CONTROLLER
 * ============================================================================
 * Creates a soft glowing cosmic orb that smoothly tracks the cursor with
 * inertia, expands on interactive element hover, and reacts on click.
 * ============================================================================
 */

class CosmicCursor {
  constructor() {
    // Only initialize on devices with fine pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    this.cursorGlow = null;
    this.cursorRing = null;
    this.cursorDot = null;

    // Position State
    this.mouse = { x: -100, y: -100 };
    this.glowPos = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.isVisible = false;
    this.isHovering = false;
    this.isClicking = false;
    this.lastParticleTime = 0;

    this.init();
  }

  init() {
    this.createElements();
    this.bindEvents();
    this.animate();
  }

  createElements() {
    this.cursorGlow = document.createElement('div');
    this.cursorGlow.className = 'cosmic-cursor-glow';
    this.cursorGlow.setAttribute('aria-hidden', 'true');

    this.cursorRing = document.createElement('div');
    this.cursorRing.className = 'cosmic-cursor-ring';
    this.cursorRing.setAttribute('aria-hidden', 'true');

    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'cosmic-cursor-dot';
    this.cursorDot.setAttribute('aria-hidden', 'true');

    document.body.appendChild(this.cursorGlow);
    document.body.appendChild(this.cursorRing);
    document.body.appendChild(this.cursorDot);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (!this.isVisible) {
        this.isVisible = true;
        this.cursorGlow.style.opacity = '1';
        this.cursorRing.style.opacity = '0.6';
        this.cursorDot.style.opacity = '1';
      }

      // Spawn subtle trailing starlight dust on mouse move (throttled to 60ms)
      const now = performance.now();
      if (now - this.lastParticleTime > 60 && Math.random() > 0.4) {
        this.spawnTrailParticle(e.clientX, e.clientY);
        this.lastParticleTime = now;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
      this.cursorGlow.style.opacity = '0';
      this.cursorRing.style.opacity = '0';
      this.cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      this.isVisible = true;
      this.cursorGlow.style.opacity = '1';
      this.cursorRing.style.opacity = '0.6';
      this.cursorDot.style.opacity = '1';
    });

    window.addEventListener('mousedown', () => {
      this.isClicking = true;
      this.cursorGlow.classList.add('cursor-click');
    });

    window.addEventListener('mouseup', () => {
      this.isClicking = false;
      this.cursorGlow.classList.remove('cursor-click');
    });

    // Detect hover over interactive elements
    const interactiveSelectors = 'a, button, input, textarea, select, .skill-card, .project-card, .tech-badge, .btn, .city-chip, .sql-query-chip, .carax-prompt-btn, .color-pick-btn, .modal-close, [role="button"]';

    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest(interactiveSelectors)) {
        this.isHovering = true;
        this.cursorGlow.classList.add('cursor-hover');
        this.cursorRing.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target && e.target.closest(interactiveSelectors)) {
        this.isHovering = false;
        this.cursorGlow.classList.remove('cursor-hover');
        this.cursorRing.classList.remove('cursor-hover');
      }
    });
  }

  spawnTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'cosmic-trail-particle';
    particle.style.left = `${x + (Math.random() * 12 - 6)}px`;
    particle.style.top = `${y + (Math.random() * 12 - 6)}px`;

    // Varying subtle colors
    const colors = ['#fb7185', '#f43f5e', '#38bdf8', '#c084fc'];
    const col = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = col;
    particle.style.boxShadow = `0 0 6px ${col}`;

    document.body.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 650);
  }

  animate() {
    if (this.isVisible) {
      // Fluid smooth momentum lerping
      // Glowing orb has soft graceful lag (factor 0.18)
      this.glowPos.x += (this.mouse.x - this.glowPos.x) * 0.18;
      this.glowPos.y += (this.mouse.y - this.glowPos.y) * 0.18;

      // Inner ring has slightly tighter lag (factor 0.28)
      this.ringPos.x += (this.mouse.x - this.ringPos.x) * 0.28;
      this.ringPos.y += (this.mouse.y - this.ringPos.y) * 0.28;

      // Update positions via hardware-accelerated 3D transforms
      this.cursorGlow.style.transform = `translate3d(${this.glowPos.x}px, ${this.glowPos.y}px, 0) translate(-50%, -50%)`;
      this.cursorRing.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0) translate(-50%, -50%)`;
      this.cursorDot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CosmicCursor());
} else {
  new CosmicCursor();
}
