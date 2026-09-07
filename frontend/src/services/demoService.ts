import { DetectionPayload } from '../types/navigation';

/**
 * Demo Service providing realistic simulated spatial navigation scenarios.
 * Strictly used for testing/demo when live camera or ML server is offline.
 */
export class DemoService {
  private step = 0;

  private scenarios: Array<{
    description: string;
    payload: DetectionPayload;
  }> = [
    {
      description: 'Clear corridor',
      payload: {
        status: 'CLEAR',
        alert_side: 'none',
        obstacles: [],
      },
    },
    {
      description: 'Chair detected on the left',
      payload: {
        status: 'ALERT',
        alert_side: 'left',
        obstacles: [
          {
            label: 'chair',
            proximity: 630,
            direction: 'left',
            bbox: [40, 150, 180, 420],
            confidence: 0.88,
          },
        ],
      },
    },
    {
      description: 'Person walking directly ahead',
      payload: {
        status: 'ALERT',
        alert_side: 'center',
        obstacles: [
          {
            label: 'person',
            proximity: 680,
            direction: 'center',
            bbox: [220, 80, 420, 460],
            confidence: 0.94,
          },
        ],
      },
    },
    {
      description: 'Critical collision alert - Vehicle directly ahead',
      payload: {
        status: 'ALERT',
        alert_side: 'center',
        obstacles: [
          {
            label: 'car',
            proximity: 810,
            direction: 'center',
            bbox: [180, 60, 480, 440],
            confidence: 0.96,
          },
          {
            label: 'person',
            proximity: 510,
            direction: 'left',
            bbox: [30, 120, 160, 380],
            confidence: 0.82,
          },
        ],
      },
    },
    {
      description: 'Bicycle parked on the right',
      payload: {
        status: 'ALERT',
        alert_side: 'right',
        obstacles: [
          {
            label: 'bicycle',
            proximity: 640,
            direction: 'right',
            bbox: [460, 140, 600, 410],
            confidence: 0.85,
          },
        ],
      },
    },
    {
      description: 'Multiple obstacles (Person Left, Chair Right)',
      payload: {
        status: 'ALERT',
        alert_side: 'left',
        obstacles: [
          {
            label: 'person',
            proximity: 710,
            direction: 'left',
            bbox: [50, 90, 200, 440],
            confidence: 0.92,
          },
          {
            label: 'chair',
            proximity: 620,
            direction: 'right',
            bbox: [450, 180, 580, 390],
            confidence: 0.81,
          },
        ],
      },
    },
  ];

  public getNextPayload(): { payload: DetectionPayload; description: string } {
    const scenario = this.scenarios[this.step % this.scenarios.length];
    this.step++;
    return scenario;
  }

  public reset(): void {
    this.step = 0;
  }
}

export const demoService = new DemoService();
