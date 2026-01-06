"""
Esports Jobs AI Agent - FastAPI Backend

Provides two endpoints:
1. /copilotkit - AG-UI protocol for CopilotKit frontend
2. /chat/completions - OpenAI-compatible SSE for Hume CLM
"""

import os
import json
import uuid
import time
from typing import Optional, List
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from tools.job_search import search_jobs, get_job_by_id, get_available_categories, get_available_countries
from tools.company_lookup import lookup_company, get_all_companies, search_companies_by_game


def simple_agent_response(user_message: str) -> str:
    """Simple keyword-based response for MVP (no LLM needed)."""
    msg_lower = user_message.lower()

    # Check for job search keywords
    if any(word in msg_lower for word in ['job', 'jobs', 'find', 'search', 'looking', 'work', 'career', 'hire', 'hiring']):
        # Determine category from message
        category = None
        if 'marketing' in msg_lower:
            category = 'marketing'
        elif 'coach' in msg_lower:
            category = 'coaching'
        elif 'produc' in msg_lower:
            category = 'production'
        elif 'content' in msg_lower:
            category = 'content'
        elif 'manage' in msg_lower:
            category = 'management'
        elif 'operation' in msg_lower:
            category = 'operations'

        results = search_jobs(category=category, limit=5)
        if results:
            jobs_text = []
            for job in results:
                jobs_text.append(f"**{job.title}** at {job.company}\n- Location: {job.location}\n- Type: {job.type}\n- Salary: {job.salary}\n- Apply: {job.url}")
            return f"Here are {len(results)} esports jobs I found:\n\n" + "\n\n".join(jobs_text)
        return "I couldn't find any jobs matching your criteria. Try asking about a specific category like marketing, coaching, or production."

    # Check for company keywords
    company_names = ['team liquid', 'riot', 'fnatic', 'cloud9', 'g2', '100 thieves', 'logitech', 'octagon', 'garena']
    for company in company_names:
        if company in msg_lower:
            profile = lookup_company(company)
            if profile:
                return f"**{profile.name}**\n\n{profile.description}\n\n- Headquarters: {profile.headquarters}\n- Founded: {profile.founded}\n- Games: {', '.join(profile.games)}\n- Careers: {profile.careers_url}"

    # Check for category/country info
    if 'categor' in msg_lower:
        categories = get_available_categories()
        return f"Available job categories in esports: {', '.join(categories)}"

    if 'countr' in msg_lower or 'where' in msg_lower:
        countries = get_available_countries()
        return f"We have esports jobs in these countries: {', '.join(countries)}"

    # Default greeting
    return "Welcome to EsportsJobs.quest! I can help you find esports jobs. Try asking me:\n\n- 'Find me esports marketing jobs'\n- 'What coaching jobs are available?'\n- 'Tell me about Team Liquid'\n- 'What job categories are there?'"


# FastAPI app
app = FastAPI(
    title="Esports Jobs Agent",
    description="AI agent for finding esports jobs and career guidance",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check
@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "agent": "esports-jobs"}


# ----- Hume CLM Endpoint (OpenAI-compatible) -----

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatCompletionRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = "esports-agent"
    stream: Optional[bool] = True
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1024


async def generate_openai_stream(messages: List[ChatMessage]):
    """Generate OpenAI-compatible SSE stream."""
    user_message = messages[-1].content if messages else ""

    try:
        response_text = simple_agent_response(user_message)
        chunk_size = 20  # characters per chunk

        for i in range(0, len(response_text), chunk_size):
            chunk = response_text[i:i + chunk_size]
            data = {
                "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
                "object": "chat.completion.chunk",
                "created": int(time.time()),
                "model": "esports-agent",
                "choices": [{
                    "index": 0,
                    "delta": {"content": chunk},
                    "finish_reason": None
                }]
            }
            yield f"data: {json.dumps(data)}\n\n"

        # Send done signal
        done_data = {
            "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
            "object": "chat.completion.chunk",
            "created": int(time.time()),
            "model": "esports-agent",
            "choices": [{
                "index": 0,
                "delta": {},
                "finish_reason": "stop"
            }]
        }
        yield f"data: {json.dumps(done_data)}\n\n"
        yield "data: [DONE]\n\n"

    except Exception as e:
        error_data = {"error": {"message": str(e), "type": "agent_error"}}
        yield f"data: {json.dumps(error_data)}\n\n"


