import { describe, it, expect, beforeEach } from 'vitest';
import { DemoService } from '../demoService';

describe('DemoService Telemetry Generator', () => {
  let demoService: DemoService;

  beforeEach(() => {
    demoService = new DemoService();
  });

  it('cycles through navigation scenarios conforming to DetectionPayload contract', () => {
    const first = demoService.getNextPayload();
    expect(first.payload).toHaveProperty('status');
    expect(first.payload).toHaveProperty('alert_side');
    expect(Array.isArray(first.payload.obstacles)).toBe(true);

    const second = demoService.getNextPayload();
    expect(second.payload.status).toBe('ALERT');
    expect(second.payload.obstacles.length).toBeGreaterThan(0);
    expect(second.payload.obstacles[0]).toHaveProperty('proximity');
    expect(second.payload.obstacles[0]).toHaveProperty('direction');
  });

  it('resets cleanly to step 0', () => {
    demoService.getNextPayload();
    demoService.getNextPayload();
    demoService.reset();
    const restarted = demoService.getNextPayload();
    expect(restarted.description).toContain('Clear corridor');
  });
});
