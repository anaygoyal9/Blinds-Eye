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
      icon: <ArrowLeft className="w-12 h-12 md:w-16 md:h-16 stroke-[3.5]" aria-hidden="true" />,
      subtitle:
        activeDirection === 'left' && isAlert && activeAlert.primaryObstacle
          ? activeAlert.primaryObstacle.displayName
          : 'CLEAR',
    },
    {
      dir: 'center',
      label: 'CENTER',
      icon: <ArrowUp className="w-12 h-12 md:w-16 md:h-16 stroke-[3.5]" aria-hidden="true" />,
      subtitle:
        activeDirection === 'center' && isAlert && activeAlert.primaryObstacle
          ? activeAlert.primaryObstacle.displayName
          : 'CLEAR',
    },
    {
      dir: 'right',
      label: 'RIGHT',
      icon: <ArrowRight className="w-12 h-12 md:w-16 md:h-16 stroke-[3.5]" aria-hidden="true" />,
      subtitle:
        activeDirection === 'right' && isAlert && activeAlert.primaryObstacle
          ? activeAlert.primaryObstacle.displayName
          : 'CLEAR',
    },
  ];

  return (
    <section
      aria-label="Spatial Direction Radar"
      className="w-full bg-[var(--bg-card)] border-3 border-[var(--border-subtle)] rounded-3xl p-5 md:p-7 shadow-xl transition-colors"
    >
      <div className="flex items-center justify-between mb-4 border-b-2 border-[var(--border-subtle)] pb-3">
        <h3 className="text-base md:text-lg font-black uppercase tracking-widest text-[var(--color-focus)]">
          SPATIAL DIRECTION RADAR
        </h3>
        <span className="text-xs md:text-sm font-black uppercase px-3 py-1 rounded-lg bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
          {isRunning ? (isAlert ? '⚠ OBSTACLE DETECTED' : '✓ PATH CLEAR') : 'STANDBY'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {directions.map((d) => {
          const isActive = activeDirection === d.dir;
          let cardStyle =
            'bg-[var(--bg-card-raised)] border-3 border-[var(--border-subtle)] text-[var(--text-muted)] opacity-70';
          let badgeStyle =
            'bg-black/60 text-[var(--text-muted)] border border-[var(--border-subtle)]';

          if (!isRunning) {
            cardStyle =
              'bg-[var(--bg-card-raised)] border-3 border-[var(--border-subtle)] text-[var(--text-muted)] opacity-50';
          } else if (isActive && isCritical) {
            cardStyle =
              'bg-[#3d0000] border-4 border-red-500 text-white shadow-2xl scale-[1.03] animate-pulse';
            badgeStyle = 'bg-red-600 text-white font-black border-2 border-white';
          } else if (isActive && isAlert) {
            cardStyle =
              'bg-[#332200] border-4 border-yellow-400 text-yellow-200 shadow-2xl scale-[1.02]';
            badgeStyle = 'bg-yellow-400 text-black font-black border-2 border-black';
          } else if (!isAlert) {
            cardStyle =
              'bg-[#002b11] border-3 border-[#00e676] text-[#00ff66]';
            badgeStyle = 'bg-[#005522] text-[#00ff66] border border-[#00ff66]';
          }

          return (
            <div
              key={d.dir}
              role="region"
              aria-label={`${d.label} direction status: ${d.subtitle}`}
              className={`flex flex-col items-center justify-center p-4 md:p-7 rounded-2xl transition-all duration-200 ${cardStyle}`}
            >
              {/* Direction Icon */}
              <div className="mb-3">
                {!isAlert && isRunning ? (
                  <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-[#00ff66]" aria-hidden="true" />
                ) : (
                  d.icon
                )}
              </div>

              {/* Direction Name */}
              <span className="text-2xl md:text-4xl font-black tracking-wider uppercase">
                {d.label}
              </span>

              {/* Obstacle Status Tag */}
              <span
                className={`mt-3 px-3 py-1.5 rounded-xl text-xs md:text-base font-black uppercase tracking-wider text-center max-w-full truncate ${badgeStyle}`}
              >
                {isRunning ? d.subtitle : 'STANDBY'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
