import React from 'react';
import { Layers, AlertTriangle } from 'lucide-react';
import { Obstacle } from '../types/navigation';

interface ObstaclesListProps {
  obstacles: Obstacle[];
  isRunning: boolean;
}

export const ObstaclesList: React.FC<ObstaclesListProps> = ({
  obstacles,
  isRunning,
}) => {
  const getPriorityBadge = (priority: Obstacle['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-600 text-white border-2 border-white';
      case 'high':
        return 'bg-yellow-400 text-black border-2 border-black font-black';
      case 'medium':
        return 'bg-cyan-900 text-cyan-200 border border-cyan-400';
      case 'low':
        return 'bg-gray-800 text-gray-200 border border-gray-500';
    }
  };

  const getProximityBadge = (level: Obstacle['proximityLevel']) => {
    switch (level) {
      case 'immediate':
        return 'text-white bg-red-700 border-2 border-white font-black';
      case 'near':
        return 'text-black bg-yellow-400 border-2 border-black font-black';
      case 'approaching':
        return 'text-cyan-200 bg-cyan-950 border border-cyan-400';
      case 'far':
        return 'text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border-subtle)]';
    }
  };

  const getDirectionText = (dir: Obstacle['direction']) => {
    switch (dir) {
      case 'left':
        return '← LEFT';
      case 'right':
        return 'RIGHT →';
      case 'center':
        return '↑ CENTER';
      default:
        return 'AHEAD';
    }
  };

  return (
    <section
      aria-label="Prioritized Detected Obstacles"
      className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-lg transition-colors"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4 border-b border-[var(--border-subtle)] pb-2.5 sm:pb-3">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-focus)] flex-shrink-0" aria-hidden="true" />
          <h2 className="font-bold text-sm sm:text-base md:text-lg text-[var(--text-primary)] tracking-wide">
            Prioritized Obstacles ({isRunning ? obstacles.length : 0})
          </h2>
        </div>
        <span className="text-xs sm:text-sm text-[var(--text-muted)] font-medium">
          Sorted by Hazard Level
        </span>
      </div>

      {!isRunning || obstacles.length === 0 ? (
        <div className="py-6 sm:py-8 px-4 text-center text-[var(--text-muted)] bg-[var(--bg-card-raised)] rounded-xl sm:rounded-2xl border border-[var(--border-subtle)]">
          <p className="text-sm sm:text-base md:text-lg font-bold">
            {isRunning ? '✓ Walking corridor is clear. No obstacles detected.' : 'Navigation is paused.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5 sm:space-y-3" role="list">
          {obstacles.map((obs, index) => (
            <li
              key={obs.id || index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 md:p-5 bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] rounded-xl sm:rounded-2xl gap-3 sm:gap-4 transition-colors"
            >
              {/* Obstacle info */}
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border-strong)] flex items-center justify-center font-mono font-black text-xs sm:text-sm text-[var(--color-focus)] flex-shrink-0">
                  {index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-xl md:text-2xl font-black text-[var(--text-primary)] capitalize">
                      {obs.displayName}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-black uppercase px-2 sm:px-2.5 py-0.5 rounded-md ${getPriorityBadge(
                        obs.priority
                      )}`}
                    >
                      {obs.priority}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs text-[var(--text-muted)] font-mono font-bold block">
                    Confidence: {(obs.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Direction & Proximity Badges */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className="font-black text-xs sm:text-base md:text-lg text-[var(--text-primary)] bg-[var(--bg-card)] px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border-2 border-[var(--border-strong)]">
                  {getDirectionText(obs.direction)}
                </span>
                <span
                  className={`text-xs md:text-sm font-black uppercase px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border flex items-center gap-1.5 ${getProximityBadge(
                    obs.proximityLevel
                  )}`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
                  {obs.proximityLevel} ({obs.proximity})
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
