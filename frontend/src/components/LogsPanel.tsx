import React from 'react';
import { History, Trash2 } from 'lucide-react';
import { AlertLogEntry } from '../types/navigation';

interface LogsPanelProps {
  logs: AlertLogEntry[];
  onClearLogs?: () => void;
}

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs, onClearLogs }) => {
  return (
    <section
      aria-label="Recent Spoken Alert History"
      className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-lg transition-colors"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5 sm:pb-3 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <History className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-focus)] flex-shrink-0" aria-hidden="true" />
          <h2 className="font-bold text-sm sm:text-base md:text-lg text-[var(--text-primary)] tracking-wide">
            Recent Alert History ({logs.length})
          </h2>
        </div>
        {logs.length > 0 && onClearLogs && (
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 h-8 px-3 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] text-xs font-bold text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] hover:border-[var(--color-focus)] transition-colors cursor-pointer"
            aria-label="Clear alert history log"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="py-6 text-center text-[var(--text-muted)] text-sm font-bold">
          No alerts recorded yet. History will appear as navigation runs.
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1" role="log" aria-live="polite">
          {logs.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-start justify-between p-3.5 rounded-xl border-2 text-xs md:text-sm ${
                entry.priority === 'critical'
                  ? 'bg-[#3d0000] border-red-500 text-red-200'
                  : entry.isAlert
                  ? 'bg-[#332200] border-yellow-400 text-yellow-200'
                  : 'bg-[#002b11] border-[#00e676] text-[#00ff66]'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 font-black mb-0.5">
                  <span className="font-mono text-[var(--text-muted)] text-xs">{entry.timestamp}</span>
                  <span className="uppercase">{entry.title}</span>
                </div>
                <p className="text-[var(--text-primary)] text-xs font-semibold">{entry.detail}</p>
              </div>

              {entry.direction !== 'none' && (
                <span className="font-black uppercase ml-3 px-2.5 py-1 rounded-lg bg-black border border-[var(--border-subtle)] text-[var(--color-focus)] text-xs flex-shrink-0">
                  {entry.direction}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
