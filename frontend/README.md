# Blind's Eye — Frontend Application

High-contrast, accessible spatial navigation interface built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4** for blind and visually impaired users.

---

## 🌟 Key Capabilities

1. **WCAG AAA Assistive UI**:
   - High-contrast visual language (deep black `#06090e`, crisp white, safety red `#ff3838`, high-visibility green `#00e676`, warning yellow `#ffd600`).
   - Ultra High Contrast mode (Pure Yellow & Black).
   - Dynamic text size scaling (**Normal 18px**, **Large 22px**, **Extra Large 26px**).
   - Large touch targets (min 48px to 64px) with high-visibility cyan focus indicators.
2. **Directional Spatial Audio**:
   - Utilizes Web Audio API with `StereoPannerNode` to pan acoustic cue tones to the left ear (`-0.9`), right ear (`+0.9`), or center (`0.0`).
   - Distinct frequencies and oscillator wave envelopes to eliminate speaker clicks.
3. **Natural Speech Alerts & Debouncing**:
   - Converts real-time ML detections into human phrases (*"Chair on your left"*, *"Person directly ahead. Stop."*, *"Path clear"*).
   - Debouncing and cooldown management to suppress repetitive audio spam.
   - Immediate interrupts for critical obstacles and objects getting significantly closer.
4. **Haptic Vibration Feedback**:
   - Hardware detection via the Vibration API.
   - Distinct vibration rhythms for left `[90, 60, 90]`, right `[180, 60, 180]`, center `[250, 80, 250]`, and critical `[300, 50, 300, 50, 300]`.
5. **Live RGB + Depth Visual Feed**:
   - Streams side-by-side annotated camera frames and MiDaS inverse depth heatmaps from the ML server.
   - Toggleable view for sighted companions.
6. **Diagnostic Test & Demo Modes**:
   - **Assistance Mode**: Live ML operating mode.
   - **Demo Mode**: Offline simulated walking scenarios.
   - **Test Mode**: Interactive trigger board for manual hardware and directional testing.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | Toggle Start / Stop Assistance |
| <kbd>Escape</kbd> | Close Settings modal / Stop alerts |
| <kbd>S</kbd> | Open Accessibility Settings Modal |
| <kbd>M</kbd> | Switch Operating Mode (Live ML / Demo) |
| <kbd>T</kbd> | Toggle Diagnostic Test Matrix |
| <kbd>V</kbd> | Toggle Voice Announcements ON / OFF |
| <kbd>H</kbd> | Toggle Haptic Vibration ON / OFF |
| <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> | Navigate interactive controls |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Run Automated Vitest Suite
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Accessible UI components
│   │   ├── Header.tsx           # Status badge, branding, settings trigger
│   │   ├── StatusBanner.tsx     # Large clear/alert/critical banner
│   │   ├── DirectionIndicator.tsx # 3-column spatial radar
│   │   ├── Controls.tsx         # Large touch buttons & mode switchers
│   │   ├── ObstaclesList.tsx    # Prioritized obstacles table
│   │   ├── VideoFeed.tsx        # Live stream viewer with fallbacks
│   │   ├── TestModePanel.tsx    # Interactive diagnostic test board
│   │   ├── SettingsModal.tsx    # A11y scaling, theme, and audio controls
│   │   ├── SafetyDisclaimer.tsx # Assistive prototype safety notice
│   │   └── LogsPanel.tsx        # Spoken announcement history log
│   ├── hooks/               # Custom state & lifecycle hooks
│   │   ├── useNavigationEngine.ts # Polling loop & alert dispatch
│   │   ├── useSettings.ts       # LocalStorage settings persistence
│   │   └── useKeyboardShortcuts.ts # Global keyboard navigation
│   ├── services/            # Pure business logic services
│   │   ├── api.ts               # Backend API client with retry logic
│   │   ├── alertPrioritizer.ts  # Sorting, debouncing & phrasing
│   │   ├── speechService.ts     # Web Speech synthesis wrapper
│   │   ├── audioService.ts      # Web Audio stereo spatial panning
│   │   ├── hapticService.ts     # Vibration API pattern dispatcher
│   │   └── demoService.ts       # Offline scenario telemetry generator
│   ├── types/               # TypeScript domain models
│   │   └── navigation.ts
│   ├── utils/               # Constants, frequencies & thresholds
│   │   └── constants.ts
│   ├── App.tsx              # Application layout & ARIA live-region
│   ├── main.tsx             # React root entry
│   └── index.css            # High contrast styles & Atkinson font
├── public/                  # Favicon & static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```
