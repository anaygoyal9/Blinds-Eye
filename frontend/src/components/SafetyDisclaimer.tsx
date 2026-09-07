import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const SafetyDisclaimer: React.FC = () => {
  return (
    <aside
      aria-label="Important Safety Notice"
      className="w-full bg-[var(--bg-card)] border-3 border-[var(--border-subtle)] rounded-3xl p-5 md:p-6 text-[var(--text-secondary)] transition-colors"
    >
      <div className="flex items-start gap-4">
        <ShieldAlert className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs md:text-sm leading-relaxed font-semibold">
          <strong className="text-[var(--text-primary)] font-black block text-sm md:text-base mb-1">
            Assistive Technology Prototype — Safety Notice
          </strong>
          Blind's Eye is an assistive spatial navigation prototype designed to augment spatial awareness via AI computer vision. It is <strong className="text-yellow-400 font-black">NOT a certified replacement</strong> for primary mobility tools (white cane, guide dog, or orientation and mobility training). Proximity values indicate relative depth estimation and must not be relied upon as calibrated physical metric distances.
        </div>
      </div>
    </aside>
  );
};
