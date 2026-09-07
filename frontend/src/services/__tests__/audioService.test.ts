import { describe, it, expect } from 'vitest';
import { AUDIO_SPATIAL_PARAMS } from '../../utils/constants';
import { AudioService } from '../audioService';

describe('AudioService Spatial Panning & Frequency Mapping', () => {
  it('defines correct stereo pan azimuths for spatial directions', () => {
    // Left cue should pan hard left (-0.9)
    expect(AUDIO_SPATIAL_PARAMS.left.pan).toBeLessThan(-0.5);
    // Right cue should pan hard right (+0.9)
    expect(AUDIO_SPATIAL_PARAMS.right.pan).toBeGreaterThan(0.5);
    // Center cue should be dead center (0.0)
    expect(AUDIO_SPATIAL_PARAMS.center.pan).toBe(0.0);
    // Critical alert should be centered with high frequency
    expect(AUDIO_SPATIAL_PARAMS.critical.frequency).toBe(880);
  });

  it('instantiates AudioService safely in non-browser/node environment without crashing', () => {
    const service = new AudioService();
    expect(service.isSupported()).toBe(false);
    expect(() => service.playDirectionalCue('left', 'high')).not.toThrow();
    expect(() => service.unlockAudioContext()).not.toThrow();
  });
});
