# MUMU AI - Cloudflare Pages

Academic research assistant powered by DeepSeek API, running on Cloudflare Pages with Pages Functions.

## Project Structure

```
.
├── public/              # Static files served by Cloudflare Pages
│   ├── index.html       # Main frontend
│   ├── app.jsx          # React app
│   └── _routes.json     # Route config (API routes → Functions)
├── functions/           # Cloudflare Pages Functions (serverless API)
│   └── api/
│       ├── generate.js  # POST /api/generate
│       └── health.js    # GET /api/health
├── wrangler.toml        # Pages config
└── package.json
```

## Cloudflare Pages Dashboard Settings

| Setting | Value |
|---|---|
| Build command | *(leave blank or `echo done`)* |
| Build output directory | `public` |
| Root directory | `/` |

## Environment Variables (set in Pages dashboard)

- `DEEPSEEK_API_KEY` — Your DeepSeek API key (already configured ✓)

## API Endpoints

- `POST /api/generate` — Generate text (handled by `functions/api/generate.js`)
- `GET /api/health` — Health check (handled by `functions/api/health.js`)

## Models

- `fom` — Fast Output Model (`deepseek-chat`)
- `rvm` — Research Verifying Model (`deepseek-reasoner`)

## Local Development

```bash
npx wrangler pages dev public --compatibility-date=2024-12-16
```
