from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API key from environment variable
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

SYSTEM_PROMPT = """
You are an academic research assistant for university projects.

STRICT RULES:
- You MUST NOT invent references.
- You MUST NOT cite sources you are not explicitly given.
- If no sources are provided, write WITHOUT references.
- If a claim requires evidence but none exists, write: "SOURCE REQUIRED".

STYLE:
- Formal academic tone
- Human-like sentence variation
- Avoid generic AI phrases
"""

class RequestBody(BaseModel):
    prompt: str

@app.post("/api/generate")
def generate_text(data: RequestBody):
    payload = {
        "model": "tngtech/deepseek-r1t2-chimera:free",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": data.prompt}
        ]
    }

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-app.onrender.com",  # Change this
        "X-Title": "AI Research Assistant"
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        json=payload,
        headers=headers,
        timeout=60
    )

    return response.json()

@app.get("/api/")
def health_check():
    return {"status": "ok", "message": "AI Research Assistant API"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}