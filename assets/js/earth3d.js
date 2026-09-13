/**
 * ============================================================================
 * ANSH TAYADE - 3D PHOTOREALISTIC EARTH GLOBE ENGINE (THREE.JS / WEBGL)
 * ============================================================================
 * Features:
 * - Real 3D Spherical Earth Geometry with NASA High-Definition Texture Maps
 * - Full 360-degree rotation across ALL angles without gimbal lock:
 *   * Back to front (horizontal axial spin)
 *   * Up to down (vertical polar pitch & tumble)
 *   * Complete diagonal / spherical trackball rotation in any direction
 * - Smooth cursor movement tracking: moving the mouse continuously rolls & spins the globe
 * - Direct click & drag interaction with inertial momentum release (fling to spin)
 * - Dynamic 3D clouds layer with independent rotational drift
 * - Luminous Rayleigh atmospheric rim glow & ocean specular sunlight glint
 * - Theme-synchronized lifecycle: sleeps in Dark Mode, renders in Light Mode
 * ============================================================================
 */

class Earth3DEngine {
  constructor() {
    this.container = document.getElementById('earth-3d-container');
    if (!this.container || typeof THREE === 'undefined') {
      console.warn('Earth3D: Container or THREE.js not available.');
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.earthGroup = null;
    this.earthMesh = null;
    this.cloudMesh = null;
    this.atmosphereMesh = null;

    // Viewport Dimensions
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // 3D Motion Physics State
    this.angularVelocity = { x: 0, y: 0.0018 };
    this.idleSpeedY = 0.0016; // Gentle natural planetary rotation
    this.isDragging = false;
    this.hasMovedMouse = false;
    this.prevMouseX = 0;
    this.prevMouseY = 0;

    // Lifecycle
    this.animationFrameId = null;
    this.isActive = false;

    this.init();
  }

  init() {
    this.initScene();
    this.initMeshes();
    this.initLights();
    this.bindEvents();
    this.checkThemeState();
  }

  initScene() {
    this.scene = new THREE.Scene();

    // Perspective Camera
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 3000);
    this.camera.position.set(0, 0, 920);

    // WebGL Renderer with High Precision & Transparency
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
  }

  getEarthRadius() {
    const minDim = Math.min(this.width, this.height);
    // Well-balanced scale: majestic globe centered behind portfolio content
    return Math.max(220, Math.min(minDim * 0.36, 360));
  }

  initMeshes() {
    this.earthGroup = new THREE.Group();
    this.scene.add(this.earthGroup);

    const radius = this.getEarthRadius();
    const textureLoader = new THREE.TextureLoader();

    // 1. Earth Surface Mesh (NASA 2048x1024 Texture)
    const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
    const earthMap = textureLoader.load('assets/images/earth_map_2048.jpg', () => {
      if (this.isActive) this.renderer.render(this.scene, this.camera);
    });
    const specularMap = textureLoader.load('assets/images/earth_specular_2048.jpg');

    const earthMat = new THREE.MeshPhongMaterial({
      map: earthMap,
      specularMap: specularMap,
      specular: new THREE.Color(0x28608e),
      shininess: 22,
      emissive: new THREE.Color(0x040a14),
      emissiveIntensity: 0.1
    });

    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.earthGroup.add(this.earthMesh);

    // 2. Realistic Dynamic Cloud Layer (NASA Cloud Map)
    const cloudGeo = new THREE.SphereGeometry(radius * 1.014, 64, 64);
    const cloudMap = textureLoader.load('assets/images/earth_clouds_1024.png', () => {
      if (this.isActive) this.renderer.render(this.scene, this.camera);
    });

    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.85,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    this.cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    this.earthGroup.add(this.cloudMesh);

    // 3. Luminous Rayleigh Atmospheric Rim Glow
    const atmosGeo = new THREE.SphereGeometry(radius * 1.055, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
          gl_FragColor = vec4(0.12, 0.68, 1.0, 1.0) * intensity * 1.8;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    this.atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    this.earthGroup.add(this.atmosphereMesh);

    // Initial natural Earth axial tilt (23.4 degrees)
    const initialTilt = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      23.4 * (Math.PI / 180)
    );
    this.earthGroup.quaternion.multiply(initialTilt);
  }

  initLights() {
    // 1. Primary Directional Sunlight from top-left
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.35);
    sunLight.position.set(-700, 500, 650);
    this.scene.add(sunLight);

    // 2. Soft Daylight Ambient Fill
    const ambientLight = new THREE.AmbientLight(0xdbeafe, 0.46);
    this.scene.add(ambientLight);

