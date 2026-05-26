from fastapi import APIRouter
from database import resumes
from datetime import datetime

router = APIRouter()


@router.post("/save-resume")
async def save_resume(data: dict):

    email = data.get("email")
    resume = data.get("resume")

    if not email:
        return {
            "success": False,
            "message": "Email is required"
        }

    resumes.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "resume": resume,
                "updatedAt": datetime.utcnow()
            }
        },
        upsert=True
    )

    return {
        "success": True,
        "message": "Current resume saved"
    }