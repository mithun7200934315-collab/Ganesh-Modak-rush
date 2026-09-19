// Procedural Web Audio Synthesizer for Mushak Dash (Ganesh Chaturthi Game)
// 100% offline, zero external audio asset dependencies!

class SoundSystem {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  public soundEnabled: boolean = true;
  public musicEnabled: boolean = true;
  public sfxVolume: number = 0.8;
  public musicVolume: number = 0.5;

  private isBgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private bgmStep: number = 0;

  // Raag Bhupali Pentatonic Notes (Hz): Sa (C4), Re (D4), Ga (E4), Pa (G4), Dha (A4), Sa' (C5)
  private readonly scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];

  private sharedNoiseBuffer: AudioBuffer | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.soundEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Preload 1 second of static white noise once to eliminate runtime CPU spikes
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.0);
      this.sharedNoiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.sharedNoiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public resumeContext() {
    this.initContext();
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(enabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(enabled ? this.musicVolume : 0, this.ctx.currentTime);
    }
    if (enabled && !this.isBgmPlaying) {
      this.startFestiveBGM();
    } else if (!enabled && this.isBgmPlaying) {
      this.stopFestiveBGM();
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx && this.soundEnabled) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicGain && this.ctx && this.musicEnabled) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  // --- SOUND EFFECTS ---

  // Sweet Modak Chime (Clear, resonant bell sound)
  public playModakChime(comboMultiplier: number = 1) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pentatonic scale based on combo index
    const noteIdx = Math.min(this.scale.length - 1, 2 + Math.min(comboMultiplier, 5));
    const baseFreq = this.scale[noteIdx];

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(baseFreq * 2.76, t); // bell-like non-harmonic overtone

    const harmGain = this.ctx.createGain();
    harmGain.gain.setValueAtTime(0.3, t);
    harmGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    oscHarmonic.connect(harmGain);
    harmGain.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    oscHarmonic.start(t);
    osc.stop(t + 0.5);
    oscHarmonic.stop(t + 0.5);
  }

  // Golden Modak Sparkle (Arpeggiated radiant chord)
  public playGoldenModakChime() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + idx * 0.055;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  // Mega Laddoo Joyful Chime (Resonant multi-bell celebratory chord)
  public playMegaModakJoyfulChime() {
    this.playMegaLaddooJoyfulChime();
  }

  public playMegaLaddooJoyfulChime() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Joyous celebratory fanfare arpeggio (C5, E5, G5, B5, C6, E6) + harmonic shimmer
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + idx * 0.065;
      const osc = this.ctx.createOscillator();
      const bellHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const harmGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      bellHarmonic.type = 'triangle';
      bellHarmonic.frequency.setValueAtTime(freq * 2.76, t); // sacred brass bell overtone

      harmGain.gain.setValueAtTime(0.2, t);
      harmGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      gain.gain.setValueAtTime(0.38, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

      bellHarmonic.connect(harmGain);
      harmGain.connect(gain);
      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      bellHarmonic.start(t);
      osc.stop(t + 0.9);
      bellHarmonic.stop(t + 0.9);
    });
  }

  // Jump (Springy upward pitch sweep)
  public playJump() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(580, t + 0.15);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Slide (Airy whoosh)
  public playSlide() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    if (!this.sharedNoiseBuffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.sharedNoiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.linearRampToValueAtTime(500, t + 0.2);
    filter.Q.setValueAtTime(3, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 0.22);
  }

  // Obstacle Stumble (Playful cute bump - never violent)
  public playObstacleBump() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    // Low drum thump
    const drum = this.ctx.createOscillator();
    const drumGain = this.ctx.createGain();

    drum.type = 'triangle';
    drum.frequency.setValueAtTime(140, t);
    drum.frequency.exponentialRampToValueAtTime(45, t + 0.18);

    drumGain.gain.setValueAtTime(0.35, t);
    drumGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    drum.connect(drumGain);
    drumGain.connect(this.sfxGain);

    drum.start(t);
    drum.stop(t + 0.22);

    // Cute spring 'boing'
    const spring = this.ctx.createOscillator();
    const springGain = this.ctx.createGain();

    spring.type = 'sine';
    spring.frequency.setValueAtTime(320, t + 0.05);
    spring.frequency.linearRampToValueAtTime(180, t + 0.22);

    springGain.gain.setValueAtTime(0.18, t + 0.05);
    springGain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    spring.connect(springGain);
    springGain.connect(this.sfxGain);

    spring.start(t + 0.05);
    spring.stop(t + 0.28);
  }

  // Power-up Blessing
  public playPowerup() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [392.0, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.38);
    });
  }

  // Temple Bell (Ghanti) - Resonant brass bell
  public playTempleBell() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const partials = [1200, 2400, 3600, 4800];
    const amplitudes = [0.35, 0.2, 0.12, 0.05];

    partials.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(amplitudes[i], t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2 / (i + 1));

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 1.3);
    });
  }

  // Shankha (Conch Shell) divine call
  public playShankha() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    vibrato.frequency.setValueAtTime(5.5, t); // 5.5 Hz vibrato
    vibratoGain.gain.setValueAtTime(7, t);

    vibrato.connect(osc.frequency);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(270, t + 0.6);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, t);
    filter.frequency.linearRampToValueAtTime(950, t + 0.6);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    vibrato.start(t);
    osc.start(t);
    vibrato.stop(t + 1.7);
    osc.stop(t + 1.7);
  }

  // Joyous Level Complete Fanfare
  public playLevelWin() {
    this.playShankha();
    setTimeout(() => this.playTempleBell(), 400);
    setTimeout(() => this.playGoldenModakChime(), 800);
  }

  // Game Over / Rest Chime
  public playGameOver() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [392.0, 329.63, 293.66, 261.63]; // G4, E4, D4, C4 (descending peaceful motif)
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime + idx * 0.18;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  // --- PROCEDURAL FESTIVAL BGM (DHOLAK & FLUTE MELODY) ---

  public startFestiveBGM() {
    if (this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.bgmStep = 0;

    // 128 BPM festival rhythm (16 steps per bar)
    const stepDuration = 60 / 128 / 4; // ~117ms per 16th note

    const playRhythmStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.musicGain || !this.musicEnabled) return;

      const t = this.ctx.currentTime;
      const step = this.bgmStep % 16;

      // Dholak Bass Kick on beats 0, 6, 8, 12
      if (step === 0 || step === 6 || step === 8 || step === 12) {
        const bass = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();
        bass.type = 'sine';
        bass.frequency.setValueAtTime(step === 0 ? 110 : 85, t);
        bass.frequency.exponentialRampToValueAtTime(45, t + 0.12);

        bassGain.gain.setValueAtTime(0.3, t);
        bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

        bass.connect(bassGain);
        bassGain.connect(this.musicGain);

        bass.start(t);
        bass.stop(t + 0.15);
      }

      // Dholak Treble Slap / Tap on offbeats 4, 10, 14
      if (step === 4 || step === 10 || step === 14) {
        const slap = this.ctx.createOscillator();
        const slapGain = this.ctx.createGain();
        slap.type = 'triangle';
        slap.frequency.setValueAtTime(340, t);
        slap.frequency.exponentialRampToValueAtTime(180, t + 0.08);

        slapGain.gain.setValueAtTime(0.18, t);
        slapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

        slap.connect(slapGain);
        slapGain.connect(this.musicGain);

        slap.start(t);
        slap.stop(t + 0.1);
      }

      // Tabla Dayan 'Na' / 'Tun' bell-like stroke on steps 2, 6, 10, 14
      if (step === 2 || step === 6 || step === 10 || step === 14) {
        const tabla = this.ctx.createOscillator();
        const tablaGain = this.ctx.createGain();
        tabla.type = 'sine';
        // Tuned to root Sa (261.6 Hz)
        tabla.frequency.setValueAtTime(261.63, t);
        tabla.frequency.exponentialRampToValueAtTime(258.0, t + 0.1);

        tablaGain.gain.setValueAtTime(0.15, t);
        tablaGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        tabla.connect(tablaGain);
        tablaGain.connect(this.musicGain);

        tabla.start(t);
        tabla.stop(t + 0.13);
      }

      // Ghungroo / Shaker on every even 16th note
      if (step % 2 === 0 && this.sharedNoiseBuffer) {
        const shaker = this.ctx.createBufferSource();
        shaker.buffer = this.sharedNoiseBuffer;

        const shakerFilter = this.ctx.createBiquadFilter();
        shakerFilter.type = 'highpass';
        shakerFilter.frequency.setValueAtTime(4500, t);

        const shakerGain = this.ctx.createGain();
        shakerGain.gain.setValueAtTime(step % 4 === 0 ? 0.08 : 0.04, t);
        shakerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

        shaker.connect(shakerFilter);
        shakerFilter.connect(shakerGain);
        shakerGain.connect(this.musicGain);

        shaker.start(t);
        shaker.stop(t + 0.035);
      }

      // Cheerful Bansuri (Flute) / Sitar melodic notes
      // Melody pattern in Raag Bhupali
      const melodyPattern: { [key: number]: number } = {
        0: 0, // Sa
        2: 1, // Re
        4: 2, // Ga
        6: 3, // Pa
        8: 4, // Dha
        10: 3, // Pa
        12: 5, // Sa'
        14: 2, // Ga
      };

      if (melodyPattern[step] !== undefined && (Math.floor(this.bgmStep / 16) % 2 === 0 || step === 0 || step === 8)) {
        const noteFreq = this.scale[melodyPattern[step]];
        const flute = this.ctx.createOscillator();
        const fluteGain = this.ctx.createGain();

        flute.type = 'sine';
        flute.frequency.setValueAtTime(noteFreq, t);

        fluteGain.gain.setValueAtTime(0.12, t);
        fluteGain.gain.linearRampToValueAtTime(0.18, t + 0.05);
        fluteGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        flute.connect(fluteGain);
        fluteGain.connect(this.musicGain);

        flute.start(t);
        flute.stop(t + 0.24);
      }

      this.bgmStep++;
    };

    this.bgmIntervalId = window.setInterval(playRhythmStep, stepDuration * 1000);
  }

  public stopFestiveBGM() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }
}

export const soundManager = new SoundSystem();
