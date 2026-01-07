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
import re
import sys
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
# User Context Cache (for CopilotKit instructions parsing)
# =====
# When CopilotKit passes user info in instructions, we cache it here
# so tools can access it even when state.user is None
_cached_user_context: dict = {}


def extract_user_from_instructions(instructions: str) -> dict:
    """Extract user info from CopilotKit instructions text."""
    result = {"user_id": None, "name": None, "email": None}

    if not instructions:
        return result

    # Look for User ID pattern (UUID format or general alphanumeric)
    id_match = re.search(r'User ID:\s*([a-zA-Z0-9-]+)', instructions, re.IGNORECASE)
    if id_match:
        result["user_id"] = id_match.group(1)

    # Look for User Name pattern
    name_match = re.search(r'User Name:\s*([^\n]+)', instructions, re.IGNORECASE)
    if name_match:
        result["name"] = name_match.group(1).strip()

    # Look for Email pattern
    email_match = re.search(r'User Email:\s*([^\n]+)', instructions, re.IGNORECASE)
    if email_match:
        result["email"] = email_match.group(1).strip()

    if result["user_id"]:
        global _cached_user_context
        _cached_user_context = result
        print(f"[Cache] Cached user from instructions: {result['name']} ({result['user_id'][:8]}...)", file=sys.stderr)

    return result


def get_effective_user_id(state_user) -> Optional[str]:
    """Get user ID from state or cached instructions."""
    if state_user and state_user.id:
        return state_user.id
    if _cached_user_context.get("user_id"):
        return _cached_user_context["user_id"]
    return None


def get_effective_user_name(state_user) -> Optional[str]:
    """Get user name from state or cached instructions."""
    if state_user and (state_user.firstName or state_user.name):
        return state_user.firstName or state_user.name
    if _cached_user_context.get("name"):
        return _cached_user_context["name"]
    return None


def get_effective_user_email(state_user) -> Optional[str]:
    """Get user email from state or cached instructions."""
    if state_user and state_user.email:
        return state_user.email
    if _cached_user_context.get("email"):
        return _cached_user_context["email"]
    return None


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


class UserProfile(BaseModel):
    """User profile synced from frontend auth."""
    id: Optional[str] = None
    name: Optional[str] = None
    firstName: Optional[str] = None
    email: Optional[str] = None


class AppState(BaseModel):
    jobs: list[Job] = Field(default_factory=list)
    search_query: str = ""
    user: Optional[UserProfile] = None


# =====
# Pydantic AI Agent
# =====
agent = Agent(
    model=GoogleModel('gemini-2.0-flash'),
    deps_type=StateDeps[AppState],
)


@agent.system_prompt
async def build_system_prompt(ctx: RunContext[StateDeps[AppState]]) -> str:
    """Build dynamic system prompt with user context."""
    state = ctx.deps.state
    user = state.user

    # Get effective user info (from state OR cached from CopilotKit instructions)
    user_name = get_effective_user_name(user)
    user_email = get_effective_user_email(user)
    user_id = get_effective_user_id(user)

    print(f"[Prompt] Building prompt: name={user_name}, email={user_email}, id={user_id[:8] if user_id else None}...", file=sys.stderr)

    # Build user context section
    if user_name:
        user_context = f"""## CRITICAL USER CONTEXT
You are speaking with {user_name}.
- User Name: {user_name}
- User Email: {user_email or 'unknown'}
- User ID: {user_id or 'unknown'}

IMPORTANT: When the user asks "what is my name?", "who am I?", or similar personal questions,
ANSWER DIRECTLY using the info above. Say "Your name is {user_name}" - DO NOT say you don't know!

Address them by name occasionally to be friendly."""
    else:
        user_context = """## USER CONTEXT
The user is not logged in yet. Encourage them to sign up for personalized job recommendations!"""

    return dedent(f"""
        You are an enthusiastic AI assistant for EsportsJobs.quest, helping users find careers in esports and gaming.

        {user_context}

        ## CRITICAL: ALWAYS USE YOUR TOOLS!
        You MUST use tools to answer questions about jobs. NEVER make up job information.

        **MANDATORY TOOL USAGE:**
        - "Team Liquid", "Riot Games", "Fnatic", "Cloud9", "G2", "100 Thieves" -> CALL lookup_esports_company
        - "find jobs", "show jobs", "marketing jobs" -> CALL search_esports_jobs
        - "what categories", "job types" -> CALL get_categories
        - "which countries", "locations" -> CALL get_countries

        ## Examples:
        User: "Tell me about Team Liquid"
        You: [CALL lookup_esports_company with company_name="Team Liquid"]

        User: "Find me coaching jobs"
        You: [CALL search_esports_jobs with category="coaching"]

        User: "What is my name?"
        You: "Your name is {user_name or 'unknown - please sign in'}!"

        ## Your Personality
        - Enthusiastic about esports! Use emojis sparingly: 🎮 🏆
        - Be specific with real data from tools
        - Keep responses concise but helpful
    """).strip()


@agent.tool
def search_esports_jobs(ctx: RunContext[StateDeps[AppState]], query: str = None, category: str = None, country: str = None) -> dict:
    """Search for esports jobs. Use this when user asks for jobs or positions.

    Args:
        query: Free text search (title, company, skills)
        category: Job category: coaching, marketing, production, management, content, operations
        country: Country filter
    """
    print(f"[Tool] Searching: query={query}, category={category}, country={country}", file=sys.stderr)
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
        "jobs": [{"id": j.id, "title": j.title, "company": j.company, "location": j.location, "type": j.type, "salary": j.salary, "url": j.url} for j in jobs],
        "count": len(jobs),
        "search_query": query or category or country or "esports jobs",
        "message": f"Found {len(jobs)} esports jobs!" if jobs else "No jobs found."
    }


@agent.tool
def lookup_esports_company(ctx: RunContext[StateDeps[AppState]], company_name: str) -> dict:
    """Get information about an esports company.

    Args:
        company_name: Company name (e.g., Team Liquid, Riot Games, Fnatic)
    """
    print(f"[Tool] Looking up: {company_name}", file=sys.stderr)
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


# =====
# Middleware to Extract User Context from CopilotKit Instructions
# =====
@main_app.middleware("http")
async def extract_user_middleware(request: Request, call_next):
    """Extract user context from CopilotKit instructions before processing."""
    global _cached_user_context

    # Only process POST requests that might contain messages
    if request.method == "POST":
        try:
            # Read and restore body
            body_bytes = await request.body()
            if body_bytes:
                body = json.loads(body_bytes)

                # AG-UI protocol: User context is in state.user
                state = body.get("state", {})
                state_user = state.get("user", {})
                if state_user and state_user.get("id"):
                    _cached_user_context = {
                        "user_id": state_user.get("id"),
                        "name": state_user.get("firstName") or state_user.get("name"),
                        "email": state_user.get("email")
                    }
                    print(f"[Middleware] AG-UI cached user: {_cached_user_context.get('name')}", file=sys.stderr)

                # CLM protocol: User context might be in system messages
                messages = body.get("messages", [])
                for msg in messages:
                    role = msg.get("role", "")
                    content = msg.get("content", "")

                    if role == "system" and "User ID:" in content:
                        extracted = extract_user_from_instructions(content)
                        if extracted.get("user_id"):
                            _cached_user_context = extracted
                            print(f"[Middleware] CLM cached user: {extracted.get('name')}", file=sys.stderr)
                            break

                # Reconstruct request with body
                async def receive():
                    return {"type": "http.request", "body": body_bytes}

                request = Request(request.scope, receive)
        except Exception as e:
            print(f"[Middleware] Error extracting user: {e}", file=sys.stderr)

    return await call_next(request)


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
        print(f"[CLM] Starting agent run for: {user_message[:50]}", file=sys.stderr)
        state = AppState()
        deps = StateDeps(state)
        result = await agent.run(user_message, deps=deps)
        print(f"[CLM] Agent result type: {type(result)}", file=sys.stderr)

        # Pydantic AI returns result.output for the text response
        if hasattr(result, 'output') and result.output:
            return str(result.output)
        if hasattr(result, 'data') and result.data:
            return str(result.data)
        return str(result)
    except Exception as e:
        import traceback
        print(f"[CLM] Agent error: {e}", file=sys.stderr)
        print(f"[CLM] Traceback: {traceback.format_exc()}", file=sys.stderr)
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
    print(f"[CLM] Query: {user_message[:80]}", file=sys.stderr)

    # Run agent
    response_text = await run_agent_for_clm(user_message)
    print(f"[CLM] Response: {response_text[:80]}", file=sys.stderr)

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
