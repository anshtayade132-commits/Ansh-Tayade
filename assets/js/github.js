/**
 * ============================================================================
 * ANSH TAYADE - GITHUB API INTEGRATION & REPOSITORY SHOWCASE
 * ============================================================================
 */

class GitHubIntegration {
  constructor() {
    this.defaultUsername = 'anshtayade132-commits';
    this.currentUsername = this.defaultUsername;
    this.container = document.getElementById('github-repos-grid');
    this.avatarEl = document.getElementById('github-avatar');
    this.usernameEl = document.getElementById('github-username');
    this.bioEl = document.getElementById('github-bio');
    this.repoCountEl = document.getElementById('github-repo-count');
    this.followersEl = document.getElementById('github-followers');
    this.profileLinkEl = document.getElementById('github-profile-link');
    this.searchInput = document.getElementById('github-search-input');
    this.searchBtn = document.getElementById('github-search-btn');

    if (!this.container) return;

    this.init();
  }

  init() {
    this.fetchProfile(this.currentUsername);
    this.fetchRepos(this.currentUsername);
    this.bindEvents();
  }

  bindEvents() {
    if (this.searchBtn && this.searchInput) {
      this.searchBtn.addEventListener('click', () => {
        const u = this.searchInput.value.trim();
        if (u) {
          this.currentUsername = u;
          this.fetchProfile(u);
          this.fetchRepos(u);
        }
      });

      this.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.searchBtn.click();
        }
      });
    }
  }

  async fetchProfile(username) {
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) throw new Error('API Rate limit or user not found');
      const data = await res.json();
      this.updateProfileUI(data);
    } catch (err) {
      console.warn('[GitHub API] Using local profile fallback:', err.message);
      this.updateProfileUI({
        login: username,
        avatar_url: 'https://avatars.githubusercontent.com/u/261717323?v=4',
        html_url: `https://github.com/${username}`,
        bio: 'BCA Student | Python Developer | AI & Web Development Enthusiast',
        public_repos: 4,
        followers: 12
      });
    }
  }

  updateProfileUI(data) {
    if (this.avatarEl) this.avatarEl.src = data.avatar_url || 'https://avatars.githubusercontent.com/u/261717323?v=4';
    if (this.usernameEl) this.usernameEl.textContent = `@${data.login || this.currentUsername}`;
    if (this.bioEl) this.bioEl.textContent = data.bio || 'Building practical software with Python, databases & AI';
    if (this.repoCountEl) this.repoCountEl.textContent = data.public_repos ?? 4;
    if (this.followersEl) this.followersEl.textContent = data.followers ?? 12;
    if (this.profileLinkEl) this.profileLinkEl.href = data.html_url || `https://github.com/${this.currentUsername}`;
  }

  async fetchRepos(username) {
    this.container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-secondary);">
        <div style="display: inline-block; width: 24px; height: 24px; border: 2px solid var(--crimson-primary); border-top-color: transparent; border-radius: 50%; animation: soundWave 1s infinite linear;"></div>
        <p style="margin-top: 0.75rem; font-family: var(--font-mono); font-size: 0.85rem;">Querying cosmic GitHub telemetries...</p>
      </div>
    `;

    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      if (!res.ok) throw new Error('GitHub API rate limited');
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length > 0) {
        this.renderRepos(repos);
        return;
      }
      throw new Error('No public repos found');
    } catch (err) {
      console.warn('[GitHub API] Using authentic curated repositories fallback:', err.message);
      this.renderRepos(this.getFallbackRepos());
    }
  }

  renderRepos(repos) {
    this.container.innerHTML = repos.map(repo => {
      const langColor = this.getLanguageColor(repo.language);
      return `
        <article class="repo-card">
          <div class="repo-header">
            <h4 class="repo-name">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--crimson-primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" style="color: #ffffff;">${repo.name}</a>
            </h4>
            <span class="tech-badge" style="font-size: 0.7rem;">${repo.visibility || 'public'}</span>
          </div>
          <p class="repo-desc">${repo.description || 'Repository for practical software development and algorithms.'}</p>
          <div class="repo-footer">
            <span class="repo-lang">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${langColor};"></span>
              ${repo.language || 'Code'}
            </span>
            <div class="repo-meta">
              <span title="Stars" style="display: flex; align-items: center; gap: 3px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ${repo.stargazers_count ?? 0}
              </span>
              <span title="Forks" style="display: flex; align-items: center; gap: 3px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path><path d="M12 12v3"></path></svg>
                ${repo.forks_count ?? 0}
              </span>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  getLanguageColor(lang) {
    const colors = {
      'Python': '#3572A5',
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'C++': '#f34b7d',
      'C': '#555555',
      'SQL': '#e38c00',
      'MySQL': '#00758f'
    };
    return colors[lang] || '#38bdf8';
  }

  getFallbackRepos() {
    return [
      {
        name: "weather-app",
        html_url: "https://github.com/anshtayade132-commits/weather-app",
        description: "A beginner-friendly weather application built with Python, Tkinter, and OpenWeatherMap API that displays live weather data, weather icons, and real-time clock.",
        language: "Python",
        stargazers_count: 3,
        forks_count: 1,
        visibility: "public"
      },
      {
        name: "carax-voice-assistant",
        html_url: "https://github.com/anshtayade132-commits",
        description: "Intelligent desktop voice assistant engineered in Python utilizing speech recognition, pyttsx3, and API automation pipelines.",
        language: "Python",
        stargazers_count: 5,
        forks_count: 2,
        visibility: "public"
      },
      {
        name: "gesture-3d-drawing",
        html_url: "https://github.com/anshtayade132-commits",
        description: "Computer vision interactive spatial drawing application using OpenCV, MediaPipe hand landmark tracking, and canvas rendering.",
        language: "Python",
        stargazers_count: 7,
        forks_count: 3,
        visibility: "public"
      },
      {
        name: "mysql-enterprise-systems",
        html_url: "https://github.com/anshtayade132-commits",
        description: "Relational database schema architectures, 3NF normalization models, transaction logging triggers, and complex grouping joins in MySQL.",
        language: "SQL",
        stargazers_count: 4,
        forks_count: 1,
        visibility: "public"
      }
    ];
  }
}

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new GitHubIntegration());
} else {
  new GitHubIntegration();
}
