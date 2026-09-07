import {
  ActiveAlert,
  AlertPriority,
  DetectionPayload,
  Direction,
  Obstacle,
  ObstacleRaw,
} from '../types/navigation';
import {
  getClassPriority,
  getProximityLevel,
  PROXIMITY_THRESHOLDS,
} from '../utils/constants';

export function formatLabel(rawLabel: string): string {
  if (!rawLabel) return 'Obstacle';
  const clean = rawLabel.replace(/_/g, ' ').trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function directionToNaturalPhrase(direction: Direction): string {
  switch (direction) {
    case 'left':
      return 'on your left';
    case 'right':
      return 'on your right';
    case 'center':
      return 'directly ahead';
    default:
      return 'ahead';
  }
}

export function enrichObstacle(raw: ObstacleRaw, index: number): Obstacle {
  const proximity = Math.max(0, Math.round(raw.proximity || 0));
  const proximityLevel = getProximityLevel(proximity);
  const priority = getClassPriority(raw.label, proximity);
  const displayName = formatLabel(raw.label);
  const now = Date.now();

  return {
    id: `${raw.label}-${raw.direction}-${index}-${now}`,
    label: raw.label.toLowerCase(),
    displayName,
    proximity,
    proximityLevel,
    direction: raw.direction || 'center',
    priority,
    confidence: typeof raw.confidence === 'number' ? raw.confidence : 0.85,
    bbox: raw.bbox || [0, 0, 0, 0],
    firstSeenAt: now,
    lastSeenAt: now,
  };
}

export const PRIORITY_WEIGHTS: Record<AlertPriority, number> = {
  critical: 4000,
  high: 3000,
  medium: 2000,
  low: 1000,
};

/**
 * Sort obstacles by danger level:
 * Higher priority class + closer proximity = most urgent.
 */
export function sortObstacles(obstacles: Obstacle[]): Obstacle[] {
  return [...obstacles].sort((a, b) => {
    const scoreA = PRIORITY_WEIGHTS[a.priority] + a.proximity;
    const scoreB = PRIORITY_WEIGHTS[b.priority] + b.proximity;
    return scoreB - scoreA;
  });
}

export interface EvaluationResult {
  activeAlert: ActiveAlert;
  shouldAnnounce: boolean;
  announcementPhrase: string;
  reason: 'state-change' | 'new-obstacle' | 'closer-proximity' | 'cooldown-elapsed' | 'suppressed' | 'none';
}

export class AlertPrioritizer {
  private lastAnnouncedKey: string = '';
  private lastAnnouncedProximity: number = 0;
  private lastAnnouncedAt: number = 0;
  private lastAlertStatus: 'CLEAR' | 'ALERT' | 'CRITICAL' = 'CLEAR';

  public reset(): void {
    this.lastAnnouncedKey = '';
    this.lastAnnouncedProximity = 0;
    this.lastAnnouncedAt = 0;
    this.lastAlertStatus = 'CLEAR';
  }

  public evaluate(
    payload: DetectionPayload,
    cooldownSeconds: number = 2.5
  ): EvaluationResult {
    const now = Date.now();
    const cooldownMs = cooldownSeconds * 1000;

    // 1. Process raw obstacles
    const enrichedList = (payload.obstacles || []).map((raw, idx) =>
      enrichObstacle(raw, idx)
    );
    const sortedList = sortObstacles(enrichedList);
    const primary = sortedList.length > 0 ? sortedList[0] : null;

    // 2. Determine alert status
    const isAlert = payload.status === 'ALERT' || (primary !== null && primary.proximity >= PROXIMITY_THRESHOLDS.NEAR);
    const isCritical = primary !== null && (primary.priority === 'critical' || primary.proximity >= PROXIMITY_THRESHOLDS.IMMEDIATE);

    const currentStatus: 'CLEAR' | 'ALERT' | 'CRITICAL' = !isAlert
      ? 'CLEAR'
      : isCritical
      ? 'CRITICAL'
      : 'ALERT';

    // 3. Formulate UI messages
    let title = 'PATH CLEAR';
    let detail = 'No immediate obstacle detected in walking path';
    let direction: Direction = 'none';
    let spokenPhrase = '';

    if (currentStatus === 'CLEAR') {
      title = 'PATH CLEAR';
      detail = 'Walking corridor is clear';
      direction = 'none';
      spokenPhrase = 'Path clear';
    } else if (primary) {
      direction = primary.direction;
      const dirPhrase = directionToNaturalPhrase(primary.direction);

      if (currentStatus === 'CRITICAL') {
        title = `STOP — ${primary.displayName.toUpperCase()} AHEAD`;
        detail = `${primary.displayName} ${dirPhrase}. Immediate collision hazard.`;
        spokenPhrase = `${primary.displayName} ${dirPhrase}. Stop.`;
      } else {
        title = `OBSTACLE DETECTED — ${primary.displayName.toUpperCase()}`;
        detail = `${primary.displayName} detected ${dirPhrase}`;
        spokenPhrase = `${primary.displayName} ${dirPhrase}`;
      }
    }

    const activeAlert: ActiveAlert = {
      isAlert: currentStatus !== 'CLEAR',
      status: currentStatus,
      primaryObstacle: primary,
      direction,
      title,
      detail,
      spokenPhrase,
      priority: primary ? primary.priority : 'none',
      allObstacles: sortedList,
      timestamp: now,
    };

    // 4. Evaluate whether speech/haptic should announce
    let shouldAnnounce = false;
    let announcementPhrase = spokenPhrase;
    let reason: EvaluationResult['reason'] = 'suppressed';

    if (currentStatus === 'CLEAR') {
      if (this.lastAlertStatus !== 'CLEAR') {
        // Announce clear only once when transitioning from an alert
        shouldAnnounce = true;
        reason = 'state-change';
        this.lastAlertStatus = 'CLEAR';
        this.lastAnnouncedKey = 'CLEAR';
        this.lastAnnouncedAt = now;
        this.lastAnnouncedProximity = 0;
      } else {
        reason = 'none';
      }
      return { activeAlert, shouldAnnounce, announcementPhrase, reason };
    }

    // Current status is ALERT or CRITICAL
    if (primary) {
      const obstacleKey = `${primary.label}-${primary.direction}-${currentStatus}`;
      const proximityDelta = primary.proximity - this.lastAnnouncedProximity;
      const timeSinceLastSpoken = now - this.lastAnnouncedAt;

      if (this.lastAlertStatus === 'CLEAR') {
        // Transition from CLEAR to ALERT
        shouldAnnounce = true;
        reason = 'state-change';
      } else if (this.lastAnnouncedKey !== obstacleKey) {
        // New obstacle or direction change
        shouldAnnounce = true;
        reason = 'new-obstacle';
      } else if (proximityDelta > 75) {
        // Significantly closer! Give progressive warning
        shouldAnnounce = true;
        announcementPhrase = `${primary.displayName} getting closer ${directionToNaturalPhrase(primary.direction)}`;
        reason = 'closer-proximity';
      } else if (timeSinceLastSpoken >= cooldownMs) {
        // Cooldown period passed for ongoing obstacle
        shouldAnnounce = true;
        reason = 'cooldown-elapsed';
      } else {
        // Debounce: Suppress duplicate announcement
        shouldAnnounce = false;
        reason = 'suppressed';
      }

      if (shouldAnnounce) {
        this.lastAnnouncedKey = obstacleKey;
        this.lastAnnouncedProximity = primary.proximity;
        this.lastAnnouncedAt = now;
        this.lastAlertStatus = currentStatus;
      }
    }

    return {
      activeAlert,
      shouldAnnounce,
      announcementPhrase,
      reason,
    };
  }
}
