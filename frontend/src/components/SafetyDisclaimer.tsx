import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const SafetyDisclaimer: React.FC = () => {
  return (
    <aside
      aria-label="Important Safety Notice"
      className="w-full bg-[#10141d] border-2 border-[#2b394a] rounded-2xl p-4 md:p-5 text-gray-300"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs md:text-sm leading-relaxed">
          <strong className="text-white font-bold block mb-1">
            Assistive Technology Prototype — Safety Notice
          </strong>
          Blind's Eye is an assistive spatial navigation prototype designed to augment spatial awareness via AI computer vision. It is <strong>NOT a certified replacement</strong> for primary mobility tools (white cane, guide dog, or orientation and mobility training). Proximity values indicate relative depth estimation and must not be relied upon as calibrated physical distances.
        </div>
      </div>
    </aside>
  );
};
