/**
 * ============================================================================
 * ANSH TAYADE - PROJECTS RENDERER
 * ============================================================================
 * Dynamically renders the featured project cards with direct GitHub repository
 * links, technology badges, descriptions, and interactive preview support.
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
            ${project.hasDemo ? `
              <button class="btn-resume-white launch-demo-btn" data-id="${project.id}" style="padding: 0.6rem 1.4rem; font-size: 0.9rem;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Live Demo
              </button>
            ` : ''}
            <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn-resume-white" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; padding: 0.6rem 1.4rem; font-size: 0.9rem;">
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
    this.modalBody.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: var(--text-secondary);">Direct source code available on GitHub.</div>`;
    this.modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeDemoModal() {
    this.modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ProjectsController());
} else {
  new ProjectsController();
}
