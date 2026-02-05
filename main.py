from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os

app = FastAPI()

# Get API key from environment variable
API_KEY = os.environ.get("OPENROUTER_API_KEY", "")

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

@app.get("/")
def read_root():
    return {
        "status": "running",
        "message": "Academic Research AI API",
        "endpoints": {
            "/generate": "POST - Generate academic content",
            "/docs": "GET - API documentation"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/generate")
def generate_text(data: RequestBody):
    if not API_KEY:
        return {"error": "API key not configured. Set OPENROUTER_API_KEY environment variable."}
    
    payload = {
        "model": "tngtech/deepseek-r1t2-chimera:free",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": data.prompt}
        ]
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=60
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        return {"error": "Request timed out"}
    except requests.exceptions.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
