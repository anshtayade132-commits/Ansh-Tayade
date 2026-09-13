/**
 * ============================================================================
 * ANSH TAYADE - 3D INTERACTIVE TECH KEYPAD
 * ============================================================================
 * Interactive 3D isometric mechanical macropad featuring Ansh's core tech stack:
 * Python, MySQL, SQL, Git, GitHub, Tkinter, APIs, Terminal, etc.
 * Features realistic 3D press physics and synthesized mechanical click sounds!
 * ============================================================================
 */

class TechKeypad {
  constructor() {
    this.container = document.getElementById('tech-keypad-container');
    if (!this.container) return;

    this.audioCtx = null;
    this.keys = [
      { id: 'py', label: 'Python', color: '#3b82f6', icon: '🐍', sub: 'Core' },
      { id: 'sql', label: 'SQL', color: '#f59e0b', icon: '🗄️', sub: 'Queries' },
      { id: 'mysql', label: 'MySQL', color: '#06b6d4', icon: '🐬', sub: 'RDBMS' },
      { id: 'tk', label: 'Tkinter', color: '#8b5cf6', icon: '🖥️', sub: 'GUI' },
      { id: 'git', label: 'Git', color: '#f97316', icon: '🔀', sub: 'VCS' },
      { id: 'gh', label: 'GitHub', color: '#334155', icon: '🐙', sub: 'Repos' },
      { id: 'api', label: 'APIs', color: '#ec4899', icon: '⚡', sub: 'REST' },
      { id: 'sh', label: 'Bash', color: '#10b981', icon: '💻', sub: 'CLI' },
      { id: 'carax', label: 'Carax', color: '#e11d48', icon: '🎙️', sub: 'Voice' },
      { id: 'wthr', label: 'Weather', color: '#0ea5e9', icon: '⛅', sub: 'App' },
      { id: 'bca', label: 'BCA', color: '#6366f1', icon: '🎓', sub: 'Degree' },
      { id: 'code', label: 'Clean', color: '#14b8a6', icon: '✨', sub: 'Code' }
    ];

    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="keypad-perspective-box">
        <div class="keypad-chassis" id="keypad-chassis">
          <div class="keypad-grid">
            ${this.keys.map((key, i) => `
              <div class="keycap" data-key="${key.id}" title="${key.label} (${key.sub}) — Click to jump" role="button" tabindex="0" style="--key-accent: ${key.color}; --key-index: ${i}; cursor: pointer;">
                <div class="keycap-top">
                  <span class="keycap-icon">${key.icon}</span>
                  <span class="keycap-label">${key.label}</span>
                  <span class="keycap-sub">${key.sub}</span>
                </div>
                <div class="keycap-side-front"></div>
                <div class="keycap-side-right"></div>
              </div>
            `).join('')}
          </div>
          <div class="keypad-chassis-rim"></div>
          <div class="keypad-status-glow"></div>
        </div>
      </div>
    `;
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
  }

  playKeyClick() {
    try {
      this.initAudio();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Synthesize realistic mechanical switch tactile thud & click
      const now = this.audioCtx.currentTime;

      // Click transient
      const clickOsc = this.audioCtx.createOscillator();
      const clickGain = this.audioCtx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1400, now);
      clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      clickGain.gain.setValueAtTime(0.12, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      clickOsc.connect(clickGain);
      clickGain.connect(this.audioCtx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.05);

      // Thud resonance
      const thudOsc = this.audioCtx.createOscillator();
      const thudGain = this.audioCtx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(120, now);
      thudOsc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

      thudGain.gain.setValueAtTime(0.18, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      thudOsc.connect(thudGain);
      thudGain.connect(this.audioCtx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.085);
    } catch (e) {
      // Audio fallback silent
    }
  }

  bindEvents() {
    const keycaps = document.querySelectorAll('.keycap');
    const chassis = document.getElementById('keypad-chassis');

    keycaps.forEach(cap => {
      cap.addEventListener('click', () => {
        this.pressKeycap(cap);
      });
    });

    // 3D Mouse Parallax tilt on the chassis
    const box = document.querySelector('.keypad-perspective-box');
    if (box && chassis) {
      box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        chassis.style.transform = `rotateX(${45 - y * 18}deg) rotateZ(${-25 + x * 18}deg) rotateY(${x * 12}deg)`;
      });

      box.addEventListener('mouseleave', () => {
        chassis.style.transform = 'rotateX(45deg) rotateZ(-25deg) rotateY(0deg)';
      });
    }

    // Physical keyboard listener: press key on keyboard to trigger random keycap!
    window.addEventListener('keydown', (e) => {
      // Ignore if user is typing in form inputs
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      const randomIdx = Math.floor(Math.random() * keycaps.length);
      const cap = keycaps[randomIdx];
      if (cap) {
        this.pressKeycap(cap);
      }
    });
  }

  pressKeycap(cap) {
    this.playKeyClick();
    cap.classList.add('pressed');
    setTimeout(() => {
      cap.classList.remove('pressed');
    }, 160);

    const keyId = cap.getAttribute('data-key');
    if (keyId) {
      this.handleKeyAction(keyId);
    }
  }

  handleKeyAction(keyId) {
    switch (keyId) {
      case 'py':
      case 'sql':
      case 'mysql':
      case 'git':
      case 'sh': {
        const el = document.getElementById('skills');
        if (el) {
          const topPos = el.getBoundingClientRect().top + window.pageYOffset - 75;
          window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
        break;
      }
      case 'gh': {
        window.open('https://github.com/anshtayade132-commits', '_blank', 'noopener,noreferrer');
        break;
      }
      case 'carax': {
        const el = document.getElementById('projects');
        if (el) {
          const topPos = el.getBoundingClientRect().top + window.pageYOffset - 75;
          window.scrollTo({ top: topPos, behavior: 'smooth' });
          setTimeout(() => {
            const btn = document.querySelector('.launch-demo-btn[data-id="carax-voice-assistant"]');
            if (btn) btn.click();
          }, 450);
        }
        break;
      }
      case 'wthr':
      case 'tk':
      case 'api': {
        const el = document.getElementById('projects');
        if (el) {
          const topPos = el.getBoundingClientRect().top + window.pageYOffset - 75;
          window.scrollTo({ top: topPos, behavior: 'smooth' });
          if (keyId === 'wthr' || keyId === 'tk') {
            setTimeout(() => {
              const btn = document.querySelector('.launch-demo-btn[data-id="weather-app"]');
              if (btn) btn.click();
            }, 450);
          }
        }
        break;
      }
      case 'bca': {
        const resumeBtn = document.getElementById('hero-resume-btn');
        if (resumeBtn) resumeBtn.click();
        break;
      }
      case 'code': {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      }
    }
  }
}

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new TechKeypad());
} else {
  new TechKeypad();
}
