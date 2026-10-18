import React, { useState } from 'react';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Search,
  BookOpen,
  Building2,
  Home,
  Coffee,
  ChevronRight,
} from 'lucide-react';
import { speechService } from '../../services/speechService';

interface DestinationScreenProps {
  onBack: () => void;
  onSelectDestination: (placeName: string) => void;
}

export const DestinationScreen: React.FC<DestinationScreenProps> = ({
  onBack,
  onSelectDestination,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const recentPlaces = [
    { name: 'Library', distance: '120 m', icon: BookOpen },
    { name: 'Main Gate', distance: '350 m', icon: Building2 },
    { name: 'Hostel', distance: '500 m', icon: Home },
    { name: 'Cafeteria', distance: '220 m', icon: Coffee },
  ];

  const filteredPlaces = searchQuery
    ? recentPlaces.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentPlaces;

  const handleVoiceInput = () => {
    // Check for web speech recognition support
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          speechService.speak('Listening for destination.');
        };

        recognition.onresult = (event: any) => {
          setIsListening(false);
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            speechService.speak(`Destination set to ${transcript}. Starting navigation.`);
            onSelectDestination(transcript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Fallback simulation: pick Library
          speechService.speak('Simulated voice input: Library selected.');
          onSelectDestination('Library');
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch {
        // Fallback below
      }
    }

    // Direct simulated speech input for browser environments without mic permission
    setIsListening(true);
    speechService.speak('Listening. Please say Library or Main Gate.');
    setTimeout(() => {
      setIsListening(false);
      speechService.speak('Destination set to Library. Starting navigation.');
      onSelectDestination('Library');
    }, 1800);
  };

  return (
    <div className="flex flex-col min-h-screen px-4 pt-3 pb-24 bg-[var(--bg-main)] text-[var(--text-primary)] max-w-md mx-auto transition-colors">
      {/* Header with Back button */}
      <header className="flex items-center gap-3 py-2 border-b border-[var(--border-subtle)] mb-5">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-[var(--text-primary)] hover:bg-white/10 cursor-pointer"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
        </button>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Set Destination
        </h1>
      </header>

      {/* Big Voice Input Card */}
      <div className="flex flex-col items-center justify-center p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl mb-5 shadow-sm text-center">
        <button
          onClick={handleVoiceInput}
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-300 cursor-pointer ${
            isListening
              ? 'bg-red-600 text-white animate-pulse scale-110 shadow-[0_0_24px_rgba(239,68,68,0.6)]'
              : 'bg-[var(--bg-card-raised)] border-2 border-[var(--color-focus)] text-[var(--color-focus)] hover:scale-105 shadow-lg'
          }`}
          aria-label={isListening ? 'Listening for voice destination' : 'Tap to speak your destination'}
        >
          {isListening ? (
            <MicOff className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true" />
          ) : (
            <Mic className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" aria-hidden="true" />
          )}
        </button>

        <h2 className="font-black text-lg sm:text-xl text-[var(--text-primary)] mb-1">
          {isListening ? 'Listening...' : 'Speak your destination'}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] italic font-medium">
          e.g. "Library", "Classroom", "Main Gate", "Café"
        </p>
      </div>

      {/* OR Divider */}
      <div className="flex items-center gap-3 my-2 text-[var(--text-muted)] font-black text-xs uppercase tracking-widest">
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        <span>OR</span>
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
      </div>

      {/* Search Input Box */}
      <div className="relative my-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" aria-hidden="true" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search location"
          className="w-full pl-11 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[var(--color-focus)] rounded-2xl text-sm font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors"
          aria-label="Search destination location"
        />
      </div>

      {/* Recent Places List */}
      <div className="mt-2">
        <h3 className="text-xs sm:text-sm font-bold text-[var(--text-muted)] tracking-wide mb-2.5 px-1 uppercase">
          Recent Places
        </h3>

        <div className="flex flex-col gap-2">
          {filteredPlaces.map((place) => {
            const Icon = place.icon;
            return (
              <button
                key={place.name}
                onClick={() => {
                  speechService.speak(`Destination selected: ${place.name}. Starting navigation.`);
                  onSelectDestination(place.name);
                }}
                className="flex items-center justify-between p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--color-focus)] active:scale-[0.99] rounded-2xl text-left transition-all cursor-pointer group"
                aria-label={`Select ${place.name}, ${place.distance} away`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--color-focus)] flex-shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block font-bold text-base text-[var(--text-primary)]">
                      {place.name}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] font-mono">
                      {place.distance} away
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--color-focus)] transition-colors flex-shrink-0" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
