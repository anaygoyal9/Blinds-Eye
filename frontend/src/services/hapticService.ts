import { AlertPriority, Direction } from '../types/navigation';
import { VIBRATION_PATTERNS } from '../utils/constants';

/**
 * Haptic feedback service wrapping the Navigator Vibration API.
 * Provides distinct rhythmic feedback patterns for left, right, center, and critical obstacles.
 */
export class HapticService {
  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  public vibrate(
    direction: Direction,
    priority: AlertPriority | 'clear' = 'medium',
    enabled: boolean = true
  ): boolean {
    if (!enabled || !this.isSupported()) {
      return false;
    }

    try {
      if (priority === 'critical') {
        navigator.vibrate([...VIBRATION_PATTERNS.critical]);
        return true;
      }

      if (priority === 'clear') {
        navigator.vibrate([...VIBRATION_PATTERNS.clear]);
        return true;
      }

      const pattern = VIBRATION_PATTERNS[direction] || VIBRATION_PATTERNS.none;
      navigator.vibrate([...pattern]);
      return true;
    } catch (err) {
      console.warn('Vibration API error:', err);
      return false;
    }
  }

  public alertLeft(enabled = true): boolean {
    return this.vibrate('left', 'high', enabled);
  }

  public alertRight(enabled = true): boolean {
    return this.vibrate('right', 'high', enabled);
  }

  public alertCenter(enabled = true): boolean {
    return this.vibrate('center', 'high', enabled);
  }

  public alertCritical(enabled = true): boolean {
    return this.vibrate('center', 'critical', enabled);
  }

  public alertClear(enabled = true): boolean {
    return this.vibrate('none', 'clear', enabled);
  }

  public stop(): void {
    if (this.isSupported()) {
      navigator.vibrate(0);
    }
  }
}

export const hapticService = new HapticService();
