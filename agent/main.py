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

from tools.job_search import search_jobs, get_available_categories, get_available_countries, get_job_by_id
from tools.company_lookup import lookup_company
from tools.user_context import (
    get_user_profile, save_user_profile,
    get_user_job_interests, save_job_interest,
    get_conversation_memory, search_user_memories,
    get_full_user_context,
    # Profile items (skills, role, location coaching)
    ensure_profile_items_table, get_profile_items,
    save_profile_item, delete_profile_item,
    get_profile_completeness as get_profile_completeness_db
)


# =====
# User Context Cache (for CopilotKit instructions parsing)
# =====
# When CopilotKit passes user info in instructions, we cache it here
# so tools can access it even when state.user is None
_cached_user_context: dict = {}


def extract_user_from_instructions(instructions: str) -> dict:
    """Extract user info from CopilotKit instructions or Hume system prompt."""
    result = {"user_id": None, "name": None, "email": None}

    if not instructions:
        return result

    # Look for User ID pattern - multiple formats
    # "User ID: xxx" or "ID: xxx"
    id_match = re.search(r'(?:User\s+)?ID:\s*([a-zA-Z0-9-]+)', instructions, re.IGNORECASE)
    if id_match:
        result["user_id"] = id_match.group(1)

    # Look for User Name pattern - multiple formats
    # "User Name: xxx" or "Name: xxx"
    name_match = re.search(r'(?:User\s+)?Name:\s*([^\n]+)', instructions, re.IGNORECASE)
    if name_match:
        result["name"] = name_match.group(1).strip()

    # Look for Email pattern
    email_match = re.search(r'(?:User\s+)?Email:\s*([^\n]+)', instructions, re.IGNORECASE)
    if email_match:
        result["email"] = email_match.group(1).strip()

    if result["user_id"] or result["name"]:
        global _cached_user_context
        _cached_user_context = result
        name_display = result['name'] or 'Unknown'
        id_display = result['user_id'][:8] + '...' if result['user_id'] else 'N/A'
        print(f"[Cache] Cached user: {name_display} ({id_display})", file=sys.stderr)

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


class PageContext(BaseModel):
    """Current page context synced from frontend."""
    pageId: str = ""
    pageType: str = ""  # "job-listing" | "career-guide" | "salary-guide" | "homepage"
    location: Optional[str] = None
    category: Optional[str] = None
    title: str = ""


class AppState(BaseModel):
    jobs: list[Job] = Field(default_factory=list)
    search_query: str = ""
    user: Optional[UserProfile] = None
    page: Optional[PageContext] = None


