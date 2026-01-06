"""
Esports Jobs AI Agent - Pydantic AI with AG-UI

Endpoints:
1. /agui - AG-UI protocol for CopilotKit frontend
2. /chat/completions - OpenAI-compatible SSE for Hume CLM
"""

import os
import json
import uuid
import time
import asyncio
from typing import Optional, List
from textwrap import dedent
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.ag_ui import StateDeps
from pydantic_ai.models.google import GoogleModel

from tools.job_search import search_jobs, get_available_categories, get_available_countries
from tools.company_lookup import lookup_company


# =====
# State
# =====
class Job(BaseModel):
    id: str = ""
    title: str
    company: str
    location: str
    type: str = "Full-time"
    salary: str = "Competitive"
    url: str = ""


class AppState(BaseModel):
    jobs: list[Job] = Field(default_factory=list)
    search_query: str = ""


# =====
# Pydantic AI Agent
# =====
agent = Agent(
    model=GoogleModel('gemini-2.0-flash'),
    deps_type=StateDeps[AppState],
    system_prompt=dedent("""
        You are an enthusiastic AI assistant for EsportsJobs.quest, helping users find careers in esports and gaming.

        ## Your Tools - USE THEM!
        You have these tools available:

        | User asks about... | USE THIS TOOL |
        |-------------------|---------------|
        | jobs, positions, find work | search_esports_jobs |
        | company info, who is X | lookup_esports_company |
        | categories, types of jobs | get_categories |
        | countries, locations | get_countries |

        ## Your Personality
        - Enthusiastic about esports! Use emojis: 🎮 🏆 🚀 💪
        - Be specific with job details
        - Always use your tools to provide real data
        - Keep responses concise but helpful

        ## Response Format
        - Use bullet points for job listings
        - Include company, location, and type
        - Suggest next steps (apply, learn more)
    """).strip()
)


@agent.tool
def search_esports_jobs(ctx: RunContext[StateDeps[AppState]], query: str = None, category: str = None, country: str = None) -> dict:
    """Search for esports jobs. Use this when user asks for jobs or positions.

    Args:
        query: Free text search (title, company, skills)
        category: Job category: coaching, marketing, production, management, content, operations
        country: Country filter
    """
    print(f"🔍 Searching: query={query}, category={category}, country={country}")
    results = search_jobs(query=query, category=category, country=country, limit=5)

    # Update state
    jobs = [Job(
        id=job.id,
        title=job.title,
        company=job.company,
        location=job.location,
        type=job.type,
        salary=job.salary,
        url=job.url
    ) for job in results]
    ctx.deps.state.jobs = jobs
    ctx.deps.state.search_query = query or category or "esports jobs"

    return {
        "jobs": [{"title": j.title, "company": j.company, "location": j.location, "type": j.type, "salary": j.salary, "url": j.url} for j in jobs],
        "count": len(jobs),
        "message": f"Found {len(jobs)} esports jobs!" if jobs else "No jobs found."
    }


@agent.tool
def lookup_esports_company(ctx: RunContext[StateDeps[AppState]], company_name: str) -> dict:
    """Get information about an esports company.

    Args:
        company_name: Company name (e.g., Team Liquid, Riot Games, Fnatic)
    """
    print(f"🏢 Looking up: {company_name}")
    profile = lookup_company(company_name)

    if not profile:
        return {"found": False, "message": f"Company '{company_name}' not found in our database."}

    return {
        "found": True,
        "company": {
            "name": profile.name,
            "description": profile.description,
            "headquarters": profile.headquarters,
            "founded": profile.founded,
            "games": profile.games,
            "achievements": profile.notable_achievements,
            "careers_url": profile.careers_url
        }
    }


@agent.tool
def get_categories(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """Get list of available job categories in esports."""
    categories = get_available_categories()
    return {"categories": categories, "count": len(categories)}


@agent.tool
def get_countries(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """Get list of countries with available esports jobs."""
    countries = get_available_countries()
    return {"countries": countries, "count": len(countries)}


# =====
# AG-UI App (for CopilotKit)
# =====
ag_ui_app = agent.to_ag_ui(deps=StateDeps(AppState()))


# =====
# Main FastAPI App
# =====
main_app = FastAPI(
    title="Esports Jobs Agent",
    description="AI agent for finding esports jobs - Pydantic AI with AG-UI",
    version="2.0.0"
)

main_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check
@main_app.get("/health")
async def health():
    return {"status": "ok", "agent": "esports-jobs", "version": "2.0"}


@main_app.get("/")
async def root():
    return {
        "status": "ok",
        "agent": "esports-jobs",
        "endpoints": ["/agui (AG-UI for CopilotKit)", "/chat/completions (CLM for Hume)", "/health"]
    }


# =====
# CLM Endpoint for Hume Voice
# =====
class ChatMessage(BaseModel):
    role: str
    content: str


class ChatCompletionRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = "esports-agent"
    stream: Optional[bool] = True


async def stream_sse_response(content: str, msg_id: str):
    """Stream OpenAI-compatible SSE chunks for Hume EVI."""
    words = content.split(' ')
    for i, word in enumerate(words):
        chunk = {
            "id": msg_id,
            "object": "chat.completion.chunk",
            "created": int(time.time()),
            "model": "esports-agent",
            "choices": [{
                "index": 0,
                "delta": {"content": word + (' ' if i < len(words) - 1 else '')},
                "finish_reason": None
            }]
        }
        yield f"data: {json.dumps(chunk)}\n\n"
        await asyncio.sleep(0.01)

    final = {
        "id": msg_id,
        "object": "chat.completion.chunk",
        "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}]
    }
    yield f"data: {json.dumps(final)}\n\n"
    yield "data: [DONE]\n\n"


async def run_agent_for_clm(user_message: str) -> str:
    """Run the Pydantic AI agent and return text response."""
    try:
        state = AppState()
        deps = StateDeps(state)
        result = await agent.run(user_message, deps=deps)

        if hasattr(result, 'data') and result.data:
            return str(result.data)
        return str(result)
    except Exception as e:
        print(f"[CLM] Agent error: {e}")
        return "Sorry, I couldn't process that request. Try asking about esports jobs!"


@main_app.post("/chat/completions")
async def clm_endpoint(
    request: ChatCompletionRequest,
    authorization: Optional[str] = Header(None)
):
    """OpenAI-compatible endpoint for Hume CLM."""
    # Verify auth
    expected_secret = os.getenv("CLM_AUTH_SECRET")
    if expected_secret:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing authorization")
        token = authorization.replace("Bearer ", "")
        if token != expected_secret:
            raise HTTPException(status_code=401, detail="Invalid authorization")

    # Get user message
    user_message = request.messages[-1].content if request.messages else ""
    print(f"[CLM] Query: {user_message[:80]}")

    # Run agent
    response_text = await run_agent_for_clm(user_message)
    print(f"[CLM] Response: {response_text[:80]}")

    if request.stream:
        msg_id = f"chatcmpl-{uuid.uuid4().hex[:8]}"
        return StreamingResponse(
            stream_sse_response(response_text, msg_id),
            media_type="text/event-stream"
        )
    else:
        return {
            "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": "esports-agent",
            "choices": [{
                "index": 0,
                "message": {"role": "assistant", "content": response_text},
                "finish_reason": "stop"
            }]
        }


# Mount AG-UI at /agui for CopilotKit
main_app.mount("/agui", ag_ui_app)

# Export app
app = main_app


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