@app.post("/chat/completions")
async def chat_completions(
    request: ChatCompletionRequest,
    authorization: Optional[str] = Header(None)
):
    """OpenAI-compatible chat completions endpoint for Hume CLM."""
    # Verify auth token
    expected_secret = os.getenv("CLM_AUTH_SECRET")
    if expected_secret:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing authorization")
        token = authorization.replace("Bearer ", "")
        if token != expected_secret:
            raise HTTPException(status_code=401, detail="Invalid authorization")

    if request.stream:
        return StreamingResponse(
            generate_openai_stream(request.messages),
            media_type="text/event-stream"
        )
    else:
        user_message = request.messages[-1].content if request.messages else ""
        response_text = simple_agent_response(user_message)
        return {
            "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": "esports-agent",
            "choices": [{
                "index": 0,
                "message": {"role": "assistant", "content": response_text},
                "finish_reason": "stop"
            }],
            "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
        }


# ----- CopilotKit Endpoint (AG-UI protocol) -----
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitRemoteEndpoint, Action

def copilotkit_search_jobs(query: str = None, category: str = None, country: str = None, job_type: str = None) -> dict:
    """Search for esports jobs based on criteria."""
    results = search_jobs(query=query, category=category, country=country, job_type=job_type, limit=5)
    return {
        "jobs": [{"id": job.id, "title": job.title, "company": job.company, "location": job.location, "type": job.type, "salary": job.salary, "skills": job.skills, "url": job.url} for job in results],
        "count": len(results),
        "message": f"Found {len(results)} jobs matching your criteria." if results else "No jobs found."
    }

def copilotkit_lookup_company(company_name: str) -> dict:
    """Look up information about an esports company."""
    profile = lookup_company(company_name)
    if not profile:
        return {"found": False, "message": f"Company '{company_name}' not found."}
    return {"found": True, "company": {"name": profile.name, "description": profile.description, "headquarters": profile.headquarters, "founded": profile.founded, "games": profile.games, "achievements": profile.notable_achievements, "culture": profile.culture, "careers_url": profile.careers_url}}

def copilotkit_get_categories() -> dict:
    return {"categories": get_available_categories()}

def copilotkit_get_countries() -> dict:
    return {"countries": get_available_countries()}

# Create CopilotKit SDK endpoint
sdk = CopilotKitRemoteEndpoint(
    actions=[
        Action(name="search_jobs", description="Search for esports jobs by query, category, country, or job type.", handler=copilotkit_search_jobs, parameters=[
            {"name": "query", "type": "string", "description": "Free text search (title, company, skills)"},
            {"name": "category", "type": "string", "description": "Job category: coaching, marketing, production, management, content, operations"},
            {"name": "country", "type": "string", "description": "Country filter"},
            {"name": "job_type", "type": "string", "description": "Job type: Full-time, Part-time, Contract, Intern"},
        ]),
        Action(name="lookup_company", description="Get detailed information about an esports company.", handler=copilotkit_lookup_company, parameters=[
            {"name": "company_name", "type": "string", "description": "Company name (e.g., Team Liquid, Riot Games)", "required": True},
        ]),
        Action(name="get_job_categories", description="Get a list of all available job categories in esports.", handler=copilotkit_get_categories, parameters=[]),
        Action(name="get_job_countries", description="Get a list of countries with available esports jobs.", handler=copilotkit_get_countries, parameters=[]),
    ]
)

add_fastapi_endpoint(app, sdk, "/copilotkit")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
