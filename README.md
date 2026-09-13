# 🌌 Ansh Tayade — Futuristic Galaxy Developer Portfolio

A personal developer portfolio website set inside a deep-space galaxy with interactive starfield physics, subtle crimson nebula glow, glassmorphic UI cards, 3D tilting project showcases, and real-time GitHub integration.

---

## 🚀 Quick Launch Locally

Since you have **Python 3.14** installed, you can launch the website in one command:

```powershell
cd C:\ansh-portfolio
python serve.py
```
Or with Python's built-in server:
```powershell
python -m http.server 3000
```
Then open your browser to [https://anshtayade.netlify.app/]https://anshtayade.netlify.app/.

You can also simply double-click `index.html` to view it directly in Chrome, Edge, Brave, or Firefox.

---

## 🛠 Adding New Projects

To add a new project to your portfolio, open [`assets/js/projectsData.js`](file:///C:/ansh-portfolio/assets/js/projectsData.js) and add a new object to the array:

```javascript
{
  id: "my-new-project",
  title: "My New Project",
  category: "python", // Options: 'python', 'ai', 'database'
  description: "Detailed description of what the project accomplishes.",
  technologies: ["Python", "SQL", "Streamlit"],
  github: "https://github.com/anshtayade132-commits/my-new-project",
  demo: "https://yourdemo.com",
  image: "assets/images/your-project-image.jpg",
  highlights: [
    "Key engineering achievement 1",
    "Key engineering achievement 2"
  ]
}
```
The website will dynamically render the new project card with 3D perspective tilt, tech badges, and action buttons!

---

## 🎨 Galaxy Starfield & Interactive Mechanics

- **Mouse Gravity**: Moving your cursor smoothly pulls nearby stars toward the mouse with realistic spring dampening and inertia.
- **Random Shooting Stars**: Diagonal shooting stars appear at realistic randomized intervals with glowing heads and fading particle trails.
- **Occasional Meteor Trails**: Bright meteors with elongated trails leave subtle glowing after-burns.
- **Nebula Shaders**: Very subtle, non-distracting crimson and starlight-cyan nebula clouds gently drift in the background.
- **Performance**:
  - Bound to `requestAnimationFrame` at 60 FPS.
  - Automatically pauses rendering when the browser tab loses focus (`visibilitychange`).
  - Mobile-optimized: reduces particle count automatically on mobile screens (`< 768px`) to ensure silky-smooth performance.
  - Respects `prefers-reduced-motion`.

---

## 🐙 Real-Time GitHub Integration

- Connected to **`anshtayade132-commits`**.
- Fetches real-time public repositories, stars, forks, and programming language badges.
- Includes a graceful cached fallback so your portfolio never looks blank even if offline or rate-limited.
- You can also test any other username directly using the input field in the GitHub section.

---

## 🌐 Deploying to the Web

### Deploying to GitHub Pages:
1. Initialize a git repository in `C:\ansh-portfolio`:
   ```powershell
   cd C:\ansh-portfolio
   git init
   git add .
   git commit -m "Initial portfolio release"
   ```
2. Create a repository on GitHub named `portfolio` (or `anshtayade132-commits.github.io`).
3. Push your code and enable GitHub Pages under **Settings > Pages > Branch: main / root**.
