import { describe, it, expect } from 'vitest';
import { VIBRATION_PATTERNS } from '../../utils/constants';
import { HapticService } from '../hapticService';

describe('HapticService Patterns & Vibration Abstraction', () => {
  it('defines distinct vibration rhythms for left, right, center, and critical', () => {
    // Left pattern should have short distinct pulses
    expect(VIBRATION_PATTERNS.left).toEqual([90, 60, 90]);
    // Right pattern should have longer pulses
    expect(VIBRATION_PATTERNS.right).toEqual([180, 60, 180]);
    // Critical pattern should have aggressive repeated pulses
    expect(VIBRATION_PATTERNS.critical.length).toBeGreaterThanOrEqual(4);
  });

  it('instantiates HapticService safely and handles unsupported devices gracefully', () => {
    const service = new HapticService();
    expect(service.isSupported()).toBe(false);
    expect(service.vibrate('left', 'high')).toBe(false);
    expect(() => service.stop()).not.toThrow();
  });
});
