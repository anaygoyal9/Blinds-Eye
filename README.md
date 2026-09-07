# Blind's Eye — Assistive Spatial Navigation System

> **An AI-powered spatial navigation companion for blind and visually impaired users combining real-time YOLOv8 object detection, MiDaS monocular depth estimation, directional spatial audio, natural speech synthesis, and accessible high-contrast UI.**

---

## 📑 Table of Contents
1. [Overview & Mission](#-overview--mission)
2. [Target Architecture](#-target-architecture)
3. [System Components](#-system-components)
4. [Quick Start & Setup Guide](#-quick-start--setup-guide)
   - [Prerequisites](#prerequisites)
   - [Running the ML Backend](#running-the-ml-backend)
   - [Running the Frontend Application](#running-the-frontend-application)
5. [Backend API Reference](#-backend-api-reference)
6. [Alert Prioritization & Debouncing Engine](#-alert-prioritization--debouncing-engine)
7. [Feedback Modalities](#-feedback-modalities)
   - [Natural Speech Synthesis](#natural-speech-synthesis)
   - [Directional / Spatial Audio Cues](#directional--spatial-audio-cues)
   - [Haptic Vibration Patterns](#haptic-vibration-patterns)
8. [Accessibility (a11y) Architecture](#-accessibility-a11y-architecture)
9. [Diagnostic Test & Demo Modes](#-diagnostic-test--demo-modes)
10. [Important Safety Notice](#-important-safety-notice)
11. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 👁️ Overview & Mission

Navigating unfamiliar or dynamic indoor and outdoor environments presents major safety hazards for visually impaired individuals. Traditional navigation aids (such as white canes and guide dogs) are indispensable for ground-level tactile awareness, but have limited range for identifying elevated obstacles, recognizing approaching hazards, or discerning specific object types at distance.

**Blind's Eye** acts as an assistive companion that augments spatial awareness by:
- Processing real-time camera frames through **YOLOv8** (for semantic object identification) and **MiDaS** (for relative depth estimation).
- Calculating the exact direction (**Left**, **Center**, **Right**) and relative proximity of obstacles.
- Delivering high-priority directional audio and spoken warnings while intelligently suppressing redundant announcements.
- Presenting a WCAG AAA compliant, low-cognitive-load interface designed specifically for low-vision users and sighted companions.

---

## 🏗️ Target Architecture

```
                       +-------------------------+
                       |    Camera Video Feed    |
                       | (Built-in / IP Webcam)  |
                       +------------+------------+
                                    |
                                    v
                       +-------------------------+
                       |    ML Engine (PyTorch)  |
                       |  +--------------------+ |
                       |  | YOLOv8 (Objects)   | |
                       |  | MiDaS (Depth Map)  | |
                       |  +--------------------+ |
                       +------------+------------+
                                    |
                                    v
                       +-------------------------+
                       |   FastAPI Server :8000  |
                       |  - GET /api/detect      |
                       |  - GET /video_feed      |
                       |  - GET /health          |
                       +------------+------------+
                                    |
                                    v
                   +---------------------------------+
                   |  Frontend (React 19 + Vite + TS) |
                   +----------------+----------------+
                                    |
       +----------------------------+----------------------------+
       |                            |                            |
       v                            v                            v
+--------------+           +------------------+           +--------------+
| Visual Radar |           | Spoken & Spatial |           | Rhythmic     |
| & High-      |           | Audio Feedback   |           | Haptic       |
| Contrast UI  |           | (Web Audio/API)  |           | Vibration    |
+--------------+           +------------------+           +--------------+
```

---

## 📦 System Components

### 1. ML Backend (`ml_engine.py` & `server.py`)
- **YOLOv8 Nano (`yolov8n.pt`)**: Detects COCO object classes (people, vehicles, chairs, tables, doors, bags, stairs).
- **MiDaS Small (`torch.hub`)**: Generates real-time inverse depth maps where higher median pixel values represent closer physical objects.
- **Directional Slicing**: Slices bounding boxes against the depth map to extract object-specific proximity and determines direction:
  - $x_{\text{center}} < \frac{w}{3} \rightarrow \text{Left}$
  - $x_{\text{center}} > \frac{2w}{3} \rightarrow \text{Right}$
  - Otherwise $\rightarrow \text{Center}$
- **FastAPI Endpoints**: High-performance asynchronous API serving detection telemetry and side-by-side MJPEG video feeds.

### 2. Frontend Application (`frontend/`)
- **React 19 + TypeScript**: Modular, type-safe architecture with automated Vitest test coverage.
- **Alert Prioritization Engine**: Prevents audio spam with cooldowns, danger rankings, and proximity delta detection.
- **Web Audio Spatial Engine**: Uses `StereoPannerNode` for genuine directional acoustic cues.
- **Web Speech API Service**: Natural phrasing with cancellation to eliminate speech lag.
- **Vibration API Wrapper**: Hardware-adaptive haptic vibration rhythms.

---

## ⚡ Quick Start & Setup Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** (v20+ recommended)
- Standard webcam or smartphone with IP Webcam app

---

### Running the ML Backend

1. **Install Python Dependencies**:
   ```bash
   pip install -r req.txt
   ```
2. **Start ML Server**:
   ```bash
   python server.py
   ```
   *By default, `server.py` opens your laptop webcam (`0`). To connect a smartphone camera via IP Webcam, set the environment variable:*
   ```bash
   # Windows PowerShell
   $env:CAMERA_SOURCE="http://192.168.1.76:8080/video"; python server.py

   # Linux / macOS
   CAMERA_SOURCE="http://192.168.1.76:8080/video" python server.py
   ```
   *The server will be available at `http://127.0.0.1:8000`.*

---

### Running the Frontend Application

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```
2. **Install Node dependencies**:
   ```bash
   npm install
   ```
3. **Launch the development server**:
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:3000`** in your browser.
5. Press <kbd>Space</kbd> or click **[ START ASSISTANCE ]** to begin spatial navigation!

---

## 🔌 Backend API Reference

### `GET /api/detect`
Returns real-time obstacle telemetry for the current video frame.

**Response Schema (`200 OK`)**:
```json
{
  "status": "ALERT",
  "alert_side": "left",
  "obstacles": [
    {
      "label": "chair",
      "confidence": 0.88,
      "proximity": 640,
      "direction": "left",
      "bbox": [50, 100, 200, 350]
    }
  ]
}
```

- `status`: `"ALERT"` (obstacle within alert threshold) or `"CLEAR"` (path unobstructed).
- `alert_side`: Primary direction of warning (`"left"`, `"center"`, `"right"`, or `"none"`).
- `proximity`: Relative MiDaS depth value (higher indicates closer proximity).
- `direction`: Object position (`"left"`, `"center"`, `"right"`).
- `bbox`: Object bounding box coordinates `[x1, y1, x2, y2]`.

### `GET /video_feed`
Returns an `image/jpeg` MJPEG stream with side-by-side annotated RGB bounding boxes and MiDaS depth colormap.

### `GET /health`
Returns backend health status, camera connection state, and active camera source.

---

## 🧠 Alert Prioritization & Debouncing Engine

To prevent user overwhelm and cognitive fatigue, the application implements a dedicated prioritization and debouncing pipeline:

```
Incoming Telemetry
       │
       ▼
1. Class & Proximity Enrichment (Assigns weights: Critical > High > Medium > Low)
       │
       ▼
2. Multi-Obstacle Danger Sorting (Most dangerous object promoted to Primary Alert)
       │
       ▼
3. Transition & Cooldown Evaluation:
   ├── State changed (Clear ➔ Alert or Alert ➔ Clear)? ─────────► [ANNOUNCE]
   ├── New obstacle class or direction change? ──────────────────► [ANNOUNCE]
   ├── Proximity jumped significantly closer (+75)? ─────────────► [ANNOUNCE]
   ├── Cooldown interval (default 2.5s) expired? ────────────────► [ANNOUNCE]
   └── Same obstacle within cooldown window? ────────────────────► [SUPPRESS]
```

### Obstacle Priority Hierarchy:
- **CRITICAL**: Moving vehicles (`car`, `bus`, `truck`, `motorcycle`), immediate traffic hazards, or *any obstacle with immediate proximity ($\ge 750$)*.
- **HIGH**: Moving people, tripping hazards, stationary furniture (`person`, `chair`, `couch`, `stairs`, `door`).
- **MEDIUM**: Transport and larger items (`bicycle`, `dining table`, `backpack`, `suitcase`).
- **LOW**: Small everyday objects (`bottle`, `cup`, `book`, `phone`, `keyboard`).

---

## 🔊 Feedback Modalities

### Natural Speech Synthesis
Generates natural conversational phrases using the Web Speech API:
- *"Person directly ahead. Stop."*
- *"Chair on your left."*
- *"Chair getting closer on your left."*
- *"Path clear."*
*(Previous utterances are immediately cancelled before new ones speak to prevent queue delays).*

### Directional / Spatial Audio Cues
Directional cues are rendered using the Web Audio API with `StereoPannerNode`:
- **Left Obstacle**: Panned to $-0.9$ (left ear), $440\text{ Hz}$ sine wave tone.
- **Right Obstacle**: Panned to $+0.9$ (right ear), $660\text{ Hz}$ sine wave tone.
- **Center Obstacle**: Balanced $0.0$, $520\text{ Hz}$ triangle wave warning.
- **Critical Stop**: Balanced $0.0$, dual-pulse rapid $880\text{ Hz}$ sawtooth alarm.
- **Clear Path**: Balanced $0.0$, $587\text{ Hz}$ chime.

### Haptic Vibration Patterns
Rhythmic feedback patterns via the Navigator Vibration API:
- **Left**: `[90ms on, 60ms off, 90ms on]`
- **Right**: `[180ms on, 60ms off, 180ms on]`
- **Center**: `[250ms on, 80ms off, 250ms on]`
- **Critical**: `[300ms on, 50ms off, 300ms on, 50ms off, 300ms on]`

---

## ♿ Accessibility (a11y) Architecture

- **Atkinson Hyperlegible Typeface**: Developed by the Braille Institute for low vision character distinction.
- **WCAG AAA Color Contrast**: Standard Dark (`#06090e`) with high-visibility accents, plus an **Ultra High Contrast (Black & Yellow)** theme.
- **Text Scaling**: Switchable between Normal ($18\text{px}$), Large ($22\text{px}$), and Extra Large ($26\text{px}$).
- **Large Touch Targets**: All buttons $\ge 48\text{px}-64\text{px}$ height with $4\text{px}$ crisp cyan focus indicators.
- **Full Keyboard Navigation**: Every action operable without a mouse.
- **ARIA Live Regions**: `aria-live="assertive"` for critical safety alerts and `aria-live="polite"` for non-urgent status changes.

---

## 🧪 Diagnostic Test & Demo Modes

- **Live ML Mode**: Communicates with the live Python backend.
- **Demo Mode**: Built-in simulator with multi-obstacle walking scenarios (Clear $\rightarrow$ Person Ahead $\rightarrow$ Chair Left $\rightarrow$ Bicycle Right $\rightarrow$ Car Ahead $\rightarrow$ Clear). Enables demonstration anywhere without a camera or server.
- **Test Mode (T)**: Interactive diagnostic matrix for testing individual directional alerts, speech synthesis, spatial stereo panning, and vibration hardware.

---

## 🛡️ Important Safety Notice

> [!WARNING]
> **Blind's Eye is an assistive navigation prototype designed to augment spatial awareness.**
> It is **NOT** a certified replacement for primary mobility aids, including:
> - White canes
> - Guide dogs
> - Orientation and Mobility (O&M) training
> - Human sighted assistance
>
> Proximity values are **relative depth estimations** derived from monocular computer vision and must not be interpreted as certified physical metric measurements.

---

## ❓ Troubleshooting & FAQ

**Q: The video stream or `/api/detect` is showing offline.**
1. Ensure the Python backend is running: `python server.py`.
2. Confirm the server is bound to port `8000`.
3. If using an IP Webcam app, verify your laptop and smartphone are connected to the same Wi-Fi network or Mobile Hotspot.

**Q: I don't hear directional audio panning.**
- Ensure you are wearing stereo headphones or have dual stereo speakers enabled.

**Q: Vibration feedback does not occur on my laptop.**
- The Vibration API is supported on mobile devices (e.g. Android Chrome). On desktop browsers, the UI displays *"Hardware Unavailable on Device"* while maintaining full speech and visual feedback.

---

## 📜 License
MIT License. Developed for assistive spatial navigation research and accessibility advancement.