/**
 * ============================================================================
 * ANSH TAYADE - WEB AUDIO API COSMIC SOUNDSCAPE GENERATOR
 * ============================================================================
 * Synthesizes pure atmospheric deep-space ambient harmonic drones
 * Completely self-contained via Web Audio API (0 external MP3 files required).
 * ============================================================================
 */

class CosmicSoundscape {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.droneGain = null;
    this.oscillators = [];
    this.toggleBtn = document.getElementById('cosmic-audio-toggle');
    this.toggleText = document.getElementById('audio-toggle-text');

    if (!this.toggleBtn) return;
    this.init();
  }

  init() {
    this.toggleBtn.addEventListener('click', () => this.toggle());
  }

  initAudio() {
    if (this.audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    // Master drone gain
    this.droneGain = this.audioCtx.createGain();
    this.droneGain.gain.setValueAtTime(0, this.audioCtx.currentTime);

    // Low-pass filter for deep space warmth
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, this.audioCtx.currentTime);

    this.droneGain.connect(filter);
    filter.connect(this.audioCtx.destination);

    // Cosmic drone frequencies (D-flat sub-harmonic chord: 55Hz, 110Hz, 164.8Hz)
    const freqs = [55, 110, 164.8, 220];

    freqs.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Subtle LFO detune modulation
      const lfo = this.audioCtx.createOscillator();
      const lfoGain = this.audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.03, this.audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, this.audioCtx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      oscGain.gain.setValueAtTime(0.2 / (idx + 1), this.audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.droneGain);
      osc.start();

      this.oscillators.push(osc);
    });
  }

  toggle() {
    this.initAudio();

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (!this.isPlaying) {
      // Fade in drone
      this.droneGain.gain.linearRampToValueAtTime(0.18, this.audioCtx.currentTime + 2.5);
      this.isPlaying = true;
      this.toggleBtn.classList.add('active');
      if (this.toggleText) this.toggleText.textContent = 'Ambience: ON';
      this.playStellarChime();
    } else {
      // Fade out drone
      this.droneGain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);
      this.isPlaying = false;
      this.toggleBtn.classList.remove('active');
      if (this.toggleText) this.toggleText.textContent = 'Ambience: OFF';
    }
  }

  playStellarChime() {
    if (!this.audioCtx || !this.isPlaying) return;

    const chimeOsc = this.audioCtx.createOscillator();
    const chimeGain = this.audioCtx.createGain();

    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
    chimeOsc.frequency.exponentialRampToValueAtTime(1760, this.audioCtx.currentTime + 0.6);

    chimeGain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.9);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(this.audioCtx.destination);

    chimeOsc.start();
    chimeOsc.stop(this.audioCtx.currentTime + 0.9);
  }
}

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CosmicSoundscape());
} else {
  new CosmicSoundscape();
}
