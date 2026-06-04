from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
import json
import os
import fitz

from interview import router as interview_router
from voice import router as voice_router
from auth import router as auth_router
from resume import router as resume_router

load_dotenv()

app = FastAPI()

# ✅ SIRF EK BAAR CORS - allow origins mein dono add hain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hire-vision-flame.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "https://hire-vision-flame.vercel.app",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

# ✅ Saare routers ek jagah
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(voice_router)
app.include_router(interview_router)

# ✅ Gemini configure
genai.configure(api_key=os.getenv("RESUME_GEMINI_API_KEY"))

@app.post("/resume")
async def resume(file: UploadFile = File(...)):

    pdf = await file.read()
    doc = fitz.open(stream=pdf, filetype="pdf")

    text = ""
    for page in doc:
        text += page.get_text()

    model = genai.GenerativeModel(model_name="models/gemini-2.5-flash")

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

    try:
        response = model.generate_content(prompt)
    except Exception as e:
        return {"gemini_error": str(e)}

    cleaned = (
        response.text
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    try:
        data = json.loads(cleaned)
        return data
    except Exception as e:
        return {
            "error": str(e),
            "raw_response": cleaned
        }