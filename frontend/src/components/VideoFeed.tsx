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
      aria-label="Live Camera and Depth Vision Feed"
      className="w-full bg-[#0e141d] border-2 border-[#243242] rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-3.5 bg-[#141c26] border-b-2 border-[#243242] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Camera className="w-5 h-5 text-cyan-400" aria-hidden="true" />
          <h3 className="font-extrabold text-base md:text-lg text-white">
            LIVE ENVIRONMENT (RGB + DEPTH VISION)
          </h3>
        </div>

        <button
          onClick={() => onToggleShowFeed(!showFeed)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e2a38] hover:bg-[#2c3d52] border border-[#3b506b] rounded-lg text-xs md:text-sm font-bold text-gray-200 transition-colors cursor-pointer"
          aria-expanded={showFeed}
          aria-label={showFeed ? 'Hide Camera Feed' : 'Show Camera Feed'}
        >
          {showFeed ? (
            <>
              <EyeOff className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span>Hide Stream</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <span>Show Stream</span>
            </>
          )}
        </button>
      </div>

      {/* Video Content */}
      {showFeed && (
        <div className="p-4 bg-black flex flex-col items-center justify-center">
          {isLive ? (
            <div className="relative w-full max-w-4xl rounded-xl overflow-hidden border-2 border-[#243242] bg-[#05080c]">
              <img
                src={videoUrl}
                alt="Live side-by-side RGB and Depth Map video stream from ML Backend"
                className="w-full h-auto block object-contain max-h-[420px]"
                onError={() => setStreamError(true)}
                onLoad={() => setStreamError(false)}
              />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-emerald-500/80 px-3 py-1 rounded-md text-emerald-400 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                LIVE ML STREAM (RGB + DEPTH)
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl py-12 px-6 rounded-xl border-2 border-dashed border-[#34465b] bg-[#0a0f16] flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#182330] border border-[#3b506b] flex items-center justify-center text-gray-400 mb-3">
                <AlertCircle className="w-8 h-8 text-amber-400" aria-hidden="true" />
              </div>
              <h4 className="text-xl font-bold text-white mb-1">
                {isDemoMode
                  ? 'Demo Simulation Mode Active'
                  : 'Live Video Feed Unavailable'}
              </h4>
              <p className="text-sm md:text-base text-gray-400 max-w-lg">
                {isDemoMode
                  ? 'Simulated navigation data is running without requiring camera hardware.'
                  : 'Ensure the Python ML backend is active with python server.py and camera permissions are granted.'}
              </p>
              {!isDemoMode && streamError && (
                <button
                  onClick={() => setStreamError(false)}
                  className="mt-4 px-4 py-2 bg-[#1e2a38] hover:bg-[#2e3f54] text-cyan-300 border border-cyan-500 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                >
                  Retry Stream Connection
                </button>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-3 text-center">
            Annotated RGB (left) + MiDaS Depth Heatmap (right). Designed for sighted companions and verification.
          </p>
        </div>
      )}
    </section>
  );
};
