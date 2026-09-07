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
      className="w-full bg-[var(--bg-card)] border-3 border-[var(--border-subtle)] rounded-3xl overflow-hidden transition-colors"
    >
      {/* Header */}
      <div className="px-6 py-4 bg-[var(--bg-card-raised)] border-b-2 border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-[var(--color-focus)]" aria-hidden="true" />
          <h3 className="font-black text-base md:text-lg text-[var(--text-primary)] uppercase tracking-wider">
            Sighted Companion Stream (RGB + Depth Map)
          </h3>
        </div>

        <button
          onClick={() => onToggleShowFeed(!showFeed)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border-2 border-[var(--border-subtle)] rounded-xl text-xs md:text-sm font-black text-[var(--text-primary)] transition-colors cursor-pointer"
          aria-expanded={showFeed}
          aria-label={showFeed ? 'Hide Camera Feed' : 'Show Camera Feed'}
        >
          {showFeed ? (
            <>
              <EyeOff className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
              <span>Hide Stream</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-[var(--color-focus)]" aria-hidden="true" />
              <span>Show Stream</span>
            </>
          )}
        </button>
      </div>

      {/* Video Content */}
      {showFeed && (
        <div className="p-5 bg-black flex flex-col items-center justify-center">
          {isLive ? (
            <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden border-3 border-[var(--border-subtle)] bg-black">
              <img
                src={videoUrl}
                alt="Live side-by-side RGB and Depth Map video stream from ML Backend"
                className="w-full h-auto block object-contain max-h-[420px]"
                onError={() => setStreamError(true)}
                onLoad={() => setStreamError(false)}
              />
              <div className="absolute top-3 left-3 bg-black/90 border-2 border-[#00ff66] px-3.5 py-1.5 rounded-lg text-[#00ff66] text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#00ff66] rounded-full animate-pulse" />
                LIVE RGB + DEPTH MAP
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl py-12 px-6 rounded-2xl border-3 border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-card-raised)] border-2 border-[var(--border-subtle)] flex items-center justify-center text-gray-400 mb-3">
                <AlertCircle className="w-9 h-9 text-yellow-400" aria-hidden="true" />
              </div>
              <h4 className="text-xl font-black text-[var(--text-primary)] mb-1">
                {isDemoMode
                  ? 'Demo Simulation Running'
                  : 'Live Video Feed Offline'}
              </h4>
              <p className="text-sm md:text-base text-[var(--text-muted)] max-w-lg font-semibold">
                {isDemoMode
                  ? 'Simulated obstacle telemetry is actively streaming without requiring live camera hardware.'
                  : 'Start the Python ML server with python server.py to stream live video.'}
              </p>
              {!isDemoMode && streamError && (
                <button
                  onClick={() => setStreamError(false)}
                  className="mt-4 px-5 py-2.5 bg-[var(--bg-card-raised)] text-[var(--color-focus)] border-2 border-[var(--color-focus)] rounded-xl text-sm font-black transition-colors cursor-pointer"
                >
                  Retry Connection
                </button>
              )}
            </div>
          )}

          <p className="text-xs text-[var(--text-muted)] mt-3 text-center font-bold">
            Annotated RGB (left) + MiDaS Inverse Depth Map (right). Designed for sighted companions and verification.
          </p>
        </div>
      )}
    </section>
  );
};
