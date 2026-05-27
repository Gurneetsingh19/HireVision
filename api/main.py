import sys
import os

# Add the current directory (api) to sys.path to allow relative-like absolute imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
import json
import fitz

# Import routers from the api package files
from voice import router as voice_router
from interview import router as interview_router
from face_API import router as face_router
from auth import router as auth_router
from resume import router as resume_router

load_dotenv()

app = FastAPI()

# Include routers with the "/api" prefix for unified Vercel deployment
app.include_router(voice_router, prefix="/api")
app.include_router(interview_router, prefix="/api")
app.include_router(face_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(resume_router, prefix="/api")

# Keep CORS safe for deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Set to False to comply with allow_origins=["*"] and avoid FastAPI startup crash
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(
    api_key=os.getenv("RESUME_GEMINI_API_KEY")
)


@app.post("/api/resume")
async def resume(file: UploadFile = File(...)):

    # Read PDF
    pdf = await file.read()

    # Open PDF
    doc = fitz.open(stream=pdf, filetype="pdf")

    text = ""

    # Extract text
    for page in doc:
        text += page.get_text()
    

    # Gemini model
    model = genai.GenerativeModel(model_name="models/gemini-2.5-flash")

    # Prompt
    prompt = f"""
    You are an AI Resume Analyzer.

    Extract these details from the resume.

    Return ONLY valid JSON.

    Format:

    {{
    "skills": [],
    "education": [],
    "projects": [],
    "experience": ""
    }}

    Resume:
    {text}
    """

    # Generate response
    try:

        response = model.generate_content(prompt)

        print(response.text)

    except Exception as e:

        return {
            "gemini_error": str(e)
        }

    # Clean response
    cleaned = (
        response.text
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    # Debug print
    print(cleaned)

    # Safe JSON parsing
    try:

        data = json.loads(cleaned)

        return data

    except Exception as e:

        return {
            "error": str(e),
            "raw_response": cleaned
        }