import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ActiveAlert,
  AlertLogEntry,
  AppMode,
  AppSettings,
  BackendStatus,
  DetectionPayload,
  Direction,
} from '../types/navigation';
import { apiService } from '../services/api';
import { AlertPrioritizer } from '../services/alertPrioritizer';
import { speechService } from '../services/speechService';
import { audioService } from '../services/audioService';
import { hapticService } from '../services/hapticService';
import { demoService } from '../services/demoService';
import { ALERT_FREQUENCY_COOLDOWNS, POLL_INTERVAL_MS } from '../utils/constants';

const INITIAL_ALERT: ActiveAlert = {
  isAlert: false,
  status: 'CLEAR',
  primaryObstacle: null,
  direction: 'none',
  title: 'STANDBY',
  detail: 'Press Start Assistance to begin spatial navigation',
  spokenPhrase: '',
  priority: 'none',
  allObstacles: [],
  timestamp: Date.now(),
};

export function useNavigationEngine(settings: AppSettings) {
  const [isRunning, setIsRunning] = useState(false);
  const [appMode, setAppMode] = useState<AppMode>('assistance');
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('connecting');
  const [activeAlert, setActiveAlert] = useState<ActiveAlert>(INITIAL_ALERT);
  const [logs, setLogs] = useState<AlertLogEntry[]>([]);
  const [cameraHealthy, setCameraHealthy] = useState<boolean>(true);

  const prioritizerRef = useRef<AlertPrioritizer>(new AlertPrioritizer());
  const failuresRef = useRef<number>(0);
  const isPollingRef = useRef<boolean>(false);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addLogEntry = useCallback((alert: ActiveAlert) => {
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const entry: AlertLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: timeStr,
      title: alert.title,
      detail: alert.detail,
      direction: alert.direction,
      priority: alert.priority === 'none' ? 'clear' : alert.priority,
      isAlert: alert.isAlert,
    };

    setLogs((prev) => [entry, ...prev.slice(0, 19)]);
  }, []);

  // Process incoming telemetry payload
  const processPayload = useCallback(
    (payload: DetectionPayload) => {
      setBackendStatus('online');
      failuresRef.current = 0;

      const effectiveCooldown =
        ALERT_FREQUENCY_COOLDOWNS[settings.alertFrequency] || settings.cooldownSeconds;

      const evalResult = prioritizerRef.current.evaluate(payload, effectiveCooldown);
      setActiveAlert(evalResult.activeAlert);

      // Trigger feedback if announcement condition met
      if (evalResult.shouldAnnounce) {
        // 1. Spoken voice announcement
        if (evalResult.announcementPhrase) {
          speechService.speak(
            evalResult.announcementPhrase,
            settings.speechRate,
            settings.speechVolume,
            settings.voiceEnabled
          );
        }

        // 2. Spatial directional audio cue
        if (settings.spatialAudioEnabled && settings.audioCuesEnabled) {
          audioService.playDirectionalCue(
            evalResult.activeAlert.direction,
            evalResult.activeAlert.priority === 'critical'
              ? 'critical'
              : evalResult.activeAlert.status === 'CLEAR'
              ? 'clear'
              : 'high',
            settings.audioVolume,
            true
          );
        }

        // 3. Rhythmic haptic vibration
        if (settings.hapticEnabled) {
          hapticService.vibrate(
            evalResult.activeAlert.direction,
            evalResult.activeAlert.priority === 'critical'
              ? 'critical'
              : evalResult.activeAlert.status === 'CLEAR'
              ? 'clear'
              : 'high',
            true
          );
        }

        // Add to recent activity log
        addLogEntry(evalResult.activeAlert);
      }
    },
    [settings, addLogEntry]
  );

  // Single poll iteration
  const executePoll = useCallback(async () => {
    if (isPollingRef.current) return;
    isPollingRef.current = true;

    try {
      if (appMode === 'demo') {
        // Run demo simulator
        const demoData = demoService.getNextPayload();
        processPayload(demoData.payload);
      } else {
        // Live ML Backend API
        const payload = await apiService.fetchDetection(settings.backendUrl);
        processPayload(payload);
      }
    } catch {
      failuresRef.current += 1;
      if (failuresRef.current >= 3) {
        setBackendStatus('offline');
        setActiveAlert((prev) => ({
          ...prev,
          status: 'ALERT',
          title: 'BACKEND OFFLINE',
          detail: 'Unable to reach ML server. Start server with python server.py',
          direction: 'none',
          isAlert: true,
        }));
      }
    } finally {
      isPollingRef.current = false;
    }
  }, [appMode, settings.backendUrl, processPayload]);

  // Main polling loop
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isActive = true;

    const pollLoop = async () => {
      if (!isActive || !isRunning) return;
      await executePoll();
      if (isActive && isRunning) {
        const interval = appMode === 'demo' ? 1800 : POLL_INTERVAL_MS;
        timeoutId = setTimeout(pollLoop, interval);
      }
    };

    if (isRunning) {
      pollLoop();
    } else {
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current);
      }
    }

    return () => {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isRunning, appMode, executePoll]);

  // Periodic health check when idle or starting
  useEffect(() => {
    let isMounted = true;
    const checkServerHealth = async () => {
      if (appMode === 'demo') {
        setBackendStatus('online');
        setCameraHealthy(true);
        return;
      }
      try {
        const res = await apiService.checkHealth(settings.backendUrl);
        if (isMounted) {
          if (res.status === 'healthy') {
            setBackendStatus('online');
            setCameraHealthy(res.camera_connected);
          } else {
            setBackendStatus('offline');
            setCameraHealthy(false);
          }
        }
      } catch {
        if (isMounted) {
          setBackendStatus('offline');
          setCameraHealthy(false);
        }
      }
    };

    checkServerHealth();
    const interval = setInterval(checkServerHealth, 6000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [settings.backendUrl, appMode]);

  // Toggle navigation on/off
  const startNavigation = useCallback(() => {
    audioService.unlockAudioContext();
    setIsRunning(true);
    prioritizerRef.current.reset();
    demoService.reset();

    const startPhrase =
      appMode === 'demo' ? 'Demo navigation mode activated' : 'Navigation started';
    speechService.speak(startPhrase, settings.speechRate, settings.speechVolume, settings.voiceEnabled);
    audioService.playClearCue(settings.audioVolume, settings.audioCuesEnabled);
  }, [appMode, settings]);

  const stopNavigation = useCallback(() => {
    setIsRunning(false);
    speechService.stop();
    hapticService.stop();
    prioritizerRef.current.reset();

    setActiveAlert({
      ...INITIAL_ALERT,
      title: 'STANDBY',
      detail: 'Navigation paused',
    });
    speechService.speak('Navigation stopped', settings.speechRate, settings.speechVolume, settings.voiceEnabled);
  }, [settings]);

  const toggleNavigation = useCallback(() => {
    if (isRunning) {
      stopNavigation();
    } else {
      startNavigation();
    }
  }, [isRunning, startNavigation, stopNavigation]);

  // Test simulation trigger
  const triggerManualTest = useCallback(
    (direction: Direction, obstacleLabel: string, proximity: number, isCritical = false) => {
      audioService.unlockAudioContext();

      const testPayload: DetectionPayload = {
        status: isCritical || proximity >= 600 ? 'ALERT' : 'CLEAR',
        alert_side: direction,
        obstacles: [
          {
            label: obstacleLabel,
            proximity,
            direction: direction === 'none' ? 'center' : direction,
            bbox: [100, 100, 300, 300],
            confidence: 0.95,
          },
        ],
      };

      processPayload(testPayload);
    },
    [processPayload]
  );

  return {
    isRunning,
    appMode,
    backendStatus,
    activeAlert,
    logs,
    cameraHealthy,
    setAppMode,
    startNavigation,
    stopNavigation,
    toggleNavigation,
    triggerManualTest,
  };
}
