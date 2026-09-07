import { AlertPriority, Direction } from '../types/navigation';
import { AUDIO_SPATIAL_PARAMS } from '../utils/constants';

/**
 * Directional Audio Engine using Web Audio API and Stereo Panning.
 * Provides intuitive non-verbal acoustic cues for left, center, right, and critical obstacles.
 */
export class AudioService {
  private ctx: AudioContext | null = null;
  private isUnlocked = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        // @ts-expect-error webkitAudioContext fallback
        window.webkitAudioContext;

      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended' && this.isUnlocked) {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window);
  }

  /**
   * Unlock AudioContext from user gesture (button click or key press)
   */
  public unlockAudioContext(): void {
    this.isUnlocked = true;
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  public playDirectionalCue(
    direction: Direction,
    priority: AlertPriority | 'clear' = 'medium',
    volume: number = 0.8,
    enabled: boolean = true
  ): void {
    if (!enabled || !this.isSupported()) return;

    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const paramKey =
        priority === 'critical'
          ? 'critical'
          : priority === 'clear'
          ? 'clear'
          : direction === 'left'
          ? 'left'
          : direction === 'right'
          ? 'right'
          : 'center';

      const params = AUDIO_SPATIAL_PARAMS[paramKey] || AUDIO_SPATIAL_PARAMS.center;
      const now = ctx.currentTime;
      const safeVolume = Math.max(0.01, Math.min(1.0, volume));

      // 1. Create Oscillator
      const osc = ctx.createOscillator();
      osc.type = params.type;
      osc.frequency.setValueAtTime(params.frequency, now);

      // 2. Create Gain envelope (attack & decay to eliminate clicks)
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(safeVolume * 0.35, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + params.duration);

      // 3. Create Spatial Stereo Panner if supported
      const hasStereoPanner = typeof (ctx as unknown as { createStereoPanner?: unknown }).createStereoPanner === 'function';
      if (hasStereoPanner) {
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(params.pan, now);
        osc.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        // Fallback for browsers without StereoPanner
        osc.connect(gain);
        gain.connect(ctx.destination);
      }

      // If critical, generate a secondary rapid ping
      if (priority === 'critical') {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(params.frequency * 1.2, now + 0.12);
        gain2.gain.setValueAtTime(0.0001, now + 0.12);
        gain2.gain.linearRampToValueAtTime(safeVolume * 0.35, now + 0.14);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.3);
      }

      osc.start(now);
      osc.stop(now + params.duration + 0.05);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  public playLeftCue(volume = 0.8, enabled = true): void {
    this.playDirectionalCue('left', 'high', volume, enabled);
  }

  public playRightCue(volume = 0.8, enabled = true): void {
    this.playDirectionalCue('right', 'high', volume, enabled);
  }

  public playCenterCue(volume = 0.8, enabled = true): void {
    this.playDirectionalCue('center', 'high', volume, enabled);
  }

  public playCriticalAlert(volume = 0.8, enabled = true): void {
    this.playDirectionalCue('center', 'critical', volume, enabled);
  }

  public playClearCue(volume = 0.8, enabled = true): void {
    this.playDirectionalCue('none', 'clear', volume, enabled);
  }
}

export const audioService = new AudioService();
