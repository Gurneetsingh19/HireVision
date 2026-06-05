import os
from dotenv import load_dotenv
from fastapi import APIRouter
from fastapi.responses import Response
from elevenlabs.client import ElevenLabs

load_dotenv()

router = APIRouter()

client = ElevenLabs(
    api_key=os.getenv("Elevenlabs_API_KEY")
)

@router.post("/speak")
async def speak(data: dict):

    text = data.get("text")

    audio = client.text_to_speech.convert(
        voice_id="bx9yHra8BnySloO8G3NG",
        model_id="eleven_multilingual_v2",
        text=text
    )

    audio_bytes = b"".join(audio)

    return Response(
        content=audio_bytes,
        media_type="audio/mpeg"
    )
