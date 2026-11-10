/**
 * Web Audio API synthesizer for the cozy fantasy tavern.
 * 100% self-contained without any external asset dependencies.
 */

class TavernAudioManager {
  private ctx: AudioContext | null = null;
  private isSoundOn = true;
  private isMusicOn = true;

  // Background ambience nodes
  private fireNode: AudioNode | null = null;
  private fireGain: GainNode | null = null;
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;

  // Music loop state
  private musicInterval: number | null = null;
  private musicGain: GainNode | null = null;
  private chordIndex = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public init() {
    this.ensureContext();
    if (this.isSoundOn) {
      this.startAmbience();
    }
    if (this.isMusicOn) {
      this.startMusic();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.isSoundOn = enabled;
    if (enabled) {
      this.startAmbience();
    } else {
      this.stopAmbience();
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.isMusicOn = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public getSoundEnabled() {
    return this.isSoundOn;
  }

  public getMusicEnabled() {
    return this.isMusicOn;
  }

  // --- Rain and Fire Ambience ---
  private startAmbience() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.stopAmbience();

    // 1. Rain Synthesizer (White noise through gentle bandpass + lowpass)
    try {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const rainSource = ctx.createBufferSource();
      rainSource.buffer = buffer;
      rainSource.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 850;

      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.045; // Soft soothing background rain

      rainSource.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(ctx.destination);

      rainSource.start();
      this.rainNode = rainSource;
      this.rainGain = rainGain;

      // 2. Fireplace Crackle (Brown noise + random pops)
      const fireBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const fData = fireBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        fData[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = fData[i];
        fData[i] *= 3.5;
      }

      const fireSource = ctx.createBufferSource();
      fireSource.buffer = fireBuffer;
      fireSource.loop = true;

      const fireFilter = ctx.createBiquadFilter();
      fireFilter.type = 'lowpass';
      fireFilter.frequency.value = 400;

      const fireGain = ctx.createGain();
      fireGain.gain.value = 0.06;

      fireSource.connect(fireFilter);
      fireFilter.connect(fireGain);
      fireGain.connect(ctx.destination);

      fireSource.start();
      this.fireNode = fireSource;
      this.fireGain = fireGain;
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  private stopAmbience() {
    try {
      if (this.rainNode && 'stop' in this.rainNode) {
        (this.rainNode as AudioBufferSourceNode).stop();
      }
      if (this.fireNode && 'stop' in this.fireNode) {
        (this.fireNode as AudioBufferSourceNode).stop();
      }
    } catch {}
    this.rainNode = null;
    this.fireNode = null;
  }

  // --- Cozy Tavern Acoustic Arpeggiator (Lute / Harp Synth) ---
  private startMusic() {
    if (this.musicInterval) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    // Progression: Am - Em - F - C - Dm - G - Em - Am (Cozy Renaissance Tavern)
    const chords = [
      [220, 261.63, 329.63, 440], // A3, C4, E4, A4
      [164.81, 246.94, 329.63, 392], // E3, B3, E4, G4
      [174.61, 220, 261.63, 349.23], // F3, A3, C4, F4
      [130.81, 196, 261.63, 329.63], // C3, G3, C4, E4
      [146.83, 220, 293.66, 349.23], // D3, A3, D4, F4
      [196, 246.94, 293.66, 392], // G3, B3, D4, G4
      [164.81, 196, 246.94, 329.63], // E3, G3, B3, E4
      [220, 261.63, 329.63, 440], // A3, C4, E4, A4
    ];

    let noteInChord = 0;
    this.chordIndex = 0;

    this.musicInterval = window.setInterval(() => {
      if (!this.isMusicOn || !this.ctx || this.ctx.state !== 'running') return;

      const currentChord = chords[this.chordIndex];
      const freq = currentChord[noteInChord];

      this.playLuteString(freq, 0.025);

      noteInChord++;
      if (noteInChord >= currentChord.length) {
        noteInChord = 0;
        this.chordIndex = (this.chordIndex + 1) % chords.length;
      }
    }, 700);
  }

  private stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private playLuteString(freq: number, volume = 0.03) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.4);
    } catch {}
  }

  // --- Sound Effects ---

  // Pour drink into mug
  public playPour() {
    if (!this.isSoundOn) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const duration = 0.45;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + duration);
      filter.Q.value = 4;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {}
  }

  // Clink of beer mugs
  public playClink() {
    if (!this.isSoundOn) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1860, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {}
  }

  // Collect drunken rumor bubble chime
  public playCollectRumor() {
    if (!this.isSoundOn) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Bright magical harp)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch {}
  }

  // Gold coin clink
  public playCoin() {
    if (!this.isSoundOn) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.06); // E6

      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {}
  }

  // Paper flip / open book
  public playPageTurn() {
    if (!this.isSoundOn) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const duration = 0.15;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1600;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {}
  }
}

export const tavernAudio = new TavernAudioManager();
