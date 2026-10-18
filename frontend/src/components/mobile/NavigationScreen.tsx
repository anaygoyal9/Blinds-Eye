import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  CornerUpRight,
  MapPin,
  Watch,
  Volume2,
  Square,
  Sparkles,
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { hapticService } from '../../services/hapticService';

interface NavigationScreenProps {
  destination: string;
  onBack: () => void;
  onStopNavigation: () => void;
  onSwitchToObstacles: () => void;
}

export const NavigationScreen: React.FC<NavigationScreenProps> = ({
  destination = 'Library',
  onBack,
  onStopNavigation,
  onSwitchToObstacles,
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      action: 'Go Straight',
      distance: '5 metres',
      icon: ArrowUp,
      nextTurn: 'Turn Right in 20 metres',
      vibrationDesc: 'Center Track (continuous steady pulse)',
      vibrateFn: () => hapticService.alertCenter(),
      remaining: '120 metres remaining',
      spoken: 'Go straight for 5 metres. Next turn right in 20 metres.',
    },
    {
      action: 'Turn Right',
      distance: 'in 2 metres',
      icon: CornerUpRight,
      nextTurn: 'Continue straight for 40 metres',
      vibrationDesc: 'Right Side (short rhythmic pulses)',
      vibrateFn: () => hapticService.alertRight(),
      remaining: '95 metres remaining',
      spoken: 'Turn right in 2 metres.',
    },
    {
      action: 'Go Straight',
      distance: '40 metres',
      icon: ArrowUp,
      nextTurn: 'Approaching entrance',
      vibrationDesc: 'Center Track (gentle guide)',
      vibrateFn: () => hapticService.alertCenter(),
      remaining: '55 metres remaining',
      spoken: 'Continue straight for 40 metres toward entrance.',
    },
  ];

  const currentStep = steps[stepIndex % steps.length];
  const StepIcon = currentStep.icon;

  const handleRepeatInstruction = () => {
    speechService.speak(currentStep.spoken);
    currentStep.vibrateFn();
  };

  const handleNextStep = () => {
    const nextIdx = (stepIndex + 1) % steps.length;
    setStepIndex(nextIdx);
    speechService.speak(steps[nextIdx].spoken);
    steps[nextIdx].vibrateFn();
  };

  return (
    <div className="flex flex-col min-h-screen px-4 pt-3 pb-24 bg-[var(--bg-main)] text-[var(--text-primary)] max-w-md mx-auto transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl text-[var(--text-primary)] hover:bg-white/10 cursor-pointer"
            aria-label="Back to Destinations"
          >
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Navigation
          </h1>
        </div>

        <button
          onClick={onSwitchToObstacles}
          className="text-xs font-bold text-[var(--color-focus)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Live Radar</span>
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </header>

      {/* Primary Turn-by-Turn Instruction Card */}
      <div
        onClick={handleNextStep}
        className="flex flex-col items-center justify-center p-6 bg-[var(--bg-card)] border-2 border-[var(--color-focus)] rounded-3xl mb-3.5 shadow-xl text-center cursor-pointer transition-all hover:scale-[1.01]"
        role="button"
        tabIndex={0}
        aria-label={`Current instruction: ${currentStep.action}, ${currentStep.distance}. Tap for next step.`}
      >
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-2 font-display">
          {currentStep.action}
        </h2>

        <div className="w-20 h-20 sm:w-24 sm:h-24 my-2 rounded-full bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--color-focus)]">
          <StepIcon className="w-12 h-12 sm:w-14 sm:h-14 stroke-[3]" aria-hidden="true" />
        </div>

        <span className="text-xl sm:text-2xl font-black text-[var(--color-focus)] mt-1 font-mono">
          {currentStep.distance}
        </span>
        <span className="text-[10px] text-[var(--text-muted)] mt-1 uppercase font-semibold">
          Tap card to advance step
        </span>
      </div>

      {/* Next Turn Card */}
      <div className="flex items-center gap-3.5 p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl mb-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-raised)] flex items-center justify-center text-yellow-400 flex-shrink-0">
          <CornerUpRight className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <span className="block text-xs text-[var(--text-muted)] font-bold uppercase">
            Next Turn
          </span>
          <span className="block font-bold text-sm sm:text-base text-[var(--text-primary)]">
            {currentStep.nextTurn}
          </span>
        </div>
      </div>

      {/* Wearable / Vibration Guidance Pattern Card (Screen 6) */}
      <button
        onClick={() => currentStep.vibrateFn()}
        className="flex items-center gap-3.5 p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-yellow-400 active:scale-[0.99] rounded-2xl mb-3 text-left transition-all cursor-pointer"
        aria-label={`Test vibration pattern: ${currentStep.vibrationDesc}`}
      >
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-raised)] flex items-center justify-center text-[var(--color-focus)] flex-shrink-0">
          <Watch className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <span className="block text-xs text-[var(--text-muted)] font-bold uppercase">
            Vibration Pattern
          </span>
          <span className="block font-bold text-xs sm:text-sm text-[var(--text-primary)]">
            {currentStep.vibrationDesc}
          </span>
        </div>
      </button>

      {/* Destination Remaining Card */}
      <div className="flex items-center gap-3.5 p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl mb-5">
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-raised)] flex items-center justify-center text-emerald-400 flex-shrink-0">
          <MapPin className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <span className="block text-xs text-[var(--text-muted)] font-bold uppercase">
            Destination
          </span>
          <span className="block font-bold text-sm text-[var(--text-primary)]">
            {destination} · {currentStep.remaining}
          </span>
        </div>
      </div>

      {/* Control Buttons (Repeat Instruction & Stop Navigation) */}
      <div className="flex flex-col gap-2.5 mt-auto">
        <button
          onClick={handleRepeatInstruction}
          className="w-full py-3 px-4 rounded-xl bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-colors"
          aria-label="Repeat verbal instruction"
        >
          <Volume2 className="w-5 h-5 text-[var(--color-focus)]" aria-hidden="true" />
          <span>Repeat Instruction</span>
        </button>

        <button
          onClick={onStopNavigation}
          className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 border border-white shadow-lg cursor-pointer transition-colors"
          aria-label="Stop navigation"
        >
          <Square className="w-5 h-5 fill-current" aria-hidden="true" />
          <span>Stop Navigation</span>
        </button>
      </div>
    </div>
  );
};
