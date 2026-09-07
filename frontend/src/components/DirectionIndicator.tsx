import React from 'react';
import { ArrowLeft, ArrowUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ActiveAlert, Direction } from '../types/navigation';

interface DirectionIndicatorProps {
  activeAlert: ActiveAlert;
  isRunning: boolean;
}

export const DirectionIndicator: React.FC<DirectionIndicatorProps> = ({
  activeAlert,
  isRunning,
}) => {
  const activeDirection: Direction = isRunning ? activeAlert.direction : 'none';
  const isAlert = isRunning && activeAlert.isAlert;
  const isCritical = isRunning && activeAlert.status === 'CRITICAL';

  const directions: Array<{
    dir: 'left' | 'center' | 'right';
    label: string;
    icon: React.ReactNode;
    subtitle: string;
  }> = [
    {
      dir: 'left',
      label: 'LEFT',
      icon: <ArrowLeft className="w-10 h-10 md:w-14 md:h-14 stroke-[3]" aria-hidden="true" />,
      subtitle: activeDirection === 'left' && isAlert && activeAlert.primaryObstacle ? activeAlert.primaryObstacle.displayName : 'CLEAR',
    },
    {
      dir: 'center',
      label: 'CENTER',
      icon: <ArrowUp className="w-10 h-10 md:w-14 md:h-14 stroke-[3]" aria-hidden="true" />,
      subtitle: activeDirection === 'center' && isAlert && activeAlert.primaryObstacle ? activeAlert.primaryObstacle.displayName : 'CLEAR',
    },
    {
      dir: 'right',
      label: 'RIGHT',
      icon: <ArrowRight className="w-10 h-10 md:w-14 md:h-14 stroke-[3]" aria-hidden="true" />,
      subtitle: activeDirection === 'right' && isAlert && activeAlert.primaryObstacle ? activeAlert.primaryObstacle.displayName : 'CLEAR',
    },
  ];

  return (
    <section
      aria-label="Directional Obstacle Radar"
      className="w-full bg-[#0e141d] border-2 border-[#243242] rounded-2xl p-4 md:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-cyan-400">
          SPATIAL DIRECTION RADAR
        </h3>
        <span className="text-xs text-gray-400 font-bold uppercase">
          {isRunning ? (isAlert ? 'OBSTACLE DETECTED' : 'ALL CLEAR') : 'STANDBY'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {directions.map((d) => {
          const isActive = activeDirection === d.dir;
          let cardStyle = 'bg-[#141b24] border-2 border-[#283747] text-gray-400';
          let badgeStyle = 'bg-gray-800 text-gray-400 border border-gray-700';

          if (!isRunning) {
            cardStyle = 'bg-[#141b24] border-2 border-[#283747] text-gray-500 opacity-60';
          } else if (isActive && isCritical) {
            cardStyle = 'bg-red-950 border-4 border-red-500 text-white shadow-2xl shadow-red-900/60 scale-[1.03] animate-pulse';
            badgeStyle = 'bg-red-600 text-white font-black border-2 border-white';
          } else if (isActive && isAlert) {
            cardStyle = 'bg-amber-950/80 border-4 border-amber-400 text-amber-200 shadow-xl shadow-amber-950/50 scale-[1.02]';
            badgeStyle = 'bg-amber-400 text-black font-black';
          } else if (!isAlert) {
            cardStyle = 'bg-[#021f10] border-2 border-emerald-600/60 text-emerald-300';
            badgeStyle = 'bg-emerald-800/80 text-emerald-200 border border-emerald-600';
          }

          return (
            <div
              key={d.dir}
              role="region"
              aria-label={`${d.label} direction status: ${d.subtitle}`}
              className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl transition-all duration-200 ${cardStyle}`}
            >
              {/* Direction Icon */}
              <div className="mb-2">
                {!isAlert && isRunning ? (
                  <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" aria-hidden="true" />
                ) : (
                  d.icon
                )}
              </div>

              {/* Direction Name */}
              <span className="text-xl md:text-3xl font-black tracking-wide uppercase">
                {d.label}
              </span>

              {/* Status/Obstacle Tag */}
              <span
                className={`mt-2 px-2.5 py-1 rounded-lg text-xs md:text-sm font-extrabold uppercase tracking-wider text-center max-w-full truncate ${badgeStyle}`}
              >
                {isRunning ? d.subtitle : 'OFFLINE'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
