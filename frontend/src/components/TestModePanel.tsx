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
      aria-label="Developer and Accessibility Diagnostic Test Board"
      className="w-full bg-[#110d1a] border-3 border-purple-500 rounded-2xl p-5 md:p-6 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-purple-900 pb-3 mb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-purple-400">
            DIAGNOSTIC & EVALUATION MODE
          </span>
          <h3 className="text-xl md:text-2xl font-black text-white">
            Interactive Test Matrix
          </h3>
        </div>
        <span className="bg-purple-950 text-purple-300 border border-purple-500 px-3 py-1 rounded-md text-xs font-bold uppercase">
          Simulated Triggers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Navigation State Simulation */}
        <div>
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-3">
            Simulate Spatial Obstacle Events
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => onTriggerTest('left', 'chair', 640)}
              className="p-3.5 bg-[#1f1730] hover:bg-[#2e2247] border-2 border-purple-500/80 rounded-xl text-left font-bold text-sm text-white flex items-center gap-3 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-amber-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="block">Left: Chair</span>
                <span className="text-xs text-gray-400 font-normal">Proximity: 640 (Near)</span>
              </div>
            </button>

            <button
              onClick={() => onTriggerTest('right', 'bicycle', 650)}
              className="p-3.5 bg-[#1f1730] hover:bg-[#2e2247] border-2 border-purple-500/80 rounded-xl text-left font-bold text-sm text-white flex items-center gap-3 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-5 h-5 text-amber-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="block">Right: Bicycle</span>
                <span className="text-xs text-gray-400 font-normal">Proximity: 650 (Near)</span>
              </div>
            </button>

            <button
              onClick={() => onTriggerTest('center', 'person', 690)}
              className="p-3.5 bg-[#1f1730] hover:bg-[#2e2247] border-2 border-purple-500/80 rounded-xl text-left font-bold text-sm text-white flex items-center gap-3 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-5 h-5 text-amber-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="block">Center: Person</span>
                <span className="text-xs text-gray-400 font-normal">Proximity: 690 (Near)</span>
              </div>
            </button>

            <button
              onClick={() => onTriggerTest('center', 'car', 820, true)}
              className="p-3.5 bg-red-950/80 hover:bg-red-900 border-2 border-red-500 rounded-xl text-left font-bold text-sm text-red-100 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <OctagonAlert className="w-5 h-5 text-red-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="block">Critical: Car Ahead</span>
                <span className="text-xs text-red-300 font-normal">Proximity: 820 (Danger)</span>
              </div>
            </button>

            <button
              onClick={() => onTriggerTest('none', 'none', 0)}
              className="p-3.5 sm:col-span-2 bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-500 rounded-xl text-left font-bold text-sm text-emerald-100 flex items-center gap-3 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <span className="block">Path Clear</span>
                <span className="text-xs text-emerald-300 font-normal">All obstacles resolved</span>
              </div>
            </button>
          </div>
        </div>

        {/* Hardware & Feedback Direct Tests */}
        <div>
          <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-3">
            Direct Hardware & API Diagnostics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={testSpatialLeft}
              className="p-3.5 bg-[#182230] hover:bg-[#25364c] border border-cyan-500/60 rounded-xl text-left font-bold text-sm text-cyan-200 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Headphones className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              <span>Test Audio (Left Pan)</span>
            </button>

            <button
              onClick={testSpatialRight}
              className="p-3.5 bg-[#182230] hover:bg-[#25364c] border border-cyan-500/60 rounded-xl text-left font-bold text-sm text-cyan-200 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Headphones className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              <span>Test Audio (Right Pan)</span>
            </button>

            <button
              onClick={testSpeech}
              className="p-3.5 bg-[#182230] hover:bg-[#25364c] border border-emerald-500/60 rounded-xl text-left font-bold text-sm text-emerald-200 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              <span>Test Web Speech</span>
            </button>

            <button
              onClick={testHaptics}
              className="p-3.5 bg-[#182230] hover:bg-[#25364c] border border-amber-500/60 rounded-xl text-left font-bold text-sm text-amber-200 flex items-center gap-2.5 transition-colors cursor-pointer"
            >
              <Smartphone className="w-5 h-5 text-amber-400" aria-hidden="true" />
              <span>Test Vibration API</span>
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-4 leading-relaxed">
            Note: Headphones or stereo speakers are required to perceive directional left/right audio panning. Vibration API is active on mobile browsers (Android/Chrome).
          </p>
        </div>
      </div>
    </section>
  );
};
