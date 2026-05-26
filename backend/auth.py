from fastapi import APIRouter
from database import users
import bcrypt

router = APIRouter()


@router.post("/signup")      #Signup
async def signup(data: dict):
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    existing_user = users.find_one({"email": email})

    if existing_user:
        return {"success": False, "message": "User already exists"}

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    users.insert_one({
    "email": email,
    "password": hashed_password.decode("utf-8"),
    "role": role
    })

    return {"success": True, "message": "Signup successful"}


@router.post("/login")   #Login
async def login(data: dict):
    email = data.get("email")
    password = data.get("password")

    user = users.find_one({"email": email})

    if not user:
        return {"success": False, "message": "User not found"}

    is_password_correct = bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8")
    )

    if not is_password_correct:
        return {"success": False, "message": "Wrong password"}

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "email": user["email"],
            "role": user["role"]
        }
    }