# Academic Research AI API

A FastAPI-powered academic research assistant that generates formal, well-structured academic content using AI.

## Features

- 🎓 Academic writing assistant
- 📚 Strict citation requirements
- 🔒 Secure API key management
- 📊 Interactive API documentation
- ⚡ Fast and reliable

## Quick Start

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload

# Visit the API docs
# Open: http://localhost:8000/docs
```

### Deploy to Render

See [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) for detailed instructions.

Quick deploy:
1. Push to GitHub
2. Connect to Render
3. Add `OPENROUTER_API_KEY` environment variable
4. Deploy!

## API Endpoints

### `GET /`
Health check and API information

### `GET /health`
Simple health check endpoint

### `POST /generate`
Generate academic content

**Request Body:**
```json
{
  "prompt": "Explain quantum computing in academic terms"
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "Generated academic content here..."
      }
    }
  ]
}
```

## Environment Variables

- `OPENROUTER_API_KEY` - Your OpenRouter API key (required)
- `PORT` - Server port (default: 8000)

## Tech Stack

- FastAPI - Modern web framework
- Pydantic - Data validation
- Uvicorn - ASGI server
- OpenRouter - AI API gateway

## License

MIT
