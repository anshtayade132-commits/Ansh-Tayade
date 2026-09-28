# 🌌 Ansh Tayade — Developer Portfolio & Interactive 3D Experience

[![Live Demo](https://img.shields.io/badge/Live%20Demo-anshtayade.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://anshtayade.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-anshtayade132--commits-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/anshtayade132-commits)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)

A modern, high-performance personal developer portfolio featuring an interactive deep-space galaxy particle engine, a fully rotatable 3D Earth experience in light mode, live project showcases, direct resume access, and real-time GitHub REST API integration.

🔗 **Live Website:** [https://anshtayade.netlify.app/](https://anshtayade.netlify.app/)

---

## ✨ Features & Highlights

- **🌌 Dual Celestial Themes**:
  - **Dark Mode (Galaxy View)**: Deep-space canvas physics with real-time starfield simulation, mouse cursor gravitational pull, shooting stars, meteor trails, and glowing nebula clouds.
  - **Light Mode (3D Earth View)**: Photorealistic 3D interactive Earth globe supporting full-angle cursor-tracking rotation (up, down, front, back, and 360° spin).
- **💼 Engineering Projects Showcase**:
  - **[Face Recognition System](https://github.com/anshtayade132-commits/Face-Recognition-System)**: Real-time biometric facial detection, webcam capture registration, 128-d facial embeddings, and MySQL database identity verification.
  - **[Carax Voice Assistant](https://github.com/anshtayade132-commits)**: Desktop voice automation assistant handling speech-to-text, command execution, and synthesized vocal responses.
  - **[Weather App](https://github.com/anshtayade132-commits/weather-app)**: Live atmospheric telemetry application powered by OpenWeatherMap API with temperature, humidity, and wind metrics.
- **📄 Integrated Resume Access**: One-click in-browser preview and high-resolution PDF download for official developer credentials.
- **🐙 Live GitHub Synchronization**: Directly interfaces with the GitHub REST API (`anshtayade132-commits`) to display real-time repositories, stars, forks, and language badges with offline fallback caching.
- **⚡ Pure Vanilla Architecture**: Built with zero heavy framework bloat using HTML5, CSS3 Glassmorphism, and Vanilla JavaScript for instant 60 FPS load times.

---

## 🚀 Local Development

### Prerequisites
- Python 3.x (or any static local server)
- Modern web browser (Chrome, Edge, Firefox, Brave, Safari)

### Quick Start
1. **Clone the repository:**
   ```bash
   git clone https://github.com/anshtayade132-commits/Ansh-Tayade.git
   cd Ansh-Tayade
   ```

2. **Launch the local development server:**
   ```powershell
   python serve.py
   ```
   *Alternatively, using Python's built-in HTTP server:*
   ```powershell
   python -m http.server 3000
   ```

3. **Open in your browser:**
   ```
   http://localhost:3000/
   ```

---

## 📁 Project Structure

```plaintext
Ansh-Tayade/
├── assets/
│   ├── css/
│   │   ├── style.css             # Core design system & layout styling
│   │   ├── galaxy.css            # Dark mode cosmos & canvas styles
│   │   ├── earth.css             # Light mode 3D Earth container styles
│   │   └── animations.css        # Keyframe animations & glassmorphism
│   ├── js/
│   │   ├── main.js               # Application bootstrap & UI controller
│   │   ├── galaxy.js             # Canvas particle physics engine
│   │   ├── earth3d.js            # Interactive 3D Earth orbit controller
│   │   ├── projects.js           # Dynamic project card renderer & modals
│   │   ├── projectsData.js       # Projects data & repository links
│   │   ├── github.js             # Live GitHub REST API sync
│   │   └── soundEffects.js       # Ambient audio & UI micro-interactions
│   ├── images/                   # Project preview graphics and avatars
│   └── resume/                   # Official developer resume PDF
├── index.html                    # Single-page application entry point
├── netlify.toml                  # Netlify deployment & caching configuration
├── serve.py                      # Local development server script
└── README.md                     # Documentation
```

---

## 🛠 Adding or Updating Projects

To add a new project to the portfolio, edit [`assets/js/projectsData.js`](assets/js/projectsData.js):

```javascript
{
  id: "project-slug",
  title: "Project Title",
  category: "python", // 'python' | 'ai' | 'database' | 'web'
  description: "Brief overview of what the application accomplishes.",
  technologies: ["Python", "OpenCV", "SQL"],
  github: "https://github.com/anshtayade132-commits/your-repo",
  image: "assets/images/project-banner.svg",
  hasDemo: false, // Set to true if configuring a live interactive modal
  featured: true,
  highlights: [
    "Key engineering accomplishment or metric",
    "Optimized architecture or algorithm implemented"
  ]
}
```

The portfolio dynamically renders new entries with 3D tilt effects, interactive cards, and responsive tag filters.

---

## 🌐 Continuous Deployment

This repository is connected to **Netlify** with automatic CI/CD deployment on every push to the `main` branch.

- **Production URL:** [https://anshtayade.netlify.app/](https://anshtayade.netlify.app/)
- **Build Command:** Static (no build step needed)
- **Publish Directory:** `.`

---

## 📬 Contact & Connect

- **Portfolio:** [anshtayade.netlify.app](https://anshtayade.netlify.app/)
- **GitHub:** [@anshtayade132-commits](https://github.com/anshtayade132-commits)
- **LinkedIn:** [Ansh Tayade](https://www.linkedin.com/in/ansh-tayade)

---

&copy; 2026 Ansh Tayade. All rights reserved.
