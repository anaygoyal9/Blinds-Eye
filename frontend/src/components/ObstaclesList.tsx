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
        return 'text-gray-300 bg-gray-900 border border-gray-600';
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
      className="w-full bg-[var(--bg-card)] border-3 border-[var(--border-subtle)] rounded-3xl p-5 md:p-7 shadow-xl transition-colors"
    >
      <div className="flex items-center justify-between mb-4 border-b-2 border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-[var(--color-focus)]" aria-hidden="true" />
          <h3 className="font-black text-lg md:text-xl text-[var(--text-primary)] uppercase tracking-wider">
            PRIORITIZED OBSTACLES ({isRunning ? obstacles.length : 0})
          </h3>
        </div>
        <span className="text-xs md:text-sm text-[var(--text-muted)] font-black uppercase">
          Sorted by Hazard Level
        </span>
      </div>

      {!isRunning || obstacles.length === 0 ? (
        <div className="py-8 text-center text-[var(--text-muted)] bg-[var(--bg-card-raised)] rounded-2xl border-2 border-[var(--border-subtle)]">
          <p className="text-base md:text-lg font-bold">
            {isRunning ? '✓ Walking corridor is clear. No obstacles detected.' : 'Navigation is paused.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3" role="list">
          {obstacles.map((obs, index) => (
            <li
              key={obs.id || index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-5 bg-[var(--bg-card-raised)] border-3 border-[var(--border-subtle)] rounded-2xl gap-4 transition-colors"
            >
              {/* Obstacle info */}
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-full bg-black border-2 border-[var(--border-strong)] flex items-center justify-center font-mono font-black text-sm text-[var(--color-focus)]">
                  {index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl md:text-2xl font-black text-[var(--text-primary)] capitalize">
                      {obs.displayName}
                    </span>
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md ${getPriorityBadge(
                        obs.priority
                      )}`}
                    >
                      {obs.priority}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-mono font-bold">
                    Confidence: {(obs.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Direction & Proximity Badges */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className="font-black text-base md:text-lg text-[var(--text-primary)] bg-black px-4 py-2 rounded-xl border-2 border-[var(--border-strong)]">
                  {getDirectionText(obs.direction)}
                </span>
                <span
                  className={`text-xs md:text-sm font-black uppercase px-3.5 py-2 rounded-xl border flex items-center gap-1.5 ${getProximityBadge(
                    obs.proximityLevel
                  )}`}
                >
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
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
