"""Job search tool for the esports jobs agent - queries Neon database."""

import os
from typing import Optional, List
from pydantic import BaseModel
import httpx

DATABASE_URL = os.getenv("DATABASE_URL", "")


class JobSearchResult(BaseModel):
    """A single job search result."""
    id: str
    title: str
    company: str
    location: str
    country: str
    type: str
    salary: str
    description: str
    skills: List[str]
    category: str
    url: str


async def query_neon(sql: str, params: list = None) -> list:
    """Execute SQL query against Neon database using HTTP API."""
    if not DATABASE_URL:
        print("[DB] No DATABASE_URL configured, using fallback data")
        return []

    # Convert postgres:// URL to Neon HTTP endpoint
    # postgresql://user:pass@host/db -> https://host/sql
    try:
        from urllib.parse import urlparse
        parsed = urlparse(DATABASE_URL)
        host = parsed.hostname
        if not host:
            return []

        # Neon serverless driver HTTP endpoint
        http_url = f"https://{host}/sql"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                http_url,
                json={"query": sql, "params": params or []},
                headers={
                    "Content-Type": "application/json",
                    "Neon-Connection-String": DATABASE_URL
                },
                timeout=10.0
            )
            if response.status_code == 200:
                data = response.json()
                return data.get("rows", [])
            else:
                print(f"[DB] Query failed: {response.status_code}")
                return []
    except Exception as e:
        print(f"[DB] Error: {e}")
        return []


def search_jobs_sync(
    query: Optional[str] = None,
    category: Optional[str] = None,
    country: Optional[str] = None,
    job_type: Optional[str] = None,
    limit: int = 5
) -> List[JobSearchResult]:
    """
    Search for esports jobs - synchronous version using psycopg2.
    """
    if not DATABASE_URL:
        print("[DB] No DATABASE_URL, returning empty results")
        return []

    try:
        import psycopg2
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # Build query
        conditions = ["is_active = true"]
        params = []

        if category:
            conditions.append("LOWER(category) = LOWER(%s)")
            params.append(category)

        if country:
            conditions.append("LOWER(country) ILIKE %s")
            params.append(f"%{country}%")

        if job_type:
            conditions.append("LOWER(type) ILIKE %s")
            params.append(f"%{job_type}%")

        if query:
            conditions.append("(LOWER(title) ILIKE %s OR LOWER(company) ILIKE %s OR LOWER(description) ILIKE %s)")
            params.extend([f"%{query}%", f"%{query}%", f"%{query}%"])

        where_clause = " AND ".join(conditions)
        sql = f"""
            SELECT id, title, company, location, country, type, salary, description, skills, category, external_url
            FROM jobs
            WHERE {where_clause}
            ORDER BY posted_date DESC NULLS LAST
            LIMIT %s
        """
        params.append(limit)

        cur.execute(sql, params)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        results = []
        for row in rows:
            results.append(JobSearchResult(
                id=row[0],
                title=row[1],
                company=row[2],
                location=row[3],
                country=row[4],
                type=row[5],
                salary=row[6] or "Competitive",
                description=row[7] or "",
                skills=row[8] or [],
                category=row[9] or "",
                url=row[10] or ""
            ))

        print(f"[DB] Found {len(results)} jobs")
        return results

    except Exception as e:
        print(f"[DB] Error querying jobs: {e}")
        return []


def search_jobs(
    query: Optional[str] = None,
    category: Optional[str] = None,
    country: Optional[str] = None,
    job_type: Optional[str] = None,
    limit: int = 5
) -> List[JobSearchResult]:
    """Search for esports jobs based on various criteria."""
    return search_jobs_sync(query, category, country, job_type, limit)


def get_job_by_id(job_id: str) -> Optional[JobSearchResult]:
    """Get a specific job by its ID."""
    if not DATABASE_URL:
        return None

    try:
        import psycopg2
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        cur.execute("""
            SELECT id, title, company, location, country, type, salary, description, skills, category, external_url
            FROM jobs WHERE id = %s
        """, (job_id,))

        row = cur.fetchone()
        cur.close()
        conn.close()

        if row:
            return JobSearchResult(
                id=row[0],
                title=row[1],
                company=row[2],
                location=row[3],
                country=row[4],
                type=row[5],
                salary=row[6] or "Competitive",
                description=row[7] or "",
                skills=row[8] or [],
                category=row[9] or "",
                url=row[10] or ""
            )
        return None

    except Exception as e:
        print(f"[DB] Error getting job: {e}")
        return None


def get_available_categories() -> List[str]:
    """Get all available job categories."""
    if not DATABASE_URL:
        return ["coaching", "marketing", "production", "management", "content", "operations"]

    try:
        import psycopg2
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute("SELECT DISTINCT category FROM jobs WHERE is_active = true AND category IS NOT NULL")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [row[0] for row in rows]
    except Exception as e:
        print(f"[DB] Error getting categories: {e}")
        return ["coaching", "marketing", "production", "management", "content", "operations"]


def get_available_countries() -> List[str]:
    """Get all available countries with jobs."""
    if not DATABASE_URL:
        return ["United States", "United Kingdom", "Singapore", "Germany"]

    try:
        import psycopg2
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute("SELECT DISTINCT country FROM jobs WHERE is_active = true AND country IS NOT NULL")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [row[0] for row in rows]
    except Exception as e:
        print(f"[DB] Error getting countries: {e}")
        return ["United States", "United Kingdom", "Singapore", "Germany"]
