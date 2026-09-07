/**
 * Core domain types for Blind's Eye Assistive Spatial Navigation System
 */

export type Direction = 'left' | 'center' | 'right' | 'none';

export type BackendStatus = 'online' | 'offline' | 'connecting';

export type AppMode = 'assistance' | 'demo' | 'test';

export type AlertPriority = 'critical' | 'high' | 'medium' | 'low';

export type ProximityLevel = 'immediate' | 'near' | 'approaching' | 'far';

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Raw obstacle format directly from ML backend /api/detect */
export interface ObstacleRaw {
  label: string;
  proximity: number;      // Relative depth value (higher = closer)
  direction: 'left' | 'center' | 'right';
  bbox: [number, number, number, number];
  confidence?: number;
}

/** Raw response payload directly from ML backend /api/detect */
export interface DetectionPayload {
  status: 'ALERT' | 'CLEAR';
  alert_side: Direction;
  obstacles: ObstacleRaw[];
}

/** Processed, enriched obstacle for UI and alert prioritization */
export interface Obstacle {
  id: string;
  label: string;
  displayName: string;
  proximity: number;
  proximityLevel: ProximityLevel;
  direction: Direction;
  priority: AlertPriority;
  confidence: number;
  bbox: [number, number, number, number];
  firstSeenAt: number;
  lastSeenAt: number;
}

/** Active alert evaluated by the prioritizing engine */
export interface ActiveAlert {
  isAlert: boolean;
  status: 'CLEAR' | 'ALERT' | 'CRITICAL';
  primaryObstacle: Obstacle | null;
  direction: Direction;
  title: string;
  detail: string;
  spokenPhrase: string;
  priority: AlertPriority | 'none';
  allObstacles: Obstacle[];
  timestamp: number;
}

/** User configuration and accessibility settings */
export type TextSize = 'normal' | 'large' | 'extra-large';
export type ContrastTheme = 'standard-dark' | 'ultra-high-contrast';
export type SpeechRate = 'slow' | 'normal' | 'fast';
export type AlertFrequency = 'low' | 'normal' | 'high';

export interface AppSettings {
  backendUrl: string;
  voiceEnabled: boolean;
  speechRate: SpeechRate;
  speechVolume: number;        // 0.0 - 1.0
  spatialAudioEnabled: boolean;
  audioCuesEnabled: boolean;
  audioVolume: number;         // 0.0 - 1.0
  hapticEnabled: boolean;
  cooldownSeconds: number;     // 1.0 - 5.0
  alertFrequency: AlertFrequency;
  textSize: TextSize;
  contrastTheme: ContrastTheme;
  showVideoFeed: boolean;
  autoStartOnLoad: boolean;
}

export interface AlertLogEntry {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  direction: Direction;
  priority: AlertPriority | 'clear';
  isAlert: boolean;
}

export interface HealthCheckResponse {
  status: string;
  camera_connected: boolean;
  camera_source?: string;
  version?: string;
}
