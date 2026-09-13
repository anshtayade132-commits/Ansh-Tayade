/**
 * ============================================================================
 * ANSH TAYADE - PROJECTS RENDERER (ONLY CARAX ASSISTANT & WEATHER APP)
 * ============================================================================
 */

class ProjectsController {
  constructor() {
    this.container = document.getElementById('projects-container');
    this.modal = document.getElementById('demo-modal');
    this.modalBody = document.getElementById('demo-modal-body');
    this.modalTitle = document.getElementById('demo-modal-title');
    this.modalClose = document.getElementById('demo-modal-close');

    if (!this.container) return;

    this.init();
  }

  init() {
    this.render();
    this.bindModalEvents();
  }

  render() {
    const data = window.projectsData || [];

    this.container.innerHTML = data.map(project => `
      <article class="clean-project-card" data-id="${project.id}">
        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-shot-wrapper" title="Open ${project.title} repository on GitHub">
          <img src="${project.image}" alt="${project.title}" loading="lazy">
        </a>
        <div class="project-meta-box">
          <span class="project-badge-tag">${project.badge}</span>
          <h3 class="project-heading">
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-title-link" title="Open repository on GitHub">
              ${project.title}
              <svg class="inline-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
          </h3>
          <p class="project-summary">${project.description}</p>
          <div class="project-tech-pills">
            ${project.technologies.map(tech => `
              <a href="${tech.url || 'https://github.com/anshtayade132-commits'}" target="_blank" rel="noopener noreferrer" class="tech-tag" title="Documentation for ${tech.name || tech}">
                ${tech.name || tech}
                <span style="opacity: 0.45; font-size: 0.72rem;">↗</span>
              </a>
            `).join('')}
          </div>
          <div class="project-actions">
            <button class="btn-resume-white launch-demo-btn" data-id="${project.id}" style="padding: 0.6rem 1.4rem; font-size: 0.9rem;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Live Demo
            </button>
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-hire-me" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              View Code
            </a>
          </div>
        </div>
      </article>
    `).join('');

    this.bindDemoButtons();
  }

