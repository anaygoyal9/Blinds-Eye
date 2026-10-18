import React from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  CornerUpRight,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { AlertLogEntry } from '../../types/navigation';

interface AlertsHistoryScreenProps {
  logs: AlertLogEntry[];
  onBack: () => void;
  onClearLogs?: () => void;
}

export const AlertsHistoryScreen: React.FC<AlertsHistoryScreenProps> = ({
  logs,
  onBack,
  onClearLogs,
}) => {
  // Built-in historical seed entries matching wireframe Screen 7
  const seedItems = [
    {
      id: 'seed-1',
      time: '10:24 AM',
      title: 'Obstacle ahead (0.8 m)',
      type: 'warning',
      icon: AlertTriangle,
      color: 'text-yellow-400',
    },
    {
      id: 'seed-2',
      time: '10:22 AM',
      title: 'Turn right (20 m)',
      type: 'turn',
      icon: CornerUpRight,
      color: 'text-cyan-400',
    },
    {
      id: 'seed-3',
      time: '10:19 AM',
      title: 'Obstacle on left (2.0 m)',
      type: 'warning',
      icon: AlertTriangle,
      color: 'text-yellow-400',
    },
    {
      id: 'seed-4',
      time: '10:15 AM',
      title: 'Path clear',
      type: 'clear',
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
    {
      id: 'seed-5',
      time: '10:12 AM',
      title: 'Destination nearby (50 m)',
      type: 'destination',
      icon: MapPin,
      color: 'text-[var(--color-focus)]',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen px-4 pt-3 pb-24 bg-[var(--bg-main)] text-[var(--text-primary)] max-w-md mx-auto transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl text-[var(--text-primary)] hover:bg-white/10 cursor-pointer"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Alerts History
          </h1>
        </div>

        {onClearLogs && (
          <button
            onClick={onClearLogs}
            className="p-2 text-xs text-[var(--text-muted)] hover:text-white flex items-center gap-1 cursor-pointer"
            aria-label="Clear alert history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </header>

      {/* Subheading Today */}
      <div className="mb-3">
        <h2 className="text-xs sm:text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider px-1">
          Today
        </h2>
      </div>

      {/* Dynamic Log Entries if present */}
      <div className="flex flex-col gap-2.5">
        {logs.length > 0 &&
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    log.priority === 'critical'
                      ? 'bg-red-950/60 text-red-400'
                      : log.isAlert
                      ? 'bg-yellow-950/60 text-yellow-400'
                      : 'bg-emerald-950/60 text-emerald-400'
                  }`}
                >
                  {log.isAlert ? (
                    <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {log.timestamp}
                    </span>
                    <span className="text-xs font-black uppercase text-[var(--color-focus)]">
                      {log.direction !== 'none' ? log.direction : ''}
                    </span>
                  </div>
                  <span className="block font-bold text-sm text-[var(--text-primary)]">
                    {log.title}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" aria-hidden="true" />
            </div>
          ))}

        {/* Wireframe Reference History Items */}
        {seedItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--color-focus)] rounded-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-raised)] flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${item.color}`} aria-hidden="true" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[var(--text-muted)] block">
                    {item.time}
                  </span>
                  <span className="block font-bold text-sm sm:text-base text-[var(--text-primary)]">
                    {item.title}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--color-focus)] transition-colors flex-shrink-0" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
