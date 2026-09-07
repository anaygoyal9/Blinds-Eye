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
        return 'bg-red-600 text-white border-red-400';
      case 'high':
        return 'bg-amber-500 text-black border-amber-300';
      case 'medium':
        return 'bg-sky-700 text-white border-sky-400';
      case 'low':
        return 'bg-gray-700 text-gray-200 border-gray-500';
    }
  };

  const getProximityBadge = (level: Obstacle['proximityLevel']) => {
    switch (level) {
      case 'immediate':
        return 'text-red-400 bg-red-950/80 border-red-500';
      case 'near':
        return 'text-amber-300 bg-amber-950/80 border-amber-400';
      case 'approaching':
        return 'text-sky-300 bg-sky-950/80 border-sky-400';
      case 'far':
        return 'text-gray-300 bg-gray-900 border-gray-600';
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
      aria-label="Detected Obstacles Priority List"
      className="w-full bg-[#0e141d] border-2 border-[#243242] rounded-2xl p-5 md:p-6"
    >
      <div className="flex items-center justify-between mb-4 border-b border-[#243242] pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" aria-hidden="true" />
          <h3 className="font-extrabold text-base md:text-lg text-white">
            PRIORITIZED OBSTACLES ({isRunning ? obstacles.length : 0})
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-semibold uppercase">
          Sorted by Danger Priority
        </span>
      </div>

      {!isRunning || obstacles.length === 0 ? (
        <div className="py-8 text-center text-gray-400 bg-[#090d13] rounded-xl border border-[#1e2a38]">
          <p className="text-base font-semibold">
            {isRunning ? 'No obstacles currently in path' : 'Navigation inactive'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3" role="list">
          {obstacles.map((obs, index) => (
            <li
              key={obs.id || index}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 md:p-4 bg-[#141d27] border-2 border-[#243242] rounded-xl gap-3"
            >
              {/* Obstacle info */}
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#202c3a] border border-[#3b506b] flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                  {index + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg md:text-xl font-bold text-white capitalize">
                      {obs.displayName}
                    </span>
                    <span
                      className={`text-[11px] font-black uppercase px-2 py-0.5 rounded border ${getPriorityBadge(
                        obs.priority
                      )}`}
                    >
                      {obs.priority}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    Confidence: {(obs.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Direction & Proximity Badges */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                <span className="font-extrabold text-sm md:text-base text-cyan-300 bg-[#1b2837] px-3 py-1.5 rounded-lg border border-[#30455e]">
                  {getDirectionText(obs.direction)}
                </span>
                <span
                  className={`text-xs md:text-sm font-bold uppercase px-3 py-1.5 rounded-lg border flex items-center gap-1.5 ${getProximityBadge(
                    obs.proximityLevel
                  )}`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
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
