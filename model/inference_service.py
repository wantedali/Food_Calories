import os
from pathlib import Path
from typing import List

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from ultralytics import YOLO

app = FastAPI()

# ────────────────────────────────────────────────────────
#  1) Model directory setup (relative to this file, or via MODEL_DIR env-var)
# ────────────────────────────────────────────────────────
BASE_DIR  = Path(__file__).resolve().parent           # e.g. /path/to/.../model
MODEL_DIR = Path(os.getenv("MODEL_DIR", BASE_DIR))    # defaults to same folder

arabic_model_path   = MODEL_DIR / "arabic-food3.pt"
fallback_model_path = MODEL_DIR / "food-101.pt"

if not arabic_model_path.exists() or not fallback_model_path.exists():
    raise RuntimeError(f"Model files not found in {MODEL_DIR!r}")

# ────────────────────────────────────────────────────────
#  2) Load both YOLO models once at startup
# ────────────────────────────────────────────────────────
arabic_model   = YOLO(str(arabic_model_path))
fallback_model = YOLO(str(fallback_model_path))

# ────────────────────────────────────────────────────────
#  3) /analyze endpoint
#     - file: uploaded image  
#     - arabic_thresh: min‐confidence threshold for Arabic model  
#       (if no boxes >= this, we fall back to Food-101)
# ────────────────────────────────────────────────────────
@app.post("/analyze", response_model=List[str])
async def analyze(
    file: UploadFile = File(...),
    arabic_thresh: float = Query(
        0.50,
        title="Arabic Model Threshold",
        description="Minimum confidence for Arabic model to accept detections"
    )
):
    # a) Validate upload is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files are allowed")

    # b) Read & decode into an OpenCV BGR array
    img_bytes = await file.read()
    nparr     = np.frombuffer(img_bytes, np.uint8)
    img       = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(400, "Failed to decode image")

    # c) Run Arabic model with your threshold
    res = arabic_model(img, conf=arabic_thresh)
    # if no boxes pass the threshold, fallback
    if not (res and len(res[0].boxes) > 0):
        res = fallback_model(img, conf=arabic_thresh)

    # d) Extract only the class names
    names: List[str] = []
    for r in res:
        for cls in r.boxes.cls:
            names.append(r.names[int(cls)])

    # e) Return the flat list of names
    return names
