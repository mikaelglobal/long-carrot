# 🧠 MUMU AI - Research Assistant Interface

**Modular Unified Machine for Understanding**

A professional, dark-themed AI research assistant with advanced features for academic projects, featuring comprehensive SEO optimization and intuitive user experience.

---

## 📁 Project Structure

```
mumu-ai/
├── 📄 index.html              # Main frontend interface (45KB)
├── 🖼️  MUMU_AI.png            # Full logo with text (13KB)
├── 🖼️  MUMU_AI_0.png          # Brain icon only (17KB)
├── 📄 index.py                # FastAPI backend server
└── 📄 README.md               # This file
```

---

## ✨ Features

### 🎨 **User Interface**
- **Dark Theme Design**: Professional dark mode with gradient accents
- **Logo Integration**: Animated brain logo with hover effects
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Fade-in, slide-in, and hover effects throughout

### 💬 **Chat System**
- **Message Bubbles**: Distinct styling for user (gradient blue) and AI (dark secondary) messages
- **Copy Buttons**: One-click copy for all messages with visual feedback
- **Reaction System**: 
  - 👍 Thumbs up (green glow when active)
  - 👎 Thumbs down (red glow when active)
- **Thinking Indicator**: Animated dots while AI processes responses
- **Welcome Screen**: Quick prompt suggestions to get started

### 🤖 **AI Model Switching**

**Three Ways to Switch Models:**

1. **Button Selector** (Desktop)
   - ⚡ FOM 1.0 - Fast Output Model
   - 🔬 RVM 1.0 - Research Verifying Model

2. **Toggle Switch** (All screens)
   - Visual slider between FOM ↔ RVM
   - Smooth animation and color change

3. **Status Badge** (Desktop)
   - Shows currently active model
   - Pulsing green dot indicator

All three controls are synchronized - changing one updates all.

### 🧠 **Memory Bank Sidebar**
- **Conversation History**: All interactions stored
- **Statistics Display**:
  - Total memories
  - Current session count
- **Memory Cards**: 
  - Timestamp
  - Question preview
  - Model used (FOM/RVM)
  - Token count
- **Click to Reload**: Click any memory to reuse the prompt

### 🔍 **SEO Optimization (100%)**

#### Meta Tags
✅ Primary SEO (title, description, keywords)
✅ Author and robots directives
✅ Language and revisit settings

#### Social Media
✅ Open Graph (Facebook, LinkedIn)
✅ Twitter Cards
✅ Social sharing images

#### Structured Data
✅ Schema.org SoftwareApplication
✅ Schema.org WebApplication
✅ Rich snippets for search engines

#### Performance
✅ Preconnect to API endpoints
✅ DNS prefetch optimization
✅ Favicon and app icons
✅ Mobile viewport optimization

#### Accessibility
✅ ARIA labels
✅ Semantic HTML
✅ Keyboard navigation
✅ Focus indicators

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- OPENROUTER_API_KEY environment variable

### Installation

1. **Install Dependencies**
```bash
pip install fastapi uvicorn requests pydantic --break-system-packages
```

2. **Set API Key**
```bash
export OPENROUTER_API_KEY="your_key_here"
```

3. **Create Directory Structure**
```bash
mkdir -p static
mv index.html static/
mv MUMU_AI*.png static/
```

4. **Run Server**
```bash
uvicorn index:app --reload --host 0.0.0.0 --port 8000
```

5. **Access Interface**
```
http://localhost:8000
```

---

## 📡 API Endpoints

### `POST /api/generate`
Generate AI responses

**Request:**
```json
{
  "prompt": "Your question here",
  "model": "fom"  // or "rvm"
}
```

**Response:**
```json
{
  "choices": [{
    "message": {
      "content": "AI response here"
    }
  }],
  "selected_model_name": "FOM 1.0"
}
```

### `GET /api/health`
Check API status

**Response:**
```json
{
  "status": "healthy",
  "api_key_set": true
}
```

### `GET /`
Serve frontend interface

---

## 🎨 Color Palette

### Brand Colors (from Logo)
- **Cyan**: `#22d3ee` - Technology, innovation
- **Purple**: `#a78bfa` - Intelligence, creativity
- **Lime**: `#a3e635` - Growth, learning
- **Yellow**: `#fbbf24` - Energy, optimism

### UI Colors
- **Primary**: `#6366f1` (Indigo)
- **Accent**: `#06b6d4` (Cyan)
- **Success**: `#10b981` (Green)
- **Danger**: `#ef4444` (Red)

### Dark Theme
- **Background**: `#0a0e1a` (Deep dark blue)
- **Secondary**: `#0f172a` (Slate 900)
- **Tertiary**: `#1e293b` (Slate 800)
- **Border**: `#334155` (Slate 700)

---

## ⌨️ Keyboard Shortcuts

- `Ctrl + Enter` or `Cmd + Enter` - Send message
- `/` - Focus input field (when not typing)

---

## 🎯 Model Specifications

### FOM 1.0 (Fast Output Model)
- **Engine**: `qwen/qwen3-4b:free`
- **Speed**: ⚡ Fast
- **Use Case**: Quick responses, general queries
- **Icon**: ⚡

### RVM 1.0 (Research Verifying Model)
- **Engine**: `openai/gpt-oss-20b:free`
- **Speed**: 🔬 Thorough
- **Use Case**: Research verification, citations
- **Icon**: 🔬

---

## 📱 Responsive Breakpoints

- **Desktop**: > 1200px (All features visible)
- **Tablet**: 768px - 1200px (Button selector hidden)
- **Mobile**: < 768px (Memory panel hidden, toggle only)
- **Small Mobile**: < 480px (Stacked layout)

---

## 🔧 Customization

### Change Colors
Edit CSS variables in `<style>` section:
```css
:root {
    --primary: #6366f1;      /* Main brand color */
    --accent: #06b6d4;       /* Accent color */
    --dark-bg: #0a0e1a;      /* Background */
}
```

### Add Quick Prompts
Modify the welcome screen:
```html
<div class="quick-prompt" onclick="useQuickPrompt('Your prompt')">
    🔥 Your prompt text
</div>
```

### Adjust Models
Edit `index.py` MODELS configuration:
```python
MODELS = {
    "your_model": {
        "id": "model/id:free",
        "name": "Your Model",
        "description": "Description"
    }
}
```

---

## 🐛 Troubleshooting

### API Key Issues
```bash
# Check if key is set
echo $OPENROUTER_API_KEY

# Set temporarily
export OPENROUTER_API_KEY="sk-..."
```

### CORS Errors
Ensure FastAPI CORS middleware is enabled in `index.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Port Already in Use
```bash
# Use different port
uvicorn index:app --port 8080
```

---

## 📊 Performance Metrics

- **Page Size**: ~45KB (HTML)
- **Images**: 30KB total
- **Load Time**: < 1s (local)
- **First Paint**: < 500ms
- **Interactive**: < 1s

---

## 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Implement rate limiting in production
- Add authentication for public deployments

---

## 📄 License

This project is for educational and research purposes.

---

## 👨‍💻 Development

### Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python 3.8+, FastAPI
- **AI Models**: OpenRouter API
- **Styling**: Custom CSS with CSS Variables

### Browser Support
✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile browsers

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API health endpoint: `/api/health`
3. Check browser console for errors
4. Verify API key is set correctly

---

## 🎉 Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Dark Theme | ✅ | Professional dark UI |
| Logo Integration | ✅ | Animated brain logo |
| Model Switching | ✅ | 3 ways to switch |
| Copy Messages | ✅ | One-click copy |
| Reactions | ✅ | 👍👎 with glow |
| Memory Bank | ✅ | Full history sidebar |
| SEO Optimization | ✅ | 100% complete |
| Responsive | ✅ | Mobile-friendly |
| Accessibility | ✅ | ARIA labels |
| Animations | ✅ | Smooth transitions |

---

**Built with ❤️ for Academic Research Excellence**

MUMU AI - Modular Unified Machine for Understanding