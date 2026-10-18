import React from 'react';
import { Eye, ArrowRight, Radio } from 'lucide-react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen px-6 py-12 bg-[var(--bg-main)] text-[var(--text-primary)] max-w-md mx-auto text-center transition-colors">
      <div className="w-full flex justify-end">
        <button
          onClick={onGetStarted}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold py-1 px-3 rounded-lg border border-[var(--border-subtle)]"
          aria-label="Skip splash screen"
        >
          Skip
        </button>
      </div>

      {/* Hero Visual: BlindEye Logo with Sonic Wave pulses */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] flex items-center justify-center shadow-2xl">
            <Eye className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--color-focus)] stroke-[2.2]" aria-hidden="true" />
          </div>
          {/* Sonic Waves */}
          <Radio className="absolute -top-3 -right-3 w-10 h-10 text-[var(--color-focus)] animate-pulse" aria-hidden="true" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)] mb-2 font-display">
          BlindEye
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium max-w-xs leading-relaxed">
          Guiding You Every Step
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Assistive Spatial Navigation AI</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full">
        <button
          onClick={onGetStarted}
          className="w-full py-4 px-6 rounded-2xl bg-[var(--color-focus)] hover:opacity-90 active:scale-[0.98] text-black font-black text-lg sm:text-xl tracking-wide flex items-center justify-center gap-3 shadow-xl transition-all cursor-pointer border-2 border-white"
          aria-label="Get Started with BlindEye Navigation"
        >
          <span>Get Started</span>
          <ArrowRight className="w-6 h-6 stroke-[3]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
