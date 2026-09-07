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
      aria-label="Recent Alert History"
      className="w-full bg-[#0e141d] border-2 border-[#243242] rounded-2xl p-5 md:p-6"
    >
      <div className="flex items-center justify-between border-b border-[#243242] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" aria-hidden="true" />
          <h3 className="font-extrabold text-base md:text-lg text-white">
            RECENT ALERT HISTORY ({logs.length})
          </h3>
        </div>
        {logs.length > 0 && onClearLogs && (
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#1a232f] hover:bg-[#253344] text-xs font-bold text-gray-300 rounded-lg border border-[#36495f] transition-colors cursor-pointer"
            aria-label="Clear alert history log"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="py-6 text-center text-gray-500 text-sm font-semibold">
          No alerts recorded yet. History will appear as navigation runs.
        </div>
      ) : (
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1" role="log" aria-live="polite">
          {logs.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-start justify-between p-3 rounded-xl border text-xs md:text-sm ${
                entry.priority === 'critical'
                  ? 'bg-red-950/60 border-red-500/80 text-red-200'
                  : entry.isAlert
                  ? 'bg-[#181d26] border-amber-500/60 text-amber-200'
                  : 'bg-[#0f1720] border-emerald-500/40 text-emerald-200'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold mb-0.5">
                  <span className="font-mono text-gray-400 text-xs">{entry.timestamp}</span>
                  <span className="uppercase">{entry.title}</span>
                </div>
                <p className="text-gray-300 text-xs font-medium">{entry.detail}</p>
              </div>

              {entry.direction !== 'none' && (
                <span className="font-extrabold uppercase ml-3 px-2 py-1 rounded bg-black/40 border border-gray-700 text-cyan-300 text-xs flex-shrink-0">
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
