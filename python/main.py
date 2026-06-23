"""LiTree Python AI Backend — FastAPI service for agent workflows."""

import os
from contextlib import asynccontextmanager
from typing import Any

import requests
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

from .agents import AGENTS, AgentPersona
from .prompt_enhancer import enhance_image_prompt

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"


def ask_gemini(message: str, system_prompt: str) -> str:
    """Call Gemini via REST. Falls back to a local rule-based answer if no key."""
    if not GEMINI_API_KEY:
        return "[Gemini API key not set — add GEMINI_API_KEY to your env]"

    url = f"{GEMINI_URL}?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"role": "user", "parts": [{"text": message}]}],
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1024},
    }
    try:
        res = requests.post(url, json=payload, timeout=30)
        res.raise_for_status()
        data = res.json()
        candidates = data.get("candidates", [])
        if candidates:
            return candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        return "[No response from Gemini]"
    except Exception as e:
        return f"[Gemini error: {e}]"


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🐍 LiTree Python AI backend started")
    yield
    print("🐍 LiTree Python AI backend stopped")


app = FastAPI(title="LiTree AI Backend", lifespan=lifespan)


class PromptEnhanceRequest(BaseModel):
    prompt: str
    context: str = ""


class PromptEnhanceResponse(BaseModel):
    enhanced: str


class ChatRequest(BaseModel):
    message: str
    agent_id: str = "jarvis"


class ChatResponse(BaseModel):
    agent_id: str
    agent_name: str
    response: str


class OrchestrateRequest(BaseModel):
    message: str


class OrchestrateResponse(BaseModel):
    agent_id: str
    agent_name: str
    response: str


@app.get("/health")
async def health() -> dict[str, Any]:
    return {"status": "ok", "gemini": bool(GEMINI_API_KEY)}


@app.post("/agent/prompt-enhance", response_model=PromptEnhanceResponse)
async def prompt_enhance(req: PromptEnhanceRequest) -> PromptEnhanceResponse:
    enhanced = enhance_image_prompt(req.prompt, req.context)
    return PromptEnhanceResponse(enhanced=enhanced)


@app.post("/agent/chat", response_model=ChatResponse)
async def chat(req: ChatRequest) -> ChatResponse:
    persona = AGENTS.get(req.agent_id, AGENTS["jarvis"])
    response = ask_gemini(req.message, persona.system_prompt)
    return ChatResponse(agent_id=persona.id, agent_name=persona.name, response=response)


@app.post("/agent/orchestrate", response_model=OrchestrateResponse)
async def orchestrate(req: OrchestrateRequest) -> OrchestrateResponse:
    """Pick the best agent for the task and run it."""
    selected = AgentPersona.route(req.message)
    response = ask_gemini(req.message, selected.system_prompt)
    return OrchestrateResponse(
        agent_id=selected.id, agent_name=selected.name, response=response
    )
