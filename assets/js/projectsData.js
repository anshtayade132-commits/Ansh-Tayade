/**
 * ============================================================================
 * ANSH TAYADE - PROJECTS CATALOG DATA SOURCE
 * ============================================================================
 * Contains only Ansh's real personally developed projects:
 * 1. Carax Voice Assistant
 * 2. Weather App
 * ============================================================================
 */

const projectsData = [
  {
    id: "carax-voice-assistant",
    title: "Carax Voice Assistant",
    category: "ai",
    badge: "AI Voice Assistant",
    description: "An intelligent voice assistant built with Python that accepts spoken natural language commands, automates desktop tasks, conducts real-time web queries, and delivers synthesized voice feedback.",
    technologies: [
      { name: "Python", url: "https://www.python.org/" },
      { name: "Speech Recognition", url: "https://pypi.org/project/SpeechRecognition/" },
      { name: "pyttsx3", url: "https://pyttsx3.readthedocs.io/" },
      { name: "Web APIs", url: "https://developer.mozilla.org/en-US/docs/Web/API" }
    ],
    github: "https://github.com/anshtayade132-commits",
    demo: "#demo-carax",
    image: "assets/images/carax-assistant.svg",
    demoType: "carax",
    featured: true,
    highlights: [
      "Voice recognition with ambient noise calibration",
      "Offline pyttsx3 speech synthesis engine",
      "Automated desktop actions and browser queries",
      "Clean modular command dispatch architecture"
    ]
  },
  {
    id: "weather-app",
    title: "Weather App",
    category: "python",
    badge: "Python Desktop App",
    description: "A clean desktop application built with Python, Tkinter, and OpenWeatherMap API that fetches live temperature readings, atmospheric condition descriptions, weather icons, and an active digital clock.",
    technologies: [
      { name: "Python", url: "https://www.python.org/" },
      { name: "Tkinter", url: "https://docs.python.org/3/library/tkinter.html" },
      { name: "OpenWeather API", url: "https://openweathermap.org/api" },
      { name: "Pillow", url: "https://python-pillow.org/" }
    ],
    github: "https://github.com/anshtayade132-commits/weather-app",
    demo: "#demo-weather",
    image: "assets/images/weather-app.svg",
    demoType: "weather",
    featured: true,
    highlights: [
      "Live OpenWeatherMap REST API telemetry queries",
      "Dynamic weather condition icon rendering via PIL",
      "Integrated real-time clock ticker",
      "Lightweight responsive Tkinter GUI"
    ]
  }
];

// Export for module or global window access
if (typeof module !== 'undefined' && module.exports) {
  module.exports = projectsData;
} else {
  window.projectsData = projectsData;
}
