# MUMU AI - Cloudflare Workers

Academic research assistant powered by DeepSeek API, running on Cloudflare Workers.

## Quick Start

1. **Install dependencies**
   ``ash
   npm install
   ``

2. **Create .env.local**
   ``
   DEEPSEEK_API_KEY=sk-your-key-here
   ``

3. **Test locally**
   ``ash
   npm run dev
   ``
   Visit http://localhost:8787

4. **Deploy**
   ``ash
   wrangler login
   wrangler deploy
   ``

## Project Structure

``
.
+-- src/index.js          # Cloudflare Worker
+-- public/               # Static files (HTML, CSS, images)
+-- wrangler.toml         # Worker config
+-- package.json          # Dependencies
+-- START_HERE.md         # Setup guide
``

## API Endpoints

- POST /api/generate - Generate text
- GET /api/health - Health check
- GET / - Homepage

## Models

- om - Fast Output Model (default)
- vm - Research Verifying Model

## Environment Variables

- DEEPSEEK_API_KEY - Your DeepSeek API key (required)

For detailed setup instructions, see START_HERE.md.
