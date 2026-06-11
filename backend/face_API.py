import cv2
import numpy as np
import mediapipe.python.solutions.face_detection as mp_face_detection
from fastapi import APIRouter, UploadFile, File

router = APIRouter()


face_detector = mp_face_detection.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.5
)

@router.post("/detect-face")
async def detect_face(file: UploadFile = File(...)):
    image_bytes = await file.read()

    image_array = np.frombuffer(image_bytes, np.uint8)

    frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    result = face_detector.process(rgb)

    return {
        "face_detected": bool(result.detections)
    }