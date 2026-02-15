from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import requests
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# ============ API ENDPOINTS (Don't touch these!) ============

@app.post("/api/generate")
def generate_text(data: RequestBody):
    if not OPENROUTER_API_KEY:
        return {"error": "OPENROUTER_API_KEY not configured"}
    
    # SPEED SETTINGS - Change model here for faster responses
    MODELS = {
             "balanced": "deepseek/deepseek-r1-0528:free",
    }
    
    # 🔥 CHANGE THIS FOR SPEED: "fastest" or "balanced"
    SELECTED_MODEL = MODELS["balanced"]
    
    payload = {
        "model": SELECTED_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": data.prompt}
        ],
        "max_tokens": 1000,      # Lower = faster responses
        "temperature": 0.7,
    }

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mumuai.vercel.app",
        "X-Title": "AI Research Assistant"
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=60
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/health")
def health():
    return {"status": "healthy", "api_key_set": bool(OPENROUTER_API_KEY)}

# ============ FRONTEND SERVING ============

@app.get("/")
def root():
    # Reads HTML from static/index.html
    try:
        with open("static/index.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="""
        <html><body>
            <h1>❌ Frontend not found</h1>
            <p>Add your index.html to the <code>static/</code> folder</p>
        </body></html>
        """, status_code=404)