# =====
# Pydantic AI Agent - Using STATIC system prompt like copilotkit-demo
# =====
agent = Agent(
    model=GoogleModel('gemini-2.0-flash'),
    deps_type=StateDeps[AppState],
    system_prompt=dedent("""
        You are an enthusiastic AI assistant for EsportsJobs.quest, helping users find careers in esports and gaming.

        ## CRITICAL: ALWAYS USE YOUR TOOLS!
        You MUST use tools to answer ALL questions. NEVER make up information.

        **MANDATORY TOOL USAGE:**
        | User asks... | TOOL TO CALL |
        |--------------|--------------|
        | "What is my name/email?" | get_my_profile |
        | "What page am I on?" | get_current_page |
        | "What are my skills?" | get_user_skills_and_preferences |
        | "Show my profile" | show_user_profile_graph |
        | "What jobs have I saved?" | get_my_saved_jobs |
        | "Remember when I said..." | recall_past_conversations |
        | "Tell me about [company]" | lookup_esports_company |
        | "Find/show jobs" | search_esports_jobs |
        | "Save this job" | save_job_to_favorites |
        | "I know Python" / skills | save_user_skill |
        | "Looking for CTO roles" | save_role_preference |
        | "I'm based in London" | save_location_preference |
        | "I have 5 years experience" | save_experience_level |
        | "Is my profile complete?" | check_profile_completeness |
        | "Check my characters" | check_character_completion |
        | "Which characters are done?" | check_character_completion |
        | "Am I a good fit for this job?" | assess_job_fit |
        | "Assess my fit" / job match | assess_job_fit |

        ## PAGE CONTEXT AWARENESS
        ALWAYS call get_current_page when the user asks about jobs or content.
        Use the page context to provide relevant recommendations:
        - If user is on a location page (e.g., London), prioritize jobs in that location
        - If user is on a career guide page, provide career-relevant advice
        - If user is on a salary guide page, focus on salary information

        Example: User on "esports-jobs-london" page asks "show me jobs"
        → Use search_esports_jobs with country filter for UK/London

        ## CHARACTER-BASED PROFILE SYSTEM
        Users build their profile through 4 characters. Guide them to complete each:

        ### REPO - Your Foundation (Cyan)
        - **What it tracks**: Location, Target Role
        - **Questions**: "Where are you based?" → "What role are you looking for?"
        - **Complete message**: "Repo is set - your foundation is solid!"

        ### TRINITY - Your Identity (Purple)
        - **What it tracks**: Skills (need 2+), Career Goal
        - **Questions**: "What are your top 2-3 skills?" → "What's your career goal?"
        - **Complete message**: "Trinity unlocked - I know your strengths!"

        ### VELO - Your Velocity (Pink)
        - **What it tracks**: Years of Experience, Career History
        - **Questions**: "How many years of experience do you have?" → "Tell me about your career path"
        - **Complete message**: "Velo activated - your momentum is clear!"

        ### REACH - Your Network (Gold)
        - **What it tracks**: Saved Jobs, Profile Visibility
        - **Always complete** - optional character for expansion
        - **Message**: "Reach expanded - you're connected!"

        ## ONBOARDING FLOW
        For NEW users, guide them through characters in order:

        1. **Check status first**: Call check_character_completion at START
        2. **Guide sequentially**: Repo → Trinity → Velo → Ready to search!
        3. **Skip completed**: If a character is done, move to the next
        4. **Celebrate**: When all complete: "All characters unlocked! Let's find your perfect role! 🏆"

        ### SAVING DATA
        When user mentions info, save it SILENTLY then confirm briefly:
        - "I know Python" → save_user_skill("Python") → "Got it, Python added to Trinity!"
        - "I'm in London" → save_location_preference("London") → "London set for Repo!"
        - "Looking for marketing" → save_role_preference("Marketing") → "Marketing role locked in!"
        - "5 years experience" → save_experience_level(5) → "5 years noted for Velo!"

        ### AUTOMATIC DETECTION
        - Call check_character_completion at START of conversation
        - Skip to first incomplete character
        - If all complete → Go straight to helping them search jobs

        ## PERSONALIZED ADVICE
        When recommending jobs, FIRST call get_user_skills_and_preferences to understand:
        - User's skills and proficiency levels
        - Target role and location
        - Jobs they've saved before

        Use this to personalize recommendations:
        - Filter jobs by user's preferred location
        - Highlight jobs matching their skills
        - Suggest roles aligned with their career goals

        ## Your Personality
        - Enthusiastic about esports! Use emojis sparingly: 🎮 🏆
        - Be specific with real data from tools
        - Give personalized advice based on user context
        - Keep responses concise but helpful
        - Proactively help users complete their profile
    """).strip(),
)


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


