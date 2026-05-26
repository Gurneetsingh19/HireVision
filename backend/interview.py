# from fastapi import APIRouter
# from dotenv import load_dotenv
# import google.generativeai as genai
# import os
# load_dotenv()

# router = APIRouter()

# @router.post("/interview")
# async def interview(data: dict):
    
#     resume_data = data.get("resume")
#     history = data.get("history")

#     genai.configure(
#     api_key=os.getenv("INTERVIEW_GEMINI_API_KEY")
#     )

#     model = genai.GenerativeModel("models/gemini-2.5-flash")

#     prompt = f"""
# You are a professional AI interviewer conducting a real technical interview.

# Your personality:
# - Natural
# - Conversational
# - Professional
# - Human-like

# Rules:
# -Ask only ONE short question at a time.
# - If this is the first question, ask a short intro question.
# - Maximum 15 words.
# - Do not explain the question.
# - Do not give examples.
# - Do not write long paragraphs.
# - Avoid repeating the same question.
# - React naturally to candidate answers.
# - Ask follow-up questions.
# - Keep conversation realistic.

# Candidate Resume:
# {resume_data}

# Conversation History:
# {history}

# Generate the next interview question.
# """

#     response = model.generate_content(prompt)

#     return {
#         "question": response.text
#     }
    
import os
from dotenv import load_dotenv
from fastapi import APIRouter
from groq import Groq

load_dotenv()

router = APIRouter()

client = Groq(
    api_key=os.getenv("INTERVIEW_Groq_API_KEY")
)

@router.post("/interview")
async def interview(data: dict):

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