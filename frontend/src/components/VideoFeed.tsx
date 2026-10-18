import React, { useState } from 'react';
import { Camera, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { BackendStatus } from '../types/navigation';

interface VideoFeedProps {
  videoUrl: string;
  backendStatus: BackendStatus;
  isDemoMode: boolean;
  showFeed: boolean;
  onToggleShowFeed: (show: boolean) => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  videoUrl,
  backendStatus,
  isDemoMode,
  showFeed,
  onToggleShowFeed,
}) => {
  const [streamError, setStreamError] = useState(false);

  const isLive = backendStatus === 'online' && !isDemoMode && !streamError;

  return (
    <section
      aria-label="Live Sighted Companion Video Feed"
      className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl sm:rounded-3xl overflow-hidden transition-colors"
    >
      {/* Header */}
      <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[var(--bg-card-raised)] border-b border-[var(--border-subtle)] flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-focus)] flex-shrink-0" aria-hidden="true" />
          <h2 className="font-bold text-sm sm:text-base md:text-lg text-[var(--text-primary)] tracking-wide">
            Sighted Companion Stream (RGB + Depth)
          </h2>
        </div>

        <button
          onClick={() => onToggleShowFeed(!showFeed)}
          className="flex items-center gap-1.5 h-8 px-3 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] hover:border-[var(--color-focus)] rounded-lg text-xs font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
          aria-expanded={showFeed}
          aria-label={showFeed ? 'Hide Camera Feed' : 'Show Camera Feed'}
        >
          {showFeed ? (
            <>
              <EyeOff className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
              <span>Hide Stream</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-[var(--color-focus)]" aria-hidden="true" />
              <span>Show Stream</span>
            </>
          )}
        </button>
      </div>

      {/* Video Content */}
      {showFeed && (
        <div className="p-3 sm:p-5 bg-black flex flex-col items-center justify-center">
          {isLive ? (
            <div className="relative w-full max-w-4xl rounded-xl sm:rounded-2xl overflow-hidden border-3 border-[var(--border-subtle)] bg-black aspect-[16/9] sm:aspect-[2/1] md:aspect-[8/3]">
              <img
                src={videoUrl}
                alt="Live side-by-side RGB and Depth Map video stream from ML Backend"
                className="w-full h-full block object-contain"
                onError={() => setStreamError(true)}
                onLoad={() => setStreamError(false)}
              />
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black/90 border-2 border-[#00ff66] px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[#00ff66] text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#00ff66] rounded-full animate-pulse" />
                LIVE RGB + DEPTH
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl py-8 sm:py-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-3 border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col items-center text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[var(--bg-card-raised)] border-2 border-[var(--border-subtle)] flex items-center justify-center text-gray-400 mb-2 sm:mb-3">
                <AlertCircle className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-400" aria-hidden="true" />
              </div>
              <h4 className="text-lg sm:text-xl font-black text-[var(--text-primary)] mb-1">
                {isDemoMode
                  ? 'Demo Simulation Running'
                  : 'Live Video Feed Offline'}
              </h4>
              <p className="text-xs sm:text-sm md:text-base text-[var(--text-muted)] max-w-lg font-semibold">
                {isDemoMode
                  ? 'Simulated obstacle telemetry is actively streaming without requiring live camera hardware.'
                  : 'Start the Python ML server with python server.py to stream live video.'}
              </p>
              {!isDemoMode && streamError && (
                <button
                  onClick={() => setStreamError(false)}
                  className="mt-3 sm:mt-4 px-4 sm:px-5 py-2 sm:py-2.5 bg-[var(--bg-card-raised)] text-[var(--color-focus)] border-2 border-[var(--color-focus)] rounded-xl text-xs sm:text-sm font-black transition-colors cursor-pointer"
                >
                  Retry Connection
                </button>
              )}
            </div>
          )}

          <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-2.5 sm:mt-3 text-center font-bold">
            Annotated RGB (left) + MiDaS Inverse Depth Map (right). Designed for sighted companions and verification.
          </p>
        </div>
      )}
    </section>
  );
};