    // 3. Secondary Rim Fill Light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.32);
    rimLight.position.set(600, -350, 450);
    this.scene.add(rimLight);
  }

  /**
   * Applies full 360-degree rotation across world screen axes:
   * - rotY: rotates around world Y axis (horizontal mouse movement -> full back-to-front spin)
   * - rotX: rotates around world X axis (vertical mouse movement -> full up-to-down tumble)
   * Using Quaternion premultiplication prevents gimbal lock in all angles.
   */
  applyRotation(rotX, rotY) {
    if (!this.earthGroup) return;

    if (Math.abs(rotY) > 0.000001) {
      const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
      this.earthGroup.quaternion.premultiply(qY);
    }

    if (Math.abs(rotX) > 0.000001) {
      const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), rotX);
      this.earthGroup.quaternion.premultiply(qX);
    }

    this.earthGroup.quaternion.normalize();
  }

  bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);

      // Re-scale Earth geometry smoothly
      if (this.earthMesh) {
        const newRadius = this.getEarthRadius();
        const baseRadius = this.earthMesh.geometry.parameters.radius;
        const factor = newRadius / baseRadius;
        this.earthGroup.scale.set(factor, factor, factor);
      }
    }, { passive: true });

    // Mouse Cursor Movement (Full 360° Rotations on cursor movement)
    window.addEventListener('mousemove', (e) => {
      if (!this.isActive) return;

      const currentX = e.clientX;
      const currentY = e.clientY;

      if (this.hasMovedMouse) {
        const deltaX = currentX - this.prevMouseX;
        const deltaY = currentY - this.prevMouseY;

        if (this.isDragging) {
          // Direct 1:1 tactile drag rotation (all angles back-to-front and up-to-down)
          const rotY = deltaX * 0.007;
          const rotX = deltaY * 0.007;
          this.applyRotation(rotX, rotY);

          // Impart fling inertia velocity
          this.angularVelocity.y = deltaX * 0.0035;
          this.angularVelocity.x = deltaY * 0.0035;
        } else {
          // Active cursor movement rotation: moving mouse rolls & spins Earth in real-time
          const rotY = deltaX * 0.0035;
          const rotX = deltaY * 0.0035;
          this.applyRotation(rotX, rotY);

          // Impart fluid momentum
          this.angularVelocity.y = deltaX * 0.0012;
          this.angularVelocity.x = deltaY * 0.0012;

          // Clamp max impulse velocity
          this.angularVelocity.y = Math.max(Math.min(this.angularVelocity.y, 0.035), -0.035);
          this.angularVelocity.x = Math.max(Math.min(this.angularVelocity.x, 0.035), -0.035);
        }
      }

      this.prevMouseX = currentX;
      this.prevMouseY = currentY;
      this.hasMovedMouse = true;
    }, { passive: true });

    // Mouse Down (Drag start - excludes interactive buttons and links)
    window.addEventListener('mousedown', (e) => {
      if (!this.isActive) return;
      if (e.target.closest('a, button, input, textarea, .nav-menu-toggle, .theme-toggle-btn, .project-card, .btn-hire-me, .btn-resume-white')) {
        return;
      }
      this.isDragging = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Mobile / Tablet Touch Events
    window.addEventListener('touchstart', (e) => {
      if (!this.isActive || !e.touches[0]) return;
      if (e.target.closest('a, button, input, textarea, .nav-menu-toggle, .theme-toggle-btn')) {
        return;
      }
      this.isDragging = true;
      this.prevMouseX = e.touches[0].clientX;
      this.prevMouseY = e.touches[0].clientY;
      this.hasMovedMouse = true;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isActive || !e.touches[0]) return;
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.prevMouseX;
      const deltaY = touch.clientY - this.prevMouseY;

      const rotY = deltaX * 0.006;
      const rotX = deltaY * 0.006;
      this.applyRotation(rotX, rotY);

      this.angularVelocity.y = deltaX * 0.0025;
      this.angularVelocity.x = deltaY * 0.0025;

      this.prevMouseX = touch.clientX;
      this.prevMouseY = touch.clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Theme Switch Event Listener
    window.addEventListener('themeChanged', (e) => {
      this.onThemeChange(e.detail.theme);
    });

    // Page Visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else if (this.isActive) {
        this.start();
      }
    });
  }

  checkThemeState() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    this.onThemeChange(currentTheme);
  }

  onThemeChange(theme) {
    if (theme === 'light') {
      this.isActive = true;
      if (this.container) {
        this.container.style.opacity = '1';
        this.container.style.pointerEvents = 'auto';
      }
      this.start();
    } else {
      this.isActive = false;
      if (this.container) {
        this.container.style.opacity = '0';
        this.container.style.pointerEvents = 'none';
      }
      this.stop();
    }
  }

  start() {
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  animate() {
    if (!this.isActive) return;

    // Apply angular momentum and peaceful idle planetary drift
    if (!this.isDragging) {
      if (Math.abs(this.angularVelocity.x) > 0.00002 || Math.abs(this.angularVelocity.y) > 0.00002) {
        this.applyRotation(this.angularVelocity.x, this.angularVelocity.y);

        // Exponential damping towards idle velocity
        this.angularVelocity.x *= 0.94;
        this.angularVelocity.y = (this.angularVelocity.y - this.idleSpeedY) * 0.94 + this.idleSpeedY;
      } else {
        // Continuous peaceful axial orbital spin
        this.applyRotation(0, this.idleSpeedY);
      }
    }

    // Dynamic independent cloud weather drift around the globe
    if (this.cloudMesh) {
      this.cloudMesh.rotateY(0.0004);
    }

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.earth3DEngine = new Earth3DEngine();
  });
} else {
  window.earth3DEngine = new Earth3DEngine();
}
