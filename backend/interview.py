
import os
from dotenv import load_dotenv
from fastapi import APIRouter, Request
from groq import Groq

load_dotenv()

router = APIRouter()

client = Groq(
    api_key=os.getenv("INTERVIEW_Groq_API_KEY")
)

@router.post("/interview")
async def interview(request: Request):

    
    content_type = request.headers.get("content-type", "")

    if "multipart/form-data" in content_type:
        
        return {"face_detected": True}

    
    try:
        data = await request.json()
    except Exception:
        return {"error": "Invalid JSON request"}

    resume_data = data.get("resume")
    history = data.get("history", [])

    prompt = f"""
You are a friendly, experienced human interviewer conducting a real technical interview.

Your personality:
- Natural and conversational like a real human
- Warm and encouraging
- React genuinely to what candidate says
- If candidate asks you something, answer it naturally then continue interview

RULES:
- Be conversational - not robotic
- Ask questions based on candidate's REAL resume - their actual skills, projects, experience
- NEVER ask generic questions like "What are your strengths/weaknesses/where do you see yourself"
- NEVER repeat a topic already covered in conversation history
- Ask ONE question at a time
- If candidate asks you something, answer it warmly then ask your next question
- Follow up naturally on interesting answers
- Move to new topic after one follow-up

FIRST MESSAGE (only when history is empty):
Say exactly:
"Hello and welcome to your technical interview. This interview will take approximately 30 minutes. During this session, we'll discuss your skills, projects, technical knowledge, and previous experiences. Please feel comfortable and answer naturally.

To start, could you briefly introduce yourself?"

AFTER FIRST MESSAGE:
- React to what they said ("That's interesting!", "Great experience!", etc.)
- Then ask next specific question from their resume

Candidate Resume:
{resume_data}

Conversation History:
{history}

Respond naturally as a human interviewer.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=60
    )

    question = response.choices[0].message.content

    return {
        "question": question
    }
