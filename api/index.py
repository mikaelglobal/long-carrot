from fastapi import FastAPI
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
import requests
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# API endpoint - note the /api prefix
@app.post("/api/generate")
def generate_text(data: RequestBody):
    if not OPENROUTER_API_KEY:
        return {"error": "OPENROUTER_API_KEY not configured"}
    
    payload = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": data.prompt}
        ]
    }

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-app.vercel.app",
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

# Root endpoint - serves the HTML
@app.get("/")
def root():
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Research Assistant</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            border-radius: 20px 20px 0 0;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { opacity: 0.9; }
        .main { padding: 30px; }
        textarea {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 16px;
            margin-bottom: 20px;
            resize: vertical;
            font-family: inherit;
        }
        textarea:focus { outline: none; border-color: #667eea; }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            transition: transform 0.2s;
        }
        button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
        button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .loading { display: none; text-align: center; padding: 20px; }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .result {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            display: none;
        }
        .result-content { line-height: 1.6; white-space: pre-wrap; }
        .error {
            background: #fee;
            color: #c00;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 AI Research Assistant</h1>
            <p>Your academic research partner powered by AI</p>
        </div>
        
        <div class="main">
            <textarea id="prompt" rows="4" placeholder="Enter your research question...">Explain quantum computing in simple terms</textarea>
            
            <button onclick="generate()" id="generateBtn">Generate Response</button>
            
            <div class="loading" id="loading">
                <div class="spinner"></div>
                <p>Generating response...</p>
            </div>
            
            <div class="result" id="result">
                <h3 style="margin-bottom: 10px;">📝 Response:</h3>
                <div class="result-content" id="resultContent"></div>
            </div>
            
            <div class="error" id="error"></div>
        </div>
    </div>

    <script>
        async function generate() {
            const prompt = document.getElementById('prompt').value.trim();
            if (!prompt) {
                alert('Please enter a prompt');
                return;
            }
            
            const btn = document.getElementById('generateBtn');
            btn.disabled = true;
            
            document.getElementById('loading').style.display = 'block';
            document.getElementById('result').style.display = 'none';
            document.getElementById('error').style.display = 'none';
            
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt })
                });
                
                const data = await response.json();
                
                if (response.ok && !data.error) {
                    const content = data.choices?.[0]?.message?.content || 
                                   data.response || 
                                   'Response received but could not parse content';
                    
                    document.getElementById('resultContent').textContent = content;
                    document.getElementById('result').style.display = 'block';
                } else {
                    throw new Error(data.error || 'Failed to generate response');
                }
            } catch (error) {
                document.getElementById('error').textContent = 'Error: ' + error.message;
                document.getElementById('error').style.display = 'block';
            } finally {
                document.getElementById('loading').style.display = 'none';
                btn.disabled = false;
            }
        }
        
        // Allow Enter key to submit
        document.getElementById('prompt').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                generate();
            }
        });
    </script>
</body>
</html>"""
    return HTMLResponse(content=html_content)