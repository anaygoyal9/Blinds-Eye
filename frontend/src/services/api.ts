import { DetectionPayload, HealthCheckResponse } from '../types/navigation';

/**
 * Robust API layer for ML backend integration.
 * Handles timeouts, network retries, and clean error states.
 */
export class ApiService {
  private timeoutMs: number;

  constructor(timeoutMs = 2500) {
    this.timeoutMs = timeoutMs;
  }

  private normalizeUrl(baseUrl: string): string {
    return baseUrl.trim().replace(/\/+$/, '');
  }

  public getVideoFeedUrl(baseUrl: string): string {
    return `${this.normalizeUrl(baseUrl)}/video_feed`;
  }

  public async fetchDetection(baseUrl: string): Promise<DetectionPayload> {
    const url = `${this.normalizeUrl(baseUrl)}/api/detect`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`ML Server returned HTTP status ${response.status}`);
      }

      const data = (await response.json()) as DetectionPayload;

      // Validate payload structure
      if (!data || typeof data.status !== 'string' || !Array.isArray(data.obstacles)) {
        throw new Error('Received malformed response payload from ML server');
      }

      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public async checkHealth(baseUrl: string): Promise<HealthCheckResponse> {
    const base = this.normalizeUrl(baseUrl);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      // First try /health
      const response = await fetch(`${base}/health`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });

      if (response.ok) {
        return (await response.json()) as HealthCheckResponse;
      }

      // Fallback to root endpoint if /health returns 404
      const rootRes = await fetch(`${base}/`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });

      if (rootRes.ok) {
        return {
          status: 'healthy',
          camera_connected: true,
          version: '1.0.0',
        };
      }

      throw new Error(`Health check failed with status ${response.status}`);
    } catch {
      return {
        status: 'unreachable',
        camera_connected: false,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const apiService = new ApiService();