@agent.tool
def get_my_profile(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """Get the current user's profile info (name, email, id).

    ALWAYS call this tool when user asks: "what is my name", "what is my email", "who am I", etc.
    """
    # Try from state first
    state = ctx.deps.state
    user = state.user

    if user and user.id:
        print(f"[Tool] get_my_profile from state: {user.name}", file=sys.stderr)
        return {
            "found": True,
            "name": user.firstName or user.name,
            "email": user.email,
            "id": user.id,
            "message": f"User is {user.firstName or user.name}"
        }

    # Try from cached context (extracted by middleware)
    if _cached_user_context.get("user_id"):
        print(f"[Tool] get_my_profile from cache: {_cached_user_context.get('name')}", file=sys.stderr)
        return {
            "found": True,
            "name": _cached_user_context.get("name"),
            "email": _cached_user_context.get("email"),
            "id": _cached_user_context.get("user_id"),
            "message": f"User is {_cached_user_context.get('name')}"
        }

    return {
        "found": False,
        "message": "User not logged in. Please sign in to see your profile."
    }


@agent.tool
def get_current_page(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """Get information about the page the user is currently viewing.

    ALWAYS call this when user asks about jobs or content to understand their context.
    Use the page location/category to filter job searches appropriately.
    """
    page = ctx.deps.state.page

    if page and page.pageId:
        print(f"[Tool] get_current_page: {page.pageId} ({page.pageType})", file=sys.stderr)
        return {
            "found": True,
            "pageId": page.pageId,
            "pageType": page.pageType,
            "location": page.location,
            "category": page.category,
            "title": page.title,
            "context": f"User is viewing: {page.title}" + (f" (Location: {page.location})" if page.location else "")
        }

    print("[Tool] get_current_page: User is on homepage (no page context)", file=sys.stderr)
    return {
        "found": False,
        "pageId": "homepage",
        "pageType": "homepage",
        "message": "User is on the homepage or page context not set"
    }


@agent.tool
def get_my_full_context(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """Get complete user context including profile, job interests, and conversation history.

    Call this when you need to understand the user's background, skills, or past interactions.
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"found": False, "message": "User not logged in"}

    print(f"[Tool] Getting full context for: {user_id}", file=sys.stderr)
    context = get_full_user_context(user_id)
    return {"found": True, "context": context}


@agent.tool
def update_my_skills(ctx: RunContext[StateDeps[AppState]], skills: list[str]) -> dict:
    """Update the user's skills profile.

    Args:
        skills: List of skills like ["marketing", "social media", "esports management"]
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"success": False, "message": "User not logged in"}

    print(f"[Tool] Updating skills for {user_id}: {skills}", file=sys.stderr)
    email = get_effective_user_email(ctx.deps.state.user)
    name = get_effective_user_name(ctx.deps.state.user)

    result = save_user_profile(user_id, email=email, name=name, skills=skills)
    return result


@agent.tool
def save_job_to_favorites(ctx: RunContext[StateDeps[AppState]], job_id: str) -> dict:
    """Save a job to user's favorites/interests.

    Args:
        job_id: The ID of the job to save
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"success": False, "message": "User not logged in"}

    print(f"[Tool] Saving job {job_id} for user {user_id}", file=sys.stderr)
    result = save_job_interest(user_id, job_id, interest_type="favorited")
    return result


@agent.tool
def get_my_saved_jobs(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """Get jobs the user has saved or shown interest in.

    Returns list of jobs user has interacted with.
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"found": False, "message": "User not logged in"}

    print(f"[Tool] Getting saved jobs for: {user_id}", file=sys.stderr)
    result = get_user_job_interests(user_id, limit=10)
    return result


@agent.tool
def recall_past_conversations(ctx: RunContext[StateDeps[AppState]], topic: str = None) -> dict:
    """Search past conversations for relevant context.

    Args:
        topic: Optional topic to search for in conversation history
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"found": False, "message": "User not logged in"}

    print(f"[Tool] Recalling conversations for {user_id}, topic: {topic}", file=sys.stderr)

    if topic:
        result = search_user_memories(user_id, topic, limit=3)
    else:
        result = get_conversation_memory(user_id, limit=5)

    return result


# =====
# Profile Coaching Tools (Skills, Role, Location)
# =====

@agent.tool
def save_user_skill(ctx: RunContext[StateDeps[AppState]], skill: str, proficiency: str = "intermediate") -> dict:
    """Save a skill to user's profile.

    Call this when user mentions they have a skill (e.g., "I know Python", "I'm good at marketing").

    Args:
        skill: The skill name (e.g., "Python", "Marketing", "Leadership")
        proficiency: Skill level - "beginner", "intermediate", or "expert"
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"success": False, "message": "User not logged in"}

    print(f"[Tool] Saving skill '{skill}' ({proficiency}) for user {user_id}", file=sys.stderr)

    result = save_profile_item(
        user_id=user_id,
        item_type="skill",
        value=skill,
        metadata={"proficiency": proficiency},
        confirmed=True  # Direct save, HITL handled in frontend if needed
    )

    if result.get("success"):
        return {
            "success": True,
            "message": f"Added {skill} ({proficiency}) to your profile",
            "skill": skill,
            "proficiency": proficiency
        }
    return result


@agent.tool
def save_role_preference(ctx: RunContext[StateDeps[AppState]], role: str) -> dict:
    """Save user's target job role. Replaces any previous role.

    Call this when user mentions what role they're looking for (e.g., "I want to be a CTO", "Looking for marketing roles").

    Args:
        role: The target role (e.g., "CTO", "Marketing Manager", "Esports Coach")
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"success": False, "message": "User not logged in"}

    print(f"[Tool] Saving role preference '{role}' for user {user_id}", file=sys.stderr)

    result = save_profile_item(
        user_id=user_id,
        item_type="role",
        value=role,
        confirmed=True
    )

    if result.get("success"):
        return {
            "success": True,
            "message": f"Set your target role to: {role}",
            "role": role
        }
    return result


@agent.tool
def save_location_preference(ctx: RunContext[StateDeps[AppState]], location: str, remote_ok: bool = True) -> dict:
    """Save user's preferred work location. Replaces any previous location.

    Call this when user mentions where they want to work (e.g., "I'm based in London", "Looking for remote work").

    Args:
        location: The location (e.g., "London", "Remote", "Los Angeles")
        remote_ok: Whether remote work is acceptable
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"success": False, "message": "User not logged in"}

    print(f"[Tool] Saving location '{location}' (remote_ok={remote_ok}) for user {user_id}", file=sys.stderr)

    result = save_profile_item(
        user_id=user_id,
        item_type="location",
        value=location,
        metadata={"remote_ok": remote_ok},
        confirmed=True
    )

    if result.get("success"):
        remote_note = " (remote also OK)" if remote_ok else ""
        return {
            "success": True,
            "message": f"Set your preferred location to: {location}{remote_note}",
            "location": location,
            "remote_ok": remote_ok
        }
    return result


@agent.tool
def save_experience_level(ctx: RunContext[StateDeps[AppState]], years: int) -> dict:
    """Save user's years of experience.

    Args:
        years: Number of years of professional experience
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"success": False, "message": "User not logged in"}

    print(f"[Tool] Saving experience years: {years} for user {user_id}", file=sys.stderr)

    result = save_profile_item(
        user_id=user_id,
        item_type="experience_years",
        value=str(years),
        confirmed=True
    )

    if result.get("success"):
        return {
            "success": True,
            "message": f"Noted you have {years} years of experience",
            "years": years
        }
    return result


@agent.tool
def check_profile_completeness(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """Check how complete the user's profile is.

    Returns profile completeness percentage and what's missing.
    Use this to guide users through completing their profile.
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"complete": False, "percent": 0, "message": "User not logged in"}

    print(f"[Tool] Checking profile completeness for user {user_id}", file=sys.stderr)

    result = get_profile_completeness_db(user_id)
    return result


@agent.tool
def get_user_skills_and_preferences(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """Get all of user's saved skills, role, and location preferences.

    Use this to see what the user has already told us about themselves.
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"found": False, "message": "User not logged in"}

    print(f"[Tool] Getting profile items for user {user_id}", file=sys.stderr)

    result = get_profile_items(user_id)
    return result


@agent.tool
def show_user_profile_graph(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """Render user's profile as a visual graph.

    Frontend will render this as an interactive 3D graph showing:
    - User at center
    - Skills as purple nodes
    - Target role as blue node
    - Location as green node

    Call this when user asks to see their profile or skills.
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"render": False, "message": "User not logged in"}

    print(f"[Tool] Rendering profile graph for user {user_id}", file=sys.stderr)

    # Get profile data
    profile = get_profile_items(user_id)
    completeness = get_profile_completeness_db(user_id)

    if not profile.get("found"):
        return {"render": False, "message": "No profile data yet"}

    items = profile.get("items", {})

    # Build graph data for frontend
    nodes = [{"id": "user", "name": "You", "type": "user", "color": "#FFD700"}]
    links = []

    # Add skills
    for skill in items.get("skill", []):
        skill_id = f"skill_{skill['value']}"
        nodes.append({
            "id": skill_id,
            "name": skill['value'],
            "type": "skill",
            "color": "#A855F7",
            "metadata": skill.get("metadata", {})
        })
        links.append({"source": "user", "target": skill_id})

    # Add role
    for role in items.get("role", []):
        role_id = f"role_{role['value']}"
        nodes.append({
            "id": role_id,
            "name": role['value'],
            "type": "role",
            "color": "#3B82F6"
        })
        links.append({"source": "user", "target": role_id})

    # Add location
    for loc in items.get("location", []):
        loc_id = f"location_{loc['value']}"
        nodes.append({
            "id": loc_id,
            "name": loc['value'],
            "type": "location",
            "color": "#22C55E",
            "metadata": loc.get("metadata", {})
        })
        links.append({"source": "user", "target": loc_id})

    return {
        "render": True,
        "type": "profile_graph",
        "completeness": completeness,
        "graph": {
            "nodes": nodes,
            "links": links
        }
    }


@agent.tool
def assess_job_fit(ctx: RunContext[StateDeps[AppState]], job_id: str) -> dict:
    """Assess how well the user's skills match a specific job's requirements.

    Returns a match score, matched skills, missing skills, and recommendations.
    Use this when user asks "Am I a good fit?" or clicks "Assess My Fit" on a job.

    Args:
        job_id: The ID of the job to assess against
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {"success": False, "message": "User not logged in"}

    print(f"[Tool] Assessing job fit: job={job_id}, user={user_id}", file=sys.stderr)

    # Get job details
    job = get_job_by_id(job_id)
    if not job:
        return {"success": False, "message": f"Job {job_id} not found"}

    # Get user's skills
    profile = get_profile_items(user_id)
    if not profile.get("found"):
        return {
            "success": False,
            "message": "No profile data. Tell me about your skills first!",
            "job_title": job.title,
            "job_company": job.company
        }

    user_skills = [s["value"].lower() for s in profile.get("items", {}).get("skill", [])]
    job_skills = [s.lower() for s in (job.skills or [])]

    if not user_skills:
        return {
            "success": False,
            "message": "You haven't added any skills yet. What skills do you have?",
            "job_title": job.title,
            "job_company": job.company,
            "job_requires": job.skills
        }

    if not job_skills:
        return {
            "success": True,
            "message": "This job doesn't list specific skills - you might be a good fit!",
            "job_title": job.title,
            "job_company": job.company,
            "match_score": 75,
            "recommendation": "apply"
        }

    # Calculate match - fuzzy matching for similar skills
    matched = []
    missing = []
    bonus = []

    for job_skill in job_skills:
        found = False
        for user_skill in user_skills:
            # Exact match or substring match
            if job_skill == user_skill or job_skill in user_skill or user_skill in job_skill:
                matched.append(job_skill)
                found = True
                break
        if not found:
            missing.append(job_skill)

    # Find bonus skills (user has but job doesn't require)
    for user_skill in user_skills:
        is_bonus = True
        for job_skill in job_skills:
            if job_skill == user_skill or job_skill in user_skill or user_skill in job_skill:
                is_bonus = False
                break
        if is_bonus:
            bonus.append(user_skill)

    # Calculate match score
    if len(job_skills) > 0:
        match_score = int((len(matched) / len(job_skills)) * 100)
    else:
        match_score = 75

    # Generate recommendation
    if match_score >= 80:
        recommendation = "strong_match"
        recommendation_text = "You're a strong match! Apply with confidence."
    elif match_score >= 50:
        recommendation = "good_match"
        recommendation_text = "Good fit! Consider highlighting your matching skills."
    elif match_score >= 25:
        recommendation = "partial_match"
        recommendation_text = "Partial match. You could upskill or emphasize transferable skills."
    else:
        recommendation = "stretch"
        recommendation_text = "This would be a stretch role. Consider gaining more relevant skills first."

    return {
        "success": True,
        "type": "job_assessment",
        "job_id": job_id,
        "job_title": job.title,
        "job_company": job.company,
        "job_location": job.location,
        "match_score": match_score,
        "matched_skills": matched,
        "missing_skills": missing,
        "bonus_skills": bonus,
        "recommendation": recommendation,
        "recommendation_text": recommendation_text,
        "total_required": len(job_skills),
        "total_matched": len(matched)
    }


@agent.tool
def check_character_completion(ctx: RunContext[StateDeps[AppState]]) -> dict:
    """Check completion status for each profile character (Repo, Trinity, Velo, Reach).

    Use this at the START of conversations to determine which character to work on next.
    Returns status for each character and suggests the next one to complete.
    """
    user_id = get_effective_user_id(ctx.deps.state.user)
    if not user_id:
        return {
            "success": False,
            "message": "User not logged in. Please sign in to build your profile!"
        }

    print(f"[Tool] Checking character completion for user={user_id}", file=sys.stderr)

    profile = get_profile_items(user_id)
    items = profile.get("items", {})

    # Calculate completion for each character
    characters = {
        "repo": {
            "name": "Repo",
            "title": "Your Foundation",
            "color": "cyan",
            "complete": bool(items.get("location")) and bool(items.get("role")),
            "has_location": bool(items.get("location")),
            "has_role": bool(items.get("role")),
            "location": items.get("location", [{}])[0].get("value") if items.get("location") else None,
            "role": items.get("role", [{}])[0].get("value") if items.get("role") else None,
        },
        "trinity": {
            "name": "Trinity",
            "title": "Your Identity",
            "color": "purple",
            "complete": len(items.get("skill", [])) >= 2,
            "skills_count": len(items.get("skill", [])),
            "skills": [s.get("value") for s in items.get("skill", [])],
            "has_career_goal": bool(items.get("career_goal")),
        },
        "velo": {
            "name": "Velo",
            "title": "Your Velocity",
            "color": "pink",
            "complete": bool(items.get("experience_years")),
            "has_experience": bool(items.get("experience_years")),
            "experience_years": items.get("experience_years", [{}])[0].get("value") if items.get("experience_years") else None,
            "has_history": len(items.get("career_history", [])) > 0,
        },
        "reach": {
            "name": "Reach",
            "title": "Your Network",
            "color": "gold",
            "complete": True,  # Always complete - optional expansion
            "info": "Optional character for expanding your reach",
        },
    }

    # Determine overall status
    completed_count = sum(1 for c in characters.values() if c.get("complete"))
    all_complete = completed_count == 4

    # Find next incomplete character
    next_character = None
    next_message = None
    for key in ["repo", "trinity", "velo"]:
        if not characters[key]["complete"]:
            next_character = characters[key]["name"]
            if key == "repo":
                if not characters[key]["has_location"]:
                    next_message = "Let's start with Repo - where are you based?"
                else:
                    next_message = "Almost done with Repo - what role are you looking for?"
            elif key == "trinity":
                if characters[key]["skills_count"] < 2:
                    needed = 2 - characters[key]["skills_count"]
                    next_message = f"Time for Trinity - tell me {needed} more skill{'s' if needed > 1 else ''} you have"
                else:
                    next_message = "Trinity needs a career goal - what do you want to achieve?"
            elif key == "velo":
                next_message = "Let's unlock Velo - how many years of experience do you have?"
            break

    return {
        "success": True,
        "characters": characters,
        "completed_count": completed_count,
        "total_characters": 4,
        "all_complete": all_complete,
        "next_character": next_character,
        "next_message": next_message,
        "celebration_message": "All characters unlocked! Let's find your perfect role! 🏆" if all_complete else None,
    }


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
                # Check for Name:, Email:, or ID: patterns (VoiceInput uses these)
                messages = body.get("messages", [])
                for msg in messages:
                    role = msg.get("role", "")
                    content = msg.get("content", "")

                    if role == "system" and ("Name:" in content or "ID:" in content or "Email:" in content):
                        extracted = extract_user_from_instructions(content)
                        if extracted.get("user_id") or extracted.get("name"):
                            _cached_user_context = extracted
                            print(f"[Middleware] CLM cached user: {extracted.get('name')} (ID: {extracted.get('user_id')})", file=sys.stderr)
                            break

                # Reconstruct request with body
                async def receive():
                    return {"type": "http.request", "body": body_bytes}

                request = Request(request.scope, receive)
        except Exception as e:
            print(f"[Middleware] Error extracting user: {e}", file=sys.stderr)

    return await call_next(request)


# Startup event - ensure tables exist
@main_app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup."""
    print("[Startup] Ensuring profile_items table exists...", file=sys.stderr)
    ensure_profile_items_table()
    print("[Startup] Ready!", file=sys.stderr)


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


async def run_agent_for_clm(user_message: str, system_prompt: str = None) -> str:
    """Run the Pydantic AI agent and return text response."""
    try:
        # Extract user context from system prompt if provided
        if system_prompt:
            extract_user_from_instructions(system_prompt)

        print(f"[CLM] Starting agent run for: {user_message[:50]}", file=sys.stderr)
        print(f"[CLM] Cached user context: {_cached_user_context}", file=sys.stderr)

        # Build state with cached user if available
        state = AppState()
        if _cached_user_context.get("name") or _cached_user_context.get("user_id"):
            state.user = UserProfile(
                id=_cached_user_context.get("user_id"),
                name=_cached_user_context.get("name"),
                firstName=_cached_user_context.get("name"),
                email=_cached_user_context.get("email")
            )
            print(f"[CLM] State user set: {state.user.name}", file=sys.stderr)

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
    # Debug: Log what Hume sends
    print(f"[CLM DEBUG] Full auth header: {authorization}", file=sys.stderr)

    # TEMPORARILY DISABLED for debugging - re-enable after testing
    # expected_secret = os.getenv("CLM_AUTH_SECRET")
    # if expected_secret:
    #     if not authorization or not authorization.startswith("Bearer "):
    #         raise HTTPException(status_code=401, detail="Missing authorization")
    #     token = authorization.replace("Bearer ", "")
    #     if token != expected_secret:
    #         raise HTTPException(status_code=401, detail="Invalid authorization")

    # Extract system prompt (contains user context from Hume)
    system_prompt = None
    for msg in request.messages:
        if msg.role == "system":
            system_prompt = msg.content
            print(f"[CLM] Found system prompt: {system_prompt[:100]}...", file=sys.stderr)
            break

    # Get user message (last non-system message)
    user_message = ""
    for msg in reversed(request.messages):
        if msg.role == "user":
            user_message = msg.content
            break
    print(f"[CLM] Query: {user_message[:80]}", file=sys.stderr)

    # Run agent with system prompt for user context
    response_text = await run_agent_for_clm(user_message, system_prompt)
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
