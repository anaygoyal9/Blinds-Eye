import { describe, it, expect, beforeEach } from 'vitest';
import {
  AlertPrioritizer,
  enrichObstacle,
  sortObstacles,
  formatLabel,
  directionToNaturalPhrase,
} from '../alertPrioritizer';
import { DetectionPayload, ObstacleRaw } from '../../types/navigation';
import { getClassPriority, getProximityLevel } from '../../utils/constants';

describe('AlertPrioritizer & Classification Logic', () => {
  let prioritizer: AlertPrioritizer;

  beforeEach(() => {
    prioritizer = new AlertPrioritizer();
  });

  describe('Classification & Proximity', () => {
    it('classifies COCO object classes into correct severity priorities', () => {
      expect(getClassPriority('car', 500)).toBe('critical');
      expect(getClassPriority('truck', 500)).toBe('critical');
      expect(getClassPriority('person', 500)).toBe('high');
      expect(getClassPriority('chair', 500)).toBe('high');
      expect(getClassPriority('bicycle', 500)).toBe('medium');
      expect(getClassPriority('bottle', 500)).toBe('low');
    });

    it('elevates any object to critical if proximity is immediate danger (>= 750)', () => {
      expect(getClassPriority('chair', 780)).toBe('critical');
      expect(getClassPriority('bottle', 800)).toBe('critical');
    });

    it('categorizes proximity levels accurately', () => {
      expect(getProximityLevel(800)).toBe('immediate');
      expect(getProximityLevel(650)).toBe('near');
      expect(getProximityLevel(500)).toBe('approaching');
      expect(getProximityLevel(300)).toBe('far');
    });

    it('formats labels and natural phrases properly', () => {
      expect(formatLabel('dining_table')).toBe('Dining table');
      expect(formatLabel('traffic_light')).toBe('Traffic light');
      expect(directionToNaturalPhrase('left')).toBe('on your left');
      expect(directionToNaturalPhrase('right')).toBe('on your right');
      expect(directionToNaturalPhrase('center')).toBe('directly ahead');
    });
  });

  describe('Obstacle Sorting', () => {
    it('prioritizes critical obstacles over high/medium obstacles', () => {
      const rawObstacles: ObstacleRaw[] = [
        { label: 'chair', proximity: 680, direction: 'left', bbox: [0, 0, 0, 0] },
        { label: 'car', proximity: 620, direction: 'center', bbox: [0, 0, 0, 0] },
        { label: 'bottle', proximity: 700, direction: 'right', bbox: [0, 0, 0, 0] },
      ];

      const enriched = rawObstacles.map((r, i) => enrichObstacle(r, i));
      const sorted = sortObstacles(enriched);

      // Car is critical -> should be first
      expect(sorted[0].label).toBe('car');
      // Chair is high -> should be second
      expect(sorted[1].label).toBe('chair');
      // Bottle is low -> should be third
      expect(sorted[2].label).toBe('bottle');
    });
  });

  describe('Debouncing, Cooldown and Interrupts', () => {
    it('announces new obstacle immediately on first detection', () => {
      const payload: DetectionPayload = {
        status: 'ALERT',
        alert_side: 'left',
        obstacles: [
          { label: 'chair', proximity: 630, direction: 'left', bbox: [10, 10, 50, 50] },
        ],
      };

      const result = prioritizer.evaluate(payload, 2.5);
      expect(result.shouldAnnounce).toBe(true);
      expect(result.announcementPhrase).toBe('Chair on your left');
      expect(result.activeAlert.status).toBe('ALERT');
    });

    it('suppresses duplicate announcement when obstacle remains within cooldown window', () => {
      const payload: DetectionPayload = {
        status: 'ALERT',
        alert_side: 'left',
        obstacles: [
          { label: 'chair', proximity: 630, direction: 'left', bbox: [10, 10, 50, 50] },
        ],
      };

      // First announcement
      prioritizer.evaluate(payload, 2.5);

      // Immediate second frame (same obstacle, same proximity)
      const secondResult = prioritizer.evaluate(payload, 2.5);
      expect(secondResult.shouldAnnounce).toBe(false);
      expect(secondResult.reason).toBe('suppressed');
    });

    it('triggers immediate interrupt when obstacle gets significantly closer (>75 proximity jump)', () => {
      const payload1: DetectionPayload = {
        status: 'ALERT',
        alert_side: 'left',
        obstacles: [
          { label: 'chair', proximity: 600, direction: 'left', bbox: [10, 10, 50, 50] },
        ],
      };

      prioritizer.evaluate(payload1, 2.5);

      // Object jumped from 600 to 710 (+110)
      const payload2: DetectionPayload = {
        status: 'ALERT',
        alert_side: 'left',
        obstacles: [
          { label: 'chair', proximity: 710, direction: 'left', bbox: [10, 10, 50, 50] },
        ],
      };

      const result = prioritizer.evaluate(payload2, 2.5);
      expect(result.shouldAnnounce).toBe(true);
      expect(result.reason).toBe('closer-proximity');
      expect(result.announcementPhrase).toContain('getting closer');
    });

    it('triggers announcement when transitioning from alert back to clear path', () => {
      const alertPayload: DetectionPayload = {
        status: 'ALERT',
        alert_side: 'center',
        obstacles: [
          { label: 'person', proximity: 650, direction: 'center', bbox: [0, 0, 0, 0] },
        ],
      };

      prioritizer.evaluate(alertPayload, 2.5);

      const clearPayload: DetectionPayload = {
        status: 'CLEAR',
        alert_side: 'none',
        obstacles: [],
      };

      const clearResult = prioritizer.evaluate(clearPayload, 2.5);
      expect(clearResult.shouldAnnounce).toBe(true);
      expect(clearResult.announcementPhrase).toBe('Path clear');
      expect(clearResult.activeAlert.status).toBe('CLEAR');

      // Subsequent clear frame should NOT repeat "Path clear"
      const nextClear = prioritizer.evaluate(clearPayload, 2.5);
      expect(nextClear.shouldAnnounce).toBe(false);
    });
  });
});
