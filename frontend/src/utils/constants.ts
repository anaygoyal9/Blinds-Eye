import { AlertPriority, AppSettings, ProximityLevel } from '../types/navigation';

/** Relative depth thresholds from MiDaS output */
export const PROXIMITY_THRESHOLDS = {
  IMMEDIATE: 750, // Extremely close / danger zone
  NEAR: 600,      // Warning zone (ML default alert threshold)
  APPROACHING: 450, // Notice zone
} as const;

export function getProximityLevel(proximity: number): ProximityLevel {
  if (proximity >= PROXIMITY_THRESHOLDS.IMMEDIATE) return 'immediate';
  if (proximity >= PROXIMITY_THRESHOLDS.NEAR) return 'near';
  if (proximity >= PROXIMITY_THRESHOLDS.APPROACHING) return 'approaching';
  return 'far';
}

/** COCO Object class severity priority mapping */
export const CLASS_PRIORITY_MAP: Record<string, AlertPriority> = {
  // Critical threats (moving vehicles, traffic signals)
  car: 'critical',
  bus: 'critical',
  truck: 'critical',
  motorcycle: 'critical',
  train: 'critical',
  'traffic light': 'critical',
  'stop sign': 'critical',

  // High importance obstacles (people, immediate tripping hazards)
  person: 'high',
  chair: 'high',
  couch: 'high',
  bench: 'high',
  bed: 'high',
  stairs: 'high',
  door: 'high',

  // Medium obstacles (stationary larger items, transport objects)
  bicycle: 'medium',
  'dining table': 'medium',
  desk: 'medium',
  backpack: 'medium',
  handbag: 'medium',
  suitcase: 'medium',
  refrigerator: 'medium',
  tv: 'medium',

  // Low importance / smaller objects
  bottle: 'low',
  cup: 'low',
  bowl: 'low',
  book: 'low',
  clock: 'low',
  vase: 'low',
  'potted plant': 'low',
  'cell phone': 'low',
  laptop: 'low',
  mouse: 'low',
  keyboard: 'low',
};

export function getClassPriority(label: string, proximity: number): AlertPriority {
  const normalized = label.toLowerCase().trim();
  // Any obstacle extremely close automatically elevates to critical
  if (proximity >= PROXIMITY_THRESHOLDS.IMMEDIATE) {
    return 'critical';
  }
  return CLASS_PRIORITY_MAP[normalized] || 'medium';
}

/** Vibration patterns (in milliseconds) for haptic feedback */
export const VIBRATION_PATTERNS = {
  left: [90, 60, 90],
  right: [180, 60, 180],
  center: [250, 80, 250],
  critical: [300, 50, 300, 50, 300],
  clear: [60],
  none: [0],
} as const;

/** Audio frequencies (Hz) and panning for spatial audio cues */
export const AUDIO_SPATIAL_PARAMS = {
  left: {
    pan: -0.9,
    frequency: 440, // A4
    duration: 0.15,
    type: 'sine' as OscillatorType,
  },
  right: {
    pan: 0.9,
    frequency: 660, // E5
    duration: 0.15,
    type: 'sine' as OscillatorType,
  },
  center: {
    pan: 0.0,
    frequency: 520, // C5
    duration: 0.2,
    type: 'triangle' as OscillatorType,
  },
  critical: {
    pan: 0.0,
    frequency: 880, // A5
    duration: 0.25,
    type: 'sawtooth' as OscillatorType,
  },
  clear: {
    pan: 0.0,
    frequency: 587.33, // D5 pleasant chime
    duration: 0.18,
    type: 'sine' as OscillatorType,
  },
} as const;

/** Default application configuration */
export const DEFAULT_SETTINGS: AppSettings = {
  backendUrl: 'http://127.0.0.1:8000',
  voiceEnabled: true,
  speechRate: 'normal',
  speechVolume: 1.0,
  spatialAudioEnabled: true,
  audioCuesEnabled: true,
  audioVolume: 0.8,
  hapticEnabled: true,
  cooldownSeconds: 2.5,
  alertFrequency: 'normal',
  textSize: 'large',
  contrastTheme: 'standard-dark',
  showVideoFeed: true,
  autoStartOnLoad: false,
};

export const SPEECH_RATES = {
  slow: 0.85,
  normal: 1.05,
  fast: 1.3,
} as const;

export const ALERT_FREQUENCY_COOLDOWNS = {
  high: 1.5,
  normal: 2.5,
  low: 4.5,
} as const;

export const SETTINGS_STORAGE_KEY = 'blinds_eye_settings_v1';
export const POLL_INTERVAL_MS = 330;
