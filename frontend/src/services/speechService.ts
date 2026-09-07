import { SpeechRate } from '../types/navigation';
import { SPEECH_RATES } from '../utils/constants';

/**
 * Robust Web Speech API synthesis service.
 * Ensures announcements never buffer or lag behind the user's physical movement.
 */
export class SpeechService {
  private isAvailable: boolean;

  constructor() {
    this.isAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public isSupported(): boolean {
    return this.isAvailable;
  }

  public speak(
    text: string,
    rate: SpeechRate = 'normal',
    volume: number = 1.0,
    enabled: boolean = true
  ): void {
    if (!enabled || !this.isAvailable || !text.trim()) {
      return;
    }

    try {
      // Immediately cancel any queued speech to avoid lagging behind real-world navigation
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = SPEECH_RATES[rate] || 1.0;
      utterance.pitch = 1.0;
      utterance.volume = Math.max(0, Math.min(1, volume));

      // Attempt to pick a clean, natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Enhanced'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }

  public stop(): void {
    if (this.isAvailable) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn('Error stopping speech synthesis:', err);
      }
    }
  }
}

export const speechService = new SpeechService();
