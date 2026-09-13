/**
 * ============================================================================
 * ANSH TAYADE - SPIRAL GALAXY & INTERACTIVE STARFIELD ENGINE
 * ============================================================================
 * Synchronizes with the grand-design spiral galaxy backdrop:
 * - Logarithmic spiral arm particle dynamics
 * - Luminous stellar core with golden/amber and blue-white stars
 * - Interactive mouse gravity & 3D parallax tilt
 * - Random shooting stars & meteor trails
 * - 60 FPS performance, tab visibility handling & mobile optimization
 * ============================================================================
 */

class SpiralGalaxyEngine {
  constructor() {
    this.canvas = document.getElementById('galaxy-canvas');
    this.galaxyBackdrop = document.querySelector('.spiral-galaxy-layer');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { alpha: true });

    // Canvas & Screen State
    this.width = 0;
    this.height = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Particle Collections
    this.spiralStars = [];
    this.backgroundStars = [];
    this.shootingStars = [];

    // State & Timers
    this.rotationAngle = 0;
    this.rotationSpeed = 0.0006;
    this.animationFrameId = null;
    this.isPaused = false;
    this.lastSpawnTime = Date.now();
    this.nextSpawnInterval = this.getRandomInterval();

    // Mouse Interaction State
    this.mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
      radius: 200,
      parallaxX: 0,
      parallaxY: 0
    };

    this.isMobile = window.innerWidth < 768;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  getRandomInterval() {
    return Math.floor(Math.random() * 4000) + 4000;
  }

  init() {
    this.resize();
    this.createGalaxyParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.isMobile = this.width < 768;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  createGalaxyParticles() {
    this.spiralStars = [];
    this.backgroundStars = [];

    const numArms = 3;
    const spiralCount = this.isMobile ? 350 : 850;
    const maxRadius = Math.min(this.width, this.height) * 0.48;

    // 1. Logarithmic Spiral Arm Stars (aligned with the photo's geometry)
    for (let i = 0; i < spiralCount; i++) {
      const armIndex = i % numArms;
      const armAngleOffset = (armIndex * (2 * Math.PI)) / numArms;

      // Distance from galactic center
      const distPercent = Math.pow(Math.random(), 1.5);
      const r = distPercent * maxRadius;

      // Logarithmic spiral angle theta = b * ln(r)
      const theta = 2.4 * Math.log(Math.max(r, 10) / 10) + armAngleOffset;

      // Random scatter around the arm width
      const scatter = (Math.random() - 0.5) * (r * 0.35 + 15);
      const scatterAngle = theta + Math.PI / 2;

      // Color temperature based on distance from core
      let colorPrefix;
      if (r < maxRadius * 0.22) {
        // Warm golden / amber core stars
        colorPrefix = Math.random() > 0.4 ? 'rgba(254, 243, 199,' : 'rgba(251, 191, 36,';
      } else if (r < maxRadius * 0.6) {
        // Neutral stellar white
        colorPrefix = 'rgba(241, 245, 249,';
      } else {
        // Outer arm young blue star clusters
        colorPrefix = Math.random() > 0.6 ? 'rgba(56, 189, 248,' : 'rgba(192, 132, 252,';
      }

      this.spiralStars.push({
        r: r,
        baseAngle: theta,
        scatterR: scatter,
        scatterAngle: scatterAngle,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        colorPrefix: colorPrefix,
        orbitSpeed: (0.0003 + (1 - distPercent) * 0.0004) * (this.prefersReducedMotion ? 0.2 : 1)
      });
    }

    // 2. Ambient Deep Space Background Stars
    const bgCount = this.isMobile ? 180 : 450;
    for (let j = 0; j < bgCount; j++) {
      this.backgroundStars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 0.9 + 0.3,
        alpha: Math.random() * 0.45 + 0.15,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }
  }

  spawnShootingStar() {
    const isMeteor = Math.random() > 0.8;
    const startX = Math.random() * (this.width * 0.8);
    const startY = Math.random() * (this.height * 0.3);
    const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1);
    const speed = isMeteor ? Math.random() * 12 + 20 : Math.random() * 8 + 14;
    const length = isMeteor ? Math.random() * 80 + 120 : Math.random() * 45 + 65;

    this.shootingStars.push({
      x: startX,
      y: startY,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      length: length,
      size: isMeteor ? 2.8 : 1.6,
      alpha: 1.0,
      decay: isMeteor ? 0.012 : 0.02,
      color: isMeteor ? '#fef08a' : '#e0f2fe',
      glowColor: isMeteor ? 'rgba(251, 191, 36, 0.6)' : 'rgba(56, 189, 248, 0.5)'
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createGalaxyParticles();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.active = true;

      // 3D Parallax offset for galaxy backdrop
      const normX = (e.clientX / this.width) - 0.5;
      const normY = (e.clientY / this.height) - 0.5;
      this.mouse.parallaxX = normX * -35;
      this.mouse.parallaxY = normY * -35;
    }, { passive: true });

    // Touch support for swiping/rotating on touchscreens
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0];
        if (this.lastMouseX !== null) {
          const deltaX = touch.clientX - this.lastMouseX;
          this.earthSpinVelocity += deltaX * 0.08;
          this.earthSpinVelocity = Math.max(Math.min(this.earthSpinVelocity, 5.0), -5.0);
        }
        this.lastMouseX = touch.clientX;
        this.lastMouseY = touch.clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.lastMouseX = null;
      this.lastMouseY = null;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.active = false;
      this.mouse.targetX = -9999;
      this.mouse.targetY = -9999;
      this.mouse.parallaxX = 0;
      this.mouse.parallaxY = 0;
      this.targetTiltX = 0;
      this.targetTiltY = 0;
      this.lastMouseX = null;
      this.lastMouseY = null;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isPaused = true;
        if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
      } else {
        this.isPaused = false;
        this.lastSpawnTime = Date.now();
        this.lastMouseX = null;
        this.lastMouseY = null;
        this.animate();
      }
    });
  }

  updateMouse() {
    if (this.mouse.active) {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.12;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.12;
    }

    // Apply smooth parallax shift to the photographic galaxy backdrop
    if (this.galaxyBackdrop) {
      this.galaxyBackdrop.style.transform = `translate(calc(-50% + ${this.mouse.parallaxX}px), calc(-50% + ${this.mouse.parallaxY}px))`;
    }
  }

  animate() {
    if (this.isPaused) return;

    this.updateMouse();
    this.render();

    // Check shooting star spawn
    const now = Date.now();
    if (now - this.lastSpawnTime > this.nextSpawnInterval) {
      this.spawnShootingStar();
      this.lastSpawnTime = now;
      this.nextSpawnInterval = this.getRandomInterval();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const now = performance.now() * 0.001;
    this.rotationAngle += this.rotationSpeed;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // 1. Render Distant Background Stars
    for (let k = 0; k < this.backgroundStars.length; k++) {
      const bg = this.backgroundStars[k];
      const twinkle = Math.sin(now * bg.twinkleSpeed * 100 + bg.twinkleOffset);
      const alpha = Math.max(0.08, bg.alpha + twinkle * 0.18);

      this.ctx.beginPath();
      this.ctx.arc(bg.x, bg.y, bg.size, 0, Math.PI * 2);
      this.ctx.fillStyle = isLight ? `rgba(2, 132, 199, ${alpha * 0.4})` : `rgba(255, 255, 255, ${alpha})`;
      this.ctx.fill();
    }

    // 2. Render Swirling Spiral / Orbital Particles
    const cx = this.centerX + this.mouse.parallaxX * 0.6;
    const cy = this.centerY + this.mouse.parallaxY * 0.6;

    for (let i = 0; i < this.spiralStars.length; i++) {
      const star = this.spiralStars[i];

      // Calculate galactic orbit rotation
      const angle = star.baseAngle + this.rotationAngle + (now * star.orbitSpeed);

      // Base coordinates from logarithmic spiral
      let px = cx + Math.cos(angle) * star.r + Math.cos(star.scatterAngle) * star.scatterR;
      let py = cy + Math.sin(angle) * star.r + Math.sin(star.scatterAngle) * star.scatterR;

      // Mouse gravity attraction
      if (this.mouse.active && !this.prefersReducedMotion) {
        const dx = this.mouse.x - px;
        const dy = this.mouse.y - py;
        const dist = Math.hypot(dx, dy);

        if (dist < this.mouse.radius && dist > 1) {
          const force = (1 - dist / this.mouse.radius) * 16;
          px += (dx / dist) * force;
          py += (dy / dist) * force;
        }
      }

      // Twinkle calculation
      const twinkle = Math.sin(now * star.twinkleSpeed * 100 + star.twinkleOffset);
      const alpha = Math.max(0.12, star.baseAlpha + twinkle * 0.25);

      this.ctx.beginPath();
      this.ctx.arc(px, py, star.size, 0, Math.PI * 2);
      
      let starColor = `${star.colorPrefix} ${alpha})`;
      if (isLight) {
        starColor = star.colorPrefix.includes('254') ? `rgba(245, 158, 11, ${alpha * 0.45})` : `rgba(14, 165, 233, ${alpha * 0.45})`;
      }
      this.ctx.fillStyle = starColor;
      this.ctx.fill();
    }

    // 3. Render Shooting Stars & Meteor Trails
    for (let j = this.shootingStars.length - 1; j >= 0; j--) {
      const ss = this.shootingStars[j];

      const tailX = ss.x - (ss.dx / Math.hypot(ss.dx, ss.dy)) * ss.length;
      const tailY = ss.y - (ss.dy / Math.hypot(ss.dx, ss.dy)) * ss.length;

      const grad = this.ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.7, isLight ? 'rgba(2, 132, 199, 0.4)' : ss.glowColor);
      grad.addColorStop(1, isLight ? '#0284c7' : ss.color);

      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(ss.x, ss.y);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = ss.size;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();

      // Glowing Head
      this.ctx.beginPath();
      this.ctx.arc(ss.x, ss.y, ss.size * 1.6, 0, Math.PI * 2);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fill();

      // Advance
      ss.x += ss.dx;
      ss.y += ss.dy;
      ss.alpha -= ss.decay;

      if (ss.alpha <= 0 || ss.x > this.width + 150 || ss.y > this.height + 150) {
        this.shootingStars.splice(j, 1);
      }
    }
  }
}

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SpiralGalaxyEngine());
} else {
  new SpiralGalaxyEngine();
}
