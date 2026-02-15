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
    model: str = "fom"  # Default to fast model

# ============ API ENDPOINTS (Don't touch these!) ============

@app.post("/api/generate")
def generate_text(data: RequestBody):
    if not OPENROUTER_API_KEY:
        return {"error": "OPENROUTER_API_KEY not configured"}
    
    # MODEL CONFIGURATIONS
    MODELS = {
        "fom": {
            "id": "qwen/qwen-2.5-72b-instruct:free",  # FOM 1.0 - Fast Output Model
            "name": "FOM 1.0",
            "description": "Fast Output Model"
        },
        "rvm": {
            "id": "openai/gpt-4o-mini-2024-07-18:free",  # RVM 1.0 - Research Verifying Model
            "name": "RVM 1.0", 
            "description": "Research Verifying Model"
        }
    }
    
    # Select model based on request
    selected_config = MODELS.get(data.model, MODELS["fom"])
    SELECTED_MODEL = selected_config["id"]
    
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
        result = response.json()
        # Add selected model info to response
        result["selected_model_name"] = selected_config["name"]
        return result
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