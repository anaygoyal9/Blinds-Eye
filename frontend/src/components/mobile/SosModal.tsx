import React from 'react';
import { PhoneCall, AlertOctagon, X, Phone } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { hapticService } from '../../services/hapticService';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleCallEmergency = (number: string) => {
    speechService.speak(`Calling emergency number ${number}.`);
    hapticService.alertCritical();
    window.location.href = `tel:${number}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <div className="w-full max-w-sm bg-red-950 border-4 border-red-500 rounded-3xl p-6 text-white shadow-2xl text-center animate-pulse">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-red-200 hover:bg-[var(--bg-card-raised)]"
            aria-label="Close Emergency Dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="w-20 h-20 mx-auto rounded-full bg-red-600 border-4 border-white flex items-center justify-center mb-4 shadow-xl">
          <AlertOctagon className="w-10 h-10 text-white stroke-[3]" aria-hidden="true" />
        </div>

        <h2 id="sos-title" className="text-2xl font-black mb-1">
          EMERGENCY SOS
        </h2>
        <p className="text-xs text-red-200 font-semibold mb-6">
          Immediate assistance for visual navigation distress
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleCallEmergency('112')}
            className="w-full py-3.5 px-4 rounded-2xl bg-white text-red-900 font-black text-lg flex items-center justify-center gap-2 shadow-lg hover:bg-red-50 cursor-pointer"
          >
            <PhoneCall className="w-6 h-6 stroke-[3]" />
            <span>Call Services (112 / 911)</span>
          </button>

          <button
            onClick={() => handleCallEmergency('+15550199')}
            className="w-full py-3 px-4 rounded-xl bg-red-900 border-2 border-red-400 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-800 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Call Mom (+1 555-0199)</span>
          </button>

          <button
            onClick={() => handleCallEmergency('+15550248')}
            className="w-full py-3 px-4 rounded-xl bg-red-900 border-2 border-red-400 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-800 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Call Caregiver Dr. Vance</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 mt-2 rounded-xl text-xs font-bold text-red-300 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
