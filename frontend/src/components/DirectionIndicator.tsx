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
    icon: (cls: string) => React.ReactNode;
    subtitle: string;
  }> = [
    {
      dir: 'left',
      label: 'LEFT',
      icon: (cls) => <ArrowLeft className={cls} aria-hidden="true" />,
      subtitle:
        activeDirection === 'left' && isAlert && activeAlert.primaryObstacle
          ? activeAlert.primaryObstacle.displayName
          : 'CLEAR',
    },
    {
      dir: 'center',
      label: 'CENTER',
      icon: (cls) => <ArrowUp className={cls} aria-hidden="true" />,
      subtitle:
        activeDirection === 'center' && isAlert && activeAlert.primaryObstacle
          ? activeAlert.primaryObstacle.displayName
          : 'CLEAR',
    },
    {
      dir: 'right',
      label: 'RIGHT',
      icon: (cls) => <ArrowRight className={cls} aria-hidden="true" />,
      subtitle:
        activeDirection === 'right' && isAlert && activeAlert.primaryObstacle
          ? activeAlert.primaryObstacle.displayName
          : 'CLEAR',
    },
  ];

  return (
    <section
      aria-label="Spatial Direction Radar"
      className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-lg transition-colors"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4 border-b border-[var(--border-subtle)] pb-2.5 sm:pb-3">
        <h2 className="text-sm sm:text-base md:text-lg font-bold tracking-wide text-[var(--color-focus)]">
          Spatial Direction Radar
        </h2>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]">
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? (isAlert ? 'bg-yellow-400' : 'bg-emerald-400') : 'bg-gray-500'
            }`}
            aria-hidden="true"
          />
          <span>{isRunning ? (isAlert ? 'Obstacle Alert' : 'Path Clear') : 'Standby'}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        {directions.map((d) => {
          const isActive = activeDirection === d.dir;
          let cardStyle =
            'bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-70';
          let badgeStyle =
            'bg-black/60 text-[var(--text-muted)] border border-[var(--border-subtle)]';

          if (!isRunning) {
            cardStyle =
              'bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-50';
          } else if (isActive && isCritical) {
            cardStyle =
              'bg-[#3d0000] border-2 sm:border-3 border-red-500 text-white shadow-2xl scale-[1.02] sm:scale-[1.03] animate-pulse';
            badgeStyle = 'bg-red-600 text-white font-bold border border-white';
          } else if (isActive && isAlert) {
            cardStyle =
              'bg-[#332200] border-2 sm:border-3 border-yellow-400 text-yellow-200 shadow-xl scale-[1.02]';
            badgeStyle = 'bg-yellow-400 text-black font-bold border border-black';
          } else if (!isAlert) {
            cardStyle =
              'bg-[#002b11] border border-[#00e676] text-[#00ff66]';
            badgeStyle = 'bg-[#005522] text-[#00ff66] border border-[#00ff66]';
          }

          return (
            <div
              key={d.dir}
              role="region"
              aria-label={`${d.label} direction status: ${d.subtitle}`}
              className={`flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl transition-all duration-200 min-h-[96px] sm:min-h-[150px] md:min-h-[190px] ${cardStyle}`}
            >
              {/* Direction Icon */}
              <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center mb-1 sm:mb-2 md:mb-3">
                {!isAlert && isRunning ? (
                  <CheckCircle2 className="w-full h-full text-[#00ff66]" aria-hidden="true" />
                ) : (
                  d.icon("w-full h-full stroke-[3] sm:stroke-[3.5]")
                )}
              </div>

              {/* Direction Name */}
              <span className="text-xs sm:text-xl md:text-3xl lg:text-4xl font-black tracking-normal sm:tracking-wider uppercase text-center truncate max-w-full">
                {d.label}
              </span>

              {/* Obstacle Status Tag or Clean Standby Label */}
              {isRunning ? (
                <span
                  className={`mt-1 sm:mt-2.5 md:mt-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-xl text-[9px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-center max-w-full truncate ${badgeStyle}`}
                >
                  {d.subtitle}
                </span>
              ) : (
                <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-[var(--text-muted)] font-medium">
                  Ready
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
