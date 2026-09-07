import React from 'react';
import { ArrowLeft, ArrowUp, ArrowRight, OctagonAlert, ShieldCheck, Headphones, Volume2, Smartphone } from 'lucide-react';
import { Direction } from '../types/navigation';
import { audioService } from '../services/audioService';
import { speechService } from '../services/speechService';
import { hapticService } from '../services/hapticService';

interface TestModePanelProps {
  onTriggerTest: (
    direction: Direction,
    obstacleLabel: string,
    proximity: number,
    isCritical?: boolean
  ) => void;
}

export const TestModePanel: React.FC<TestModePanelProps> = ({ onTriggerTest }) => {
  const testSpatialLeft = () => {
    audioService.unlockAudioContext();
    audioService.playLeftCue();
  };

  const testSpatialRight = () => {
    audioService.unlockAudioContext();
    audioService.playRightCue();
  };

  const testSpeech = () => {
    speechService.speak('Test announcement. Obstacle on your left.');
  };

  const testHaptics = () => {
    hapticService.alertLeft();
  };

  return (
    <section
      aria-label="Diagnostic & Evaluation Test Matrix"
      className="w-full bg-[var(--bg-card)] border-4 border-purple-500 rounded-3xl p-5 md:p-7 shadow-2xl transition-colors"
    >
      <div className="flex items-center justify-between border-b-2 border-purple-900 pb-3 mb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-purple-400">
            DIAGNOSTIC & EVALUATION MODE
          </span>
          <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)]">
            Interactive Test Matrix
          </h3>
        </div>
        <span className="bg-purple-950 text-purple-300 border-2 border-purple-500 px-3 py-1 rounded-xl text-xs font-black uppercase">
          Simulated Events
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Navigation State Simulation */}
        <div>
          <h4 className="text-xs font-black uppercase text-[var(--text-muted)] tracking-wider mb-3">
            Simulate Spatial Obstacle Events
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onTriggerTest('left', 'chair', 640)}
              className="p-4 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] border-2 border-yellow-400 rounded-2xl text-left font-black text-sm text-[var(--text-primary)] flex items-center gap-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 text-yellow-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="block text-base">Left: Chair</span>
                <span className="text-xs text-[var(--text-muted)] font-bold">Proximity: 640 (Near)</span>
              </div>
            </button>

            <button
              onClick={() => onTriggerTest('right', 'bicycle', 650)}
              className="p-4 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] border-2 border-yellow-400 rounded-2xl text-left font-black text-sm text-[var(--text-primary)] flex items-center gap-3 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-6 h-6 text-yellow-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="block text-base">Right: Bicycle</span>
                <span className="text-xs text-[var(--text-muted)] font-bold">Proximity: 650 (Near)</span>
              </div>
            </button>

            <button
              onClick={() => onTriggerTest('center', 'person', 690)}
              className="p-4 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] border-2 border-yellow-400 rounded-2xl text-left font-black text-sm text-[var(--text-primary)] flex items-center gap-3 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-6 h-6 text-yellow-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="block text-base">Center: Person</span>
                <span className="text-xs text-[var(--text-muted)] font-bold">Proximity: 690 (Near)</span>
              </div>
            </button>

            <button
              onClick={() => onTriggerTest('center', 'car', 820, true)}
              className="p-4 bg-red-950 hover:bg-red-900 border-3 border-red-500 rounded-2xl text-left font-black text-sm text-red-100 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <OctagonAlert className="w-6 h-6 text-red-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="block text-base">Critical: Car Ahead</span>
                <span className="text-xs text-red-200 font-bold">Proximity: 820 (Danger)</span>
              </div>
            </button>

            <button
              onClick={() => onTriggerTest('none', 'none', 0)}
              className="p-4 sm:col-span-2 bg-[#002b11] hover:bg-[#00441b] border-3 border-[#00e676] rounded-2xl text-left font-black text-sm text-[#00ff66] flex items-center gap-3 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-6 h-6 text-[#00ff66] flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="block text-base">Path Clear</span>
                <span className="text-xs text-emerald-100 font-bold">All obstacles resolved</span>
              </div>
            </button>
          </div>
        </div>

        {/* Hardware & Feedback Direct Tests */}
        <div>
          <h4 className="text-xs font-black uppercase text-[var(--text-muted)] tracking-wider mb-3">
            Hardware & Channel Diagnostics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={testSpatialLeft}
              className="p-4 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] border-2 border-cyan-400 rounded-2xl text-left font-black text-sm text-cyan-300 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Headphones className="w-6 h-6 text-cyan-400" aria-hidden="true" />
              <span>Left Pan Audio</span>
            </button>

            <button
              onClick={testSpatialRight}
              className="p-4 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] border-2 border-cyan-400 rounded-2xl text-left font-black text-sm text-cyan-300 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Headphones className="w-6 h-6 text-cyan-400" aria-hidden="true" />
              <span>Right Pan Audio</span>
            </button>

            <button
              onClick={testSpeech}
              className="p-4 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] border-2 border-[#00e676] rounded-2xl text-left font-black text-sm text-[#00ff66] flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Volume2 className="w-6 h-6 text-[#00e676]" aria-hidden="true" />
              <span>Test Web Speech</span>
            </button>

            <button
              onClick={testHaptics}
              className="p-4 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] border-2 border-yellow-400 rounded-2xl text-left font-black text-sm text-yellow-300 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <Smartphone className="w-6 h-6 text-yellow-400" aria-hidden="true" />
              <span>Test Vibration API</span>
            </button>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-4 leading-relaxed font-semibold">
            Headphones or stereo speakers are required to perceive directional stereo panning. Vibration API runs on mobile browsers (Android Chrome).
          </p>
        </div>
      </div>
    </section>
  );
};
