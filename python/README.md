# LiTree Python AI Backend

Local Python service that powers advanced agent workflows for LiTree Lab Studios.

## Setup

```bash
cd /home/litbit/LiTTreeLabstudios
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
cd /home/litbit/LiTTreeLabstudios
source .venv/bin/activate
uvicorn python.main:app --host 0.0.0.0 --port 8000 --reload
```

## Endpoints

- `GET /health` — service status
- `POST /agent/prompt-enhance` — enhance image generation prompts
- `POST /agent/orchestrate` — dispatch to the right agent persona
- `POST /agent/chat` — generic agent chat response

## Env vars

Copy `.env.local` values you need (e.g., `GEMINI_API_KEY`) into a `.env` file in the repo root if you want the Python service to use them directly.
