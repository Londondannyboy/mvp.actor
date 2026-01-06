"""Company lookup tool for the esports jobs agent."""

from typing import Optional, List
from pydantic import BaseModel

# Major esports companies data
ESPORTS_COMPANIES = {
    "team liquid": {
        "name": "Team Liquid",
        "description": "One of the world's leading esports organizations with teams across multiple games including League of Legends, Dota 2, CS2, and Valorant.",
        "headquarters": "Netherlands / Los Angeles, USA",
        "founded": "2000",
        "games": ["League of Legends", "Dota 2", "CS2", "Valorant", "Rocket League", "Super Smash Bros"],
        "notable_achievements": ["Multiple TI wins in Dota 2", "LCS Championships", "CS Major wins"],
        "careers_url": "https://www.teamliquid.com/careers",
        "culture": "Known for player development and long-term partnerships with sponsors like Honda, SAP, and Monster Energy."
    },
    "logitech": {
        "name": "Logitech",
        "description": "Swiss technology company and major esports peripheral sponsor. Logitech G is their gaming brand providing gear for professional players.",
        "headquarters": "Lausanne, Switzerland",
        "founded": "1981",
        "games": ["Sponsors across all major esports titles"],
        "notable_achievements": ["Official peripherals partner of major esports leagues", "Sponsors of top teams globally"],
        "careers_url": "https://www.logitech.com/en-us/careers.html",
        "culture": "Innovation-focused with strong esports marketing division. Committed to making Logitech G the gear of choice for pros."
    },
    "octagon": {
        "name": "Octagon",
        "description": "Global sports and entertainment marketing agency with a dedicated esports division handling partnerships and activations.",
        "headquarters": "Stamford, Connecticut, USA",
        "founded": "1983",
        "games": ["Agency for multiple esports titles and brands"],
        "notable_achievements": ["Major brand activations in esports", "APAC esports expansion"],
        "careers_url": "https://www.octagon.com/careers",
        "culture": "Agency environment focused on sports and entertainment marketing with growing esports focus."
    },
    "garena": {
        "name": "Garena",
        "description": "Southeast Asian digital entertainment platform and game publisher. Operates Free Fire and Arena of Valor esports leagues.",
        "headquarters": "Singapore",
        "founded": "2009",
        "games": ["Free Fire", "Arena of Valor (Lien Quan Mobile)", "League of Legends (SEA)"],
        "notable_achievements": ["Free Fire World Series", "Arena of Valor World Cup", "Largest mobile esports in SEA"],
        "careers_url": "https://career.sea.com/teams/garena",
        "culture": "Fast-paced gaming company focused on mobile esports and Southeast Asian markets."
    },
    "riot games": {
        "name": "Riot Games",
        "description": "Developer of League of Legends and Valorant. Operates major global esports leagues including LCS, LEC, LCK, and VCT.",
        "headquarters": "Los Angeles, California, USA",
        "founded": "2006",
        "games": ["League of Legends", "Valorant", "Teamfight Tactics", "Legends of Runeterra"],
        "notable_achievements": ["World's largest esports viewership", "Worlds Championship", "VCT Champions"],
        "careers_url": "https://www.riotgames.com/en/work-with-us",
        "culture": "Player-focused company culture with strong emphasis on competitive integrity and esports production quality."
    },
    "fnatic": {
        "name": "Fnatic",
        "description": "Premier esports organization based in London with successful teams in League of Legends, Valorant, and other titles.",
        "headquarters": "London, United Kingdom",
        "founded": "2004",
        "games": ["League of Legends", "Valorant", "CS2", "Dota 2"],
        "notable_achievements": ["League of Legends World Champions 2011", "Multiple Major wins", "LEC Championships"],
        "careers_url": "https://fnatic.com/careers",
        "culture": "European esports pioneer with strong brand identity and performance-driven culture."
    },
    "cloud9": {
        "name": "Cloud9",
        "description": "Major North American esports organization competing in League of Legends, Valorant, CS2, and more.",
        "headquarters": "Santa Monica, California, USA",
        "founded": "2013",
        "games": ["League of Legends", "Valorant", "CS2", "Overwatch"],
        "notable_achievements": ["Only NA team to reach Worlds semifinals", "CS Major Champions", "Multiple LCS titles"],
        "careers_url": "https://www.cloud9.gg/pages/careers",
        "culture": "Content-focused organization known for developing talent and strong community engagement."
    },
    "100 thieves": {
        "name": "100 Thieves",
        "description": "Gaming and lifestyle brand founded by Nadeshot. Combines esports with streetwear fashion and content creation.",
        "headquarters": "Los Angeles, California, USA",
        "founded": "2017",
        "games": ["League of Legends", "Valorant", "Call of Duty"],
        "notable_achievements": ["LCS Championship", "CDL Championship", "VCT Americas finalists"],
        "careers_url": "https://100thieves.com/pages/careers",
        "culture": "Lifestyle brand culture blending esports, apparel, and entertainment content."
    },
    "g2 esports": {
        "name": "G2 Esports",
        "description": "European esports powerhouse with championship teams across multiple titles.",
        "headquarters": "Berlin, Germany",
        "founded": "2014",
        "games": ["League of Legends", "Valorant", "CS2", "Rocket League", "Rainbow Six Siege"],
        "notable_achievements": ["Multiple LEC Championships", "MSI Winners", "Worlds Finalists"],
        "careers_url": "https://g2esports.com/careers",
        "culture": "Known for bold social media presence and competitive excellence. Fan-first approach."
    },
    "grand canyon university": {
        "name": "Grand Canyon University Esports",
        "description": "Collegiate esports program at Grand Canyon University offering varsity-level competition.",
        "headquarters": "Phoenix, Arizona, USA",
        "founded": "2018",
        "games": ["Overwatch", "League of Legends", "Rocket League", "Valorant", "Super Smash Bros"],
        "notable_achievements": ["Growing collegiate esports program", "State-of-the-art esports arena"],
        "careers_url": "https://gcu.wd1.myworkdayjobs.com/GCUC",
        "culture": "Collegiate environment combining education with competitive gaming opportunities."
    }
}


class CompanyProfile(BaseModel):
    """Company profile information."""
    name: str
    description: str
    headquarters: str
    founded: str
    games: List[str]
    notable_achievements: List[str]
    careers_url: str
    culture: str


def lookup_company(company_name: str) -> Optional[CompanyProfile]:
    """
    Look up information about an esports company.

    Args:
        company_name: Name of the company to look up

    Returns:
        Company profile if found, None otherwise
    """
    company_lower = company_name.lower()

    # Direct match
    if company_lower in ESPORTS_COMPANIES:
        data = ESPORTS_COMPANIES[company_lower]
        return CompanyProfile(**data)

    # Partial match
    for key, data in ESPORTS_COMPANIES.items():
        if company_lower in key or company_lower in data["name"].lower():
            return CompanyProfile(**data)

    return None


def get_all_companies() -> List[str]:
    """Get a list of all known esports companies."""
    return [data["name"] for data in ESPORTS_COMPANIES.values()]


def search_companies_by_game(game: str) -> List[CompanyProfile]:
    """
    Search for companies involved with a specific game.

    Args:
        game: Game title to search for

    Returns:
        List of companies involved with that game
    """
    game_lower = game.lower()
    results = []

    for data in ESPORTS_COMPANIES.values():
        for company_game in data["games"]:
            if game_lower in company_game.lower():
                results.append(CompanyProfile(**data))
                break

    return results
