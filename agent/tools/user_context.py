"""
User Context Tools - Neon DB + Zep Memory Integration

Provides tools for:
- User profile (skills, experience, preferences) from Neon
- Job interests tracking from Neon
- Conversation memory from Zep
"""

import os
import sys
from typing import Optional, List
import psycopg2
from psycopg2.extras import RealDictCursor

# Zep Cloud client
try:
    from zep_cloud.client import Zep
    ZEP_AVAILABLE = True
except ImportError:
    ZEP_AVAILABLE = False
    print("[UserContext] Zep not available", file=sys.stderr)


def get_db_connection():
    """Get database connection from environment."""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        return None
    return psycopg2.connect(db_url)


def get_zep_client() -> Optional["Zep"]:
    """Get Zep client if available."""
    if not ZEP_AVAILABLE:
        return None
    api_key = os.getenv("ZEP_API_KEY")
    if not api_key:
        return None
    return Zep(api_key=api_key)


# =====
# Neon DB Tools
# =====

def get_user_profile(user_id: str) -> dict:
    """Get user profile from Neon database."""
    try:
        conn = get_db_connection()
        if not conn:
            return {"found": False, "error": "Database not configured"}

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, email, name, skills, experience_years,
                       preferred_categories, preferred_locations, bio
                FROM user_profiles
                WHERE id = %s
            """, (user_id,))
            row = cur.fetchone()

        conn.close()

        if row:
            return {
                "found": True,
                "profile": dict(row)
            }
        return {"found": False, "message": "Profile not found"}
    except Exception as e:
        print(f"[UserContext] DB error: {e}", file=sys.stderr)
        return {"found": False, "error": str(e)}


def save_user_profile(user_id: str, email: str = None, name: str = None,
                     skills: List[str] = None, experience_years: int = None,
                     preferred_categories: List[str] = None,
                     preferred_locations: List[str] = None, bio: str = None) -> dict:
    """Create or update user profile in Neon database."""
    try:
        conn = get_db_connection()
        if not conn:
            return {"success": False, "error": "Database not configured"}

        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO user_profiles (id, email, name, skills, experience_years,
                                          preferred_categories, preferred_locations, bio, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (id) DO UPDATE SET
                    email = COALESCE(EXCLUDED.email, user_profiles.email),
                    name = COALESCE(EXCLUDED.name, user_profiles.name),
                    skills = COALESCE(EXCLUDED.skills, user_profiles.skills),
                    experience_years = COALESCE(EXCLUDED.experience_years, user_profiles.experience_years),
                    preferred_categories = COALESCE(EXCLUDED.preferred_categories, user_profiles.preferred_categories),
                    preferred_locations = COALESCE(EXCLUDED.preferred_locations, user_profiles.preferred_locations),
                    bio = COALESCE(EXCLUDED.bio, user_profiles.bio),
                    updated_at = NOW()
            """, (user_id, email, name, skills, experience_years,
                  preferred_categories, preferred_locations, bio))

        conn.commit()
        conn.close()

        return {"success": True, "message": "Profile saved"}
    except Exception as e:
        print(f"[UserContext] DB error saving profile: {e}", file=sys.stderr)
        return {"success": False, "error": str(e)}


def get_user_job_interests(user_id: str, limit: int = 10) -> dict:
    """Get jobs the user has shown interest in."""
    try:
        conn = get_db_connection()
        if not conn:
            return {"found": False, "error": "Database not configured"}

        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT ji.job_id, ji.interest_type, ji.created_at,
                       j.title, j.company, j.location, j.category
                FROM user_job_interests ji
                JOIN jobs j ON j.id = ji.job_id
                WHERE ji.user_id = %s
                ORDER BY ji.created_at DESC
                LIMIT %s
            """, (user_id, limit))
            rows = cur.fetchall()

        conn.close()

        return {
            "found": True,
            "interests": [dict(row) for row in rows],
            "count": len(rows)
        }
    except Exception as e:
        print(f"[UserContext] DB error: {e}", file=sys.stderr)
        return {"found": False, "error": str(e)}


def save_job_interest(user_id: str, job_id: str, interest_type: str = "viewed") -> dict:
    """Save user's interest in a job."""
    try:
        conn = get_db_connection()
        if not conn:
            return {"success": False, "error": "Database not configured"}

        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO user_job_interests (user_id, job_id, interest_type)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id, job_id) DO UPDATE SET
                    interest_type = EXCLUDED.interest_type,
                    created_at = NOW()
            """, (user_id, job_id, interest_type))

        conn.commit()
        conn.close()

        return {"success": True, "message": f"Saved {interest_type} interest"}
    except Exception as e:
        print(f"[UserContext] DB error saving interest: {e}", file=sys.stderr)
        return {"success": False, "error": str(e)}


# =====
# Zep Memory Tools
# =====

def get_conversation_memory(user_id: str, limit: int = 5) -> dict:
    """Get recent conversation history from Zep."""
    try:
        client = get_zep_client()
        if not client:
            return {"found": False, "error": "Zep not configured"}

        # Get memory for user
        memory = client.memory.get(session_id=f"esports_{user_id}")

        if memory and memory.messages:
            messages = []
            for msg in memory.messages[-limit:]:
                messages.append({
                    "role": msg.role,
                    "content": msg.content[:200],  # Truncate for context
                    "timestamp": str(msg.created_at) if hasattr(msg, 'created_at') else None
                })

            return {
                "found": True,
                "messages": messages,
                "summary": memory.summary.content if memory.summary else None
            }

        return {"found": False, "message": "No conversation history"}
    except Exception as e:
        print(f"[UserContext] Zep error: {e}", file=sys.stderr)
        return {"found": False, "error": str(e)}


def save_conversation_to_zep(user_id: str, role: str, content: str) -> dict:
    """Save a message to Zep conversation memory."""
    try:
        client = get_zep_client()
        if not client:
            return {"success": False, "error": "Zep not configured"}

        from zep_cloud.types import Message

        client.memory.add(
            session_id=f"esports_{user_id}",
            messages=[Message(role=role, content=content)]
        )

        return {"success": True}
    except Exception as e:
        print(f"[UserContext] Zep error saving: {e}", file=sys.stderr)
        return {"success": False, "error": str(e)}


def search_user_memories(user_id: str, query: str, limit: int = 3) -> dict:
    """Search user's conversation history in Zep."""
    try:
        client = get_zep_client()
        if not client:
            return {"found": False, "error": "Zep not configured"}

        results = client.memory.search(
            session_id=f"esports_{user_id}",
            text=query,
            limit=limit
        )

        if results:
            return {
                "found": True,
                "results": [{"content": r.message.content[:200], "score": r.score} for r in results]
            }

        return {"found": False, "message": "No relevant memories found"}
    except Exception as e:
        print(f"[UserContext] Zep search error: {e}", file=sys.stderr)
        return {"found": False, "error": str(e)}


# =====
# Combined Context
# =====

def get_full_user_context(user_id: str) -> dict:
    """Get complete user context: profile + interests + memory."""
    context = {
        "user_id": user_id,
        "profile": None,
        "job_interests": [],
        "conversation_summary": None,
        "recent_messages": []
    }

    # Get profile
    profile_result = get_user_profile(user_id)
    if profile_result.get("found"):
        context["profile"] = profile_result["profile"]

    # Get job interests
    interests_result = get_user_job_interests(user_id, limit=5)
    if interests_result.get("found"):
        context["job_interests"] = interests_result["interests"]

    # Get conversation memory
    memory_result = get_conversation_memory(user_id, limit=3)
    if memory_result.get("found"):
        context["conversation_summary"] = memory_result.get("summary")
        context["recent_messages"] = memory_result.get("messages", [])

    return context