  bindDemoButtons() {
    const buttons = document.querySelectorAll('.launch-demo-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openDemoModal(id);
      });
    });
  }

  bindModalEvents() {
    if (!this.modal) return;

    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeDemoModal());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeDemoModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('open')) {
        this.closeDemoModal();
      }
    });
  }

  openDemoModal(projectId) {
    const project = (window.projectsData || []).find(p => p.id === projectId);
    if (!project) return;

    this.modalTitle.textContent = `${project.title} — Interactive Preview`;
    this.modalBody.innerHTML = this.getDemoContent(project);
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    this.initDemoInteractions(project);
  }

  closeDemoModal() {
    this.modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  getDemoContent(project) {
    if (project.demoType === 'weather') {
      return `
        <div style="padding: 1rem 0;">
          <div style="margin-bottom: 1.5rem; display: flex; gap: 0.75rem;">
            <input type="text" id="demo-weather-input" class="clean-input" placeholder="Search city (e.g. Mumbai, Tokyo, London)..." value="London">
            <button id="demo-weather-btn" class="btn-resume-white" style="padding: 0.6rem 1.4rem; white-space: nowrap;">Search</button>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
            <button class="tech-tag city-chip" data-city="Mumbai" style="cursor: pointer;">Mumbai</button>
            <button class="tech-tag city-chip" data-city="Tokyo" style="cursor: pointer;">Tokyo</button>
            <button class="tech-tag city-chip" data-city="London" style="cursor: pointer;">London</button>
            <button class="tech-tag city-chip" data-city="New York" style="cursor: pointer;">New York</button>
          </div>
          <div style="padding: 2rem; border-radius: var(--radius-md); background: rgba(14, 19, 34, 0.9); border: 1px solid var(--border-subtle); text-align: center;">
            <h4 id="demo-weather-city" style="font-family: var(--font-display); font-size: 1.4rem; color: #fff; margin-bottom: 0.5rem;">LONDON</h4>
            <div id="demo-weather-temp" style="font-family: var(--font-display); font-size: 3.5rem; font-weight: 800; color: #38bdf8; margin-bottom: 0.5rem;">18°C</div>
            <p id="demo-weather-cond" style="color: var(--text-secondary); margin-bottom: 1.25rem;">Scattered Clouds</p>
            <div style="display: flex; justify-content: center; gap: 2.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary);">
              <div>Humidity: <span id="demo-weather-hum" style="color: #fff;">68%</span></div>
              <div>Wind: <span id="demo-weather-wind" style="color: #fff;">14 km/h</span></div>
              <div>API: <span style="color: #34d399;">OpenWeatherMap</span></div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="padding: 1rem 0;">
          <div style="text-align: center; margin-bottom: 1.75rem;">
            <div style="width: 70px; height: 70px; border-radius: 50%; margin: 0 auto 1rem; background: #e11d48; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 25px rgba(225, 29, 72, 0.6);">
              <span style="font-size: 2rem;">🎙️</span>
            </div>
            <h4 style="font-family: var(--font-display); font-size: 1.3rem; color: #fff;">Carax Voice Assistant</h4>
            <p style="color: var(--text-secondary); font-size: 0.88rem; margin-top: 0.35rem;">Click a vocal prompt to test assistant responses:</p>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem;">
            <button class="btn-hire-me carax-prompt-btn" data-cmd="weather">"What's the weather?"</button>
            <button class="btn-hire-me carax-prompt-btn" data-cmd="time">"What time is it?"</button>
            <button class="btn-hire-me carax-prompt-btn" data-cmd="system">"System diagnostics"</button>
            <button class="btn-hire-me carax-prompt-btn" data-cmd="github">"Open Ansh's GitHub"</button>
          </div>
          <div id="carax-output" style="padding: 1.25rem; border-radius: var(--radius-sm); background: #03050c; border: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 0.85rem; color: #38bdf8;">
            [Carax] Ready for voice commands. Select a prompt above.
          </div>
        </div>
      `;
    }
  }

  initDemoInteractions(project) {
    if (project.demoType === 'weather') {
      const input = document.getElementById('demo-weather-input');
      const btn = document.getElementById('demo-weather-btn');
      const cityEl = document.getElementById('demo-weather-city');
      const tempEl = document.getElementById('demo-weather-temp');
      const condEl = document.getElementById('demo-weather-cond');
      const humEl = document.getElementById('demo-weather-hum');
      const windEl = document.getElementById('demo-weather-wind');

      const mockData = {
        'london': { temp: '18°C', cond: 'Scattered Clouds', hum: '68%', wind: '14 km/h' },
        'mumbai': { temp: '31°C', cond: 'Sunny / Warm', hum: '76%', wind: '18 km/h' },
        'tokyo': { temp: '22°C', cond: 'Clear Sky', hum: '54%', wind: '9 km/h' },
        'new york': { temp: '24°C', cond: 'Partly Cloudy', hum: '62%', wind: '16 km/h' }
      };

      const updateWeather = (query) => {
        const q = (query || 'London').toLowerCase().trim();
        const data = mockData[q] || {
          temp: `${Math.floor(Math.random() * 12 + 18)}°C`,
          cond: 'Clear Sky',
          hum: `${Math.floor(Math.random() * 30 + 50)}%`,
          wind: `${Math.floor(Math.random() * 15 + 8)} km/h`
        };

        cityEl.textContent = query.toUpperCase();
        tempEl.textContent = data.temp;
        condEl.textContent = data.cond;
        humEl.textContent = data.hum;
        windEl.textContent = data.wind;
      };

      if (btn && input) {
        btn.addEventListener('click', () => updateWeather(input.value));
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') updateWeather(input.value);
        });
      }

      document.querySelectorAll('.city-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const c = chip.getAttribute('data-city');
          if (input) input.value = c;
          updateWeather(c);
        });
      });
    } else {
      const output = document.getElementById('carax-output');
      const promptButtons = document.querySelectorAll('.carax-prompt-btn');

      const responses = {
        'weather': "[Carax] Current temperature is 24°C with pleasant skies.",
        'time': `[Carax] The current standard time is ${new Date().toLocaleTimeString()}.`,
        'system': "[Carax] System core operational. Python audio pipelines online.",
        'github': "[Carax] Opening Ansh's repository: github.com/anshtayade132-commits"
      };

      promptButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const cmd = btn.getAttribute('data-cmd');
          output.innerHTML = `<span style="color: #fb7185;">[User Voice Input]</span> "${btn.textContent.replace(/"/g, '')}"<br><br>${responses[cmd] || '[Carax] Command recognized.'}`;
        });
      });
    }
  }
}

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ProjectsController());
} else {
  new ProjectsController();
}
