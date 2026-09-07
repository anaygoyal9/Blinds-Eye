import os
# 1. Prevent PyTorch & OpenCV multi-threading deadlocks
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import cv2
import numpy as np
import threading
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
from ml_engine import NavigationMLEngine

# Disable extra OpenCV internal threads to prevent GIL locks
cv2.setNumThreads(0)

# ============================================================
# CAMERA SOURCE - edit this one line to switch camera input
# ============================================================
# Default to 0 (laptop webcam) or read from environment variable (e.g. "http://192.168.1.76:8080/video")
CAMERA_SOURCE = os.environ.get("CAMERA_SOURCE", "0")
if isinstance(CAMERA_SOURCE, str) and (CAMERA_SOURCE.isdigit() or CAMERA_SOURCE == "0"):
    CAMERA_SOURCE = int(CAMERA_SOURCE)

# How often (seconds) to retry opening the camera if it's unreachable
CAMERA_RETRY_INTERVAL_SEC = 3

app = FastAPI(title="Spatial Navigation ML Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Global State Variables
engine = None
cap = None
latest_payload = {"status": "CLEAR", "alert_side": "none", "obstacles": []}
latest_jpeg_bytes = None
lock = threading.Lock()
is_running = True

def try_open_camera():
    """Attempts to open CAMERA_SOURCE, with clear diagnostics on failure."""
    print(f"Connecting to camera source: {CAMERA_SOURCE!r} ...")
    new_cap = cv2.VideoCapture(CAMERA_SOURCE)
    if new_cap.isOpened():
        print("Camera connected successfully.")
        return new_cap

    new_cap.release()
    if isinstance(CAMERA_SOURCE, str):
        print(
            f"WARNING: Could not connect to '{CAMERA_SOURCE}'. Checklist:\n"
            "  1. Is the IP Webcam app open on the phone with 'Start server' tapped?\n"
            "  2. Does opening this exact URL in a laptop browser show a live preview?\n"
            "  3. Are the phone and laptop on the SAME Wi-Fi network / same hotspot?\n"
            "  4. Does the router have 'AP isolation' / 'Client isolation' enabled? "
            "Try a phone Mobile Hotspot instead.\n"
            "  5. Is Windows Firewall blocking python.exe from making network requests?"
        )
    else:
        print(f"WARNING: Could not open local webcam index {CAMERA_SOURCE}.")
    return None


def camera_processing_loop():
    """Background thread that continuously reads frames, reconnecting the
    camera automatically if the stream drops or was never reachable at
    startup, and runs ML processing on every frame it gets."""
    global latest_payload, latest_jpeg_bytes, is_running, cap

    print("Camera processing thread started...")
    while is_running:
        if cap is None or not cap.isOpened():
            if cap is not None:
                cap.release()
            cap = try_open_camera()
            if cap is None:
                time.sleep(CAMERA_RETRY_INTERVAL_SEC)
                continue

        ret, frame = cap.read()
        if not ret:
            print("Lost camera stream, will retry connecting...")
            cap.release()
            cap = None
            time.sleep(CAMERA_RETRY_INTERVAL_SEC)
            continue

        try:
            # Run ML Engine
            payload, annotated_frame, depth_map = engine.process_frame(frame)

            # Build side-by-side view (RGB + Depth map)
            combined = np.hstack((annotated_frame, depth_map))
            _, buffer = cv2.imencode('.jpg', combined)
            jpeg_bytes = buffer.tobytes()

            with lock:
                latest_payload = payload
                latest_jpeg_bytes = jpeg_bytes

        except Exception as e:
            print(f"Error in processing loop: {e}")

        time.sleep(0.02)  # Limit CPU load (~30 FPS)

@app.on_event("startup")
def startup_event():
    """Runs automatically when FastAPI starts."""
    global engine, cap
    print("Loading ML Engine models...")
    engine = NavigationMLEngine()

    print("Opening camera source...")
    cap = try_open_camera()
    if cap is None:
        print(
            f"Server will keep starting and retry the camera connection "
            f"in the background every {CAMERA_RETRY_INTERVAL_SEC}s -- fix "
            "the connection using the checklist above, no restart needed."
        )

    # Start background processing thread
    thread = threading.Thread(target=camera_processing_loop, daemon=True)
    thread.start()
    print("Server ready! Access http://127.0.0.1:8000/api/detect")

@app.on_event("shutdown")
def shutdown_event():
    global is_running, cap
    is_running = False
    if cap and cap.isOpened():
        cap.release()

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

@app.get("/")
def root():
    return {"status": "ML Server Running", "endpoints": ["/api/detect", "/video_feed", "/health"]}

@app.get("/health")
def health_check():
    with lock:
        camera_active = cap is not None and cap.isOpened()
    return {
        "status": "healthy",
        "camera_connected": camera_active,
        "camera_source": str(CAMERA_SOURCE),
        "version": "1.0.0"
    }

@app.get("/api/detect")
def get_detection_data():
    with lock:
        return latest_payload

def mjpeg_generator():
    while True:
        with lock:
            if latest_jpeg_bytes is not None:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + latest_jpeg_bytes + b'\r\n')
        time.sleep(0.04)

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(
        mjpeg_generator(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)