"""Job search tool for the esports jobs agent."""

from typing import Optional, List
from pydantic import BaseModel

# Esports job data - mirrored from lib/jobs-data.ts
ESPORTS_JOBS = [
    {
        "id": "logitech-esports-partnership-marketing-manager",
        "title": "Esports & Partnership Marketing Manager",
        "company": "Logitech",
        "location": "London, UK / Barcelona / Paris",
        "country": "United Kingdom",
        "type": "Full-time",
        "salary": "Competitive",
        "description": "Looking for an Esports & Partnership Manager to develop and execute esports strategy. Help make Logitech G the gear of choice for professional gamers.",
        "skills": ["Esports Marketing", "Partnership Development", "Project Management", "Campaign Execution", "Event Planning"],
        "category": "marketing",
        "externalUrl": "https://logitech.wd5.myworkdayjobs.com/Logitech/job/London-United-Kingdom/Esports---Partnership-Marketing-Manager_143205"
    },
    {
        "id": "octagon-account-director-esports-apac",
        "title": "Account Director (eSports, APAC)",
        "company": "Octagon",
        "location": "Singapore",
        "country": "Singapore",
        "type": "Full-time",
        "salary": "Competitive",
        "description": "Primary representative and liaison for all APAC clients. Shape Octagon's presence in the APAC eSports market.",
        "skills": ["Client Servicing", "Strategic Thinking", "Project Management", "eSports Knowledge", "Event Management"],
        "category": "management",
        "externalUrl": "https://sg.linkedin.com/jobs/view/account-director-esports-apac-at-octagon-4346081296"
    },
    {
        "id": "team-liquid-esports-video-producer",
        "title": "Esports Video Producer",
        "company": "Team Liquid",
        "location": "Jakarta, Indonesia",
        "country": "Indonesia",
        "type": "Full-time",
        "salary": "Competitive",
        "description": "Conceptualize, plan, and oversee production of engaging video content for Team Liquid Indonesia.",
        "skills": ["Video Production", "Project Management", "Team Management", "Content Creation", "Creative Vision"],
        "category": "production",
        "externalUrl": "https://id.linkedin.com/jobs/view/esports-video-producer-at-team-liquid-4345840543"
    },
    {
        "id": "garena-esports-marketing-collaborator",
        "title": "Esports Marketing Collaborator (Video Editing)",
        "company": "Garena",
        "location": "Hanoi, Vietnam",
        "country": "Vietnam",
        "type": "Intern",
        "salary": "Competitive",
        "description": "Work on live streaming and editing highlight videos during professional tournaments for Arena of Valor.",
        "skills": ["Video Editing", "Esports Marketing", "Social Media", "Creative Content", "Event Planning"],
        "category": "marketing",
        "externalUrl": "https://vn.linkedin.com/jobs/view/hn-li%C3%AAn-qu%C3%A2n-mobile-c%E1%BB%99ng-t%C3%A1c-vi%C3%AAn-esports-marketing-video-editing-at-garena-4345848474"
    },
    {
        "id": "idaho-falls-esports-assistant-coach-1",
        "title": "Esports Assistant Coach",
        "company": "Idaho Falls School District 91",
        "location": "Idaho Falls, Idaho, USA",
        "country": "United States",
        "type": "Full-time",
        "salary": "Per stipend schedule",
        "description": "Support the Head Coach in developing an inclusive, competitive esports program for students.",
        "skills": ["Coaching", "Team Coordination", "Esports Culture", "Mentoring", "Player Development"],
        "category": "coaching",
        "externalUrl": "https://www.linkedin.com/jobs/view/esports-assistant-coach-at-idaho-falls-school-district-91-4346541128"
    },
    {
        "id": "camden-county-assistant-esports-coach",
        "title": "Assistant Esports Coach",
        "company": "Camden County College",
        "location": "Camden, New Jersey, USA",
        "country": "United States",
        "type": "Part-time",
        "salary": "$15.49/hour",
        "description": "Help develop/grow the Esports program and provide support to student-athletes.",
        "skills": ["Coaching", "Valorant", "League of Legends", "Rocket League", "Streaming"],
        "category": "coaching",
        "externalUrl": "https://www.linkedin.com/jobs/view/assistant-esports-coach-temporary-part-time-at-camden-county-college-4329502021"
    },
    {
        "id": "walled-lake-esports-assistant-coach",
        "title": "Esports Assistant Coach",
        "company": "Walled Lake Consolidated Schools",
        "location": "Walled Lake, Michigan, USA",
        "country": "United States",
        "type": "Full-time",
        "salary": "Per district schedule",
        "description": "Support the head coach in training and developing the esports team.",
        "skills": ["Coaching", "Team Management", "Strategy Development", "Game Analysis", "Player Development"],
        "category": "coaching",
        "externalUrl": "https://www.linkedin.com/jobs/view/esports-assistant-coach-at-walled-lake-consolidated-schools-4346171397"
    },
    {
        "id": "ntc-esports-assistant",
        "title": "Esports Assistant (Work-Study)",
        "company": "Northcentral Technical College",
        "location": "Wausau, Wisconsin, USA",
        "country": "United States",
        "type": "Part-time",
        "salary": "$14.00/hour",
        "description": "Monitor Esports arena, assist with events and programming, create social media content.",
        "skills": ["Customer Service", "Social Media", "Event Assistance", "Gaming Knowledge", "Arena Management"],
        "category": "operations",
        "externalUrl": "https://ntc.wd1.myworkdayjobs.com/NTCStudent/job/Wausau-Main-Campus/Work-Study-Student---Esports-Assistant_JR787"
    },
    {
        "id": "gcu-gameday-dj-esports",
        "title": "Gameday DJ - Esports",
        "company": "Grand Canyon University",
        "location": "Phoenix, Arizona, USA",
        "country": "United States",
        "type": "Part-time",
        "salary": "Minimum Wage",
        "description": "Provide live music and atmosphere for weekly esports competitions and special events.",
        "skills": ["DJ Experience", "Music Selection", "Event Coordination", "Esports Knowledge", "Live Production"],
        "category": "production",
        "externalUrl": "https://gcu.wd1.myworkdayjobs.com/GCUC/job/AZ-Phoenix/Gameday-DJ---Esports--FWS---NFWS-_R000064517"
    },
    {
        "id": "gcu-esports-videographer",
        "title": "Esports Videographer",
        "company": "Grand Canyon University",
        "location": "Phoenix, Arizona, USA",
        "country": "United States",
        "type": "Part-time",
        "salary": "Minimum Wage",
        "description": "Capture, edit, and deliver high-quality video content to showcase competitive teams.",
        "skills": ["Video Production", "Adobe Premiere Pro", "Live Event Production", "Content Creation", "Editing"],
        "category": "content",
        "externalUrl": "https://gcu.wd1.myworkdayjobs.com/GCUI/job/AZ-Phoenix/Esports-Videographer--FWS-NFWS-_R000064454"
    },
    {
        "id": "carroll-county-assistant-esports-coach",
        "title": "Assistant ESports Coach",
        "company": "Carroll County Schools",
        "location": "Carrollton, Kentucky, USA",
        "country": "United States",
        "type": "Part-time",
        "salary": "$1,200/year",
        "description": "Support the head coach in managing the ESports team at Carroll County High School.",
        "skills": ["Coaching", "Team Management", "Strategy Development", "ESports Knowledge"],
        "category": "coaching",
        "externalUrl": "https://www.linkedin.com/jobs/view/assistant-esports-coach-at-carroll-county-schools-4345772917"
    }
]


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


def search_jobs(
    query: Optional[str] = None,
    category: Optional[str] = None,
    country: Optional[str] = None,
    job_type: Optional[str] = None,
    limit: int = 5
) -> List[JobSearchResult]:
    """
    Search for esports jobs based on various criteria.

    Args:
        query: Free text search query (searches title, company, description, skills)
        category: Job category filter (coaching, marketing, production, management, content, operations)
        country: Country filter
        job_type: Job type filter (Full-time, Part-time, Contract, Intern)
        limit: Maximum number of results to return

    Returns:
        List of matching jobs
    """
    results = ESPORTS_JOBS.copy()

    # Filter by category
    if category:
        category_lower = category.lower()
        results = [j for j in results if j["category"].lower() == category_lower]

    # Filter by country
    if country:
        country_lower = country.lower()
        results = [j for j in results if country_lower in j["country"].lower()]

    # Filter by job type
    if job_type:
        job_type_lower = job_type.lower()
        results = [j for j in results if job_type_lower in j["type"].lower()]

    # Free text search
    if query:
        query_lower = query.lower()
        filtered = []
        for job in results:
            searchable = f"{job['title']} {job['company']} {job['description']} {' '.join(job['skills'])}".lower()
            if query_lower in searchable:
                filtered.append(job)
        results = filtered

    # Convert to JobSearchResult and limit
    return [
        JobSearchResult(
            id=job["id"],
            title=job["title"],
            company=job["company"],
            location=job["location"],
            country=job["country"],
            type=job["type"],
            salary=job["salary"],
            description=job["description"],
            skills=job["skills"],
            category=job["category"],
            url=job["externalUrl"]
        )
        for job in results[:limit]
    ]


def get_job_by_id(job_id: str) -> Optional[JobSearchResult]:
    """Get a specific job by its ID."""
    for job in ESPORTS_JOBS:
        if job["id"] == job_id:
            return JobSearchResult(
                id=job["id"],
                title=job["title"],
                company=job["company"],
                location=job["location"],
                country=job["country"],
                type=job["type"],
                salary=job["salary"],
                description=job["description"],
                skills=job["skills"],
                category=job["category"],
                url=job["externalUrl"]
            )
    return None


def get_available_categories() -> List[str]:
    """Get all available job categories."""
    return list(set(job["category"] for job in ESPORTS_JOBS))


def get_available_countries() -> List[str]:
    """Get all available countries with jobs."""
    return list(set(job["country"] for job in ESPORTS_JOBS))
