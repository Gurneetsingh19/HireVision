
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

    # ✅ FIX: Content-type check - face detection image aaye toh ignore karo
    content_type = request.headers.get("content-type", "")

    if "multipart/form-data" in content_type:
        # Face detection wali request hai - MediaPipe/OpenCV handle karega
        return {"face_detected": True}

    # ✅ Normal interview JSON request
    try:
        data = await request.json()
    except Exception:
        return {"error": "Invalid JSON request"}

    resume_data = data.get("resume")
    history = data.get("history", [])

    prompt = f"""
You are a real human interviewer.

imp:-
    return EXACTLY this message.

Do not summarize.
Do not shorten.
Do not reword.
Do not add or remove sentences.
Do not ask any additional questions.
Output must match character-for-character.

TEXT:

"Hello and welcome to your technical interview.

This interview will take approximately 30 minutes. During this session, we'll discuss your skills, projects, technical knowledge, and previous experiences.

Please feel comfortable and answer naturally.


Rules:
- If it is first question then start from welcoming, speak the uper peragraph, don't speak rules. 
- Ask only ONE short question at a time but speak that welocomg as it is.
- Start first question as introduction "could you briefly introduce yourself?"
- Maximum 15 words except welcoming.
- Return only the question.
- Do not repeat the same topic.
- Ask follow-up only once, then move to a new topic.
- Keep it natural and professional.

Candidate Resume:
{resume_data}

Conversation History:
{history}

Ask the next interview question.
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
