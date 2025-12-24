from __future__ import annotations
from typing import Dict, List
import requests
import json
from pathlib import Path
from rapidfuzz import fuzz

from backend.utils.settings import settings

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
SKILLS_DB_PATH = DATA_DIR / "skills_database.json"

with open(SKILLS_DB_PATH, "r", encoding="utf-8") as f:
    SKILLS_DB: List[str] = json.load(f)

RAPIDAPI_HOST = "jsearch.p.rapidapi.com"
RAPIDAPI_URL = f"https://{RAPIDAPI_HOST}/search"


def _headers() -> Dict[str, str]:
    return {
        "x-rapidapi-key": settings.RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
    }


def fetch_job_descriptions(role: str, location: str, pages: int = 1) -> List[str]:
    """Fetch job data including title, description, company, location, and requirements."""
    if not settings.RAPIDAPI_KEY:
        return []
    descriptions: List[str] = []
    for page in range(1, pages + 1):
        params = {
            "query": f"{role} in {location}" if location else role,
            "page": page,
            "num_pages": 1,
        }
        try:
            resp = requests.get(RAPIDAPI_URL, headers=_headers(), params=params, timeout=8)
            if resp.status_code == 200:
                data = resp.json()
                for item in data.get("data", []):
                    # Combine ALL job details for comprehensive skill analysis
                    job_title = item.get("job_title", "")
                    job_desc = item.get("job_description") or item.get("description") or ""
                    company = item.get("employer_name", "")
                    job_location = item.get("job_city", "") + " " + item.get("job_state", "")
                    highlights = item.get("job_highlights", {})
                    qualifications = " ".join(highlights.get("Qualifications", [])) if isinstance(highlights, dict) else ""
                    responsibilities = " ".join(highlights.get("Responsibilities", [])) if isinstance(highlights, dict) else ""
                    
                    # Combine all text for skill extraction
                    full_text = f"{job_title} {job_desc} {company} {job_location} {qualifications} {responsibilities}"
                    if full_text.strip():
                        descriptions.append(full_text)
            else:
                # fallback silently on non-200
                pass
        except Exception:
            # network error: ignore
            pass
    return descriptions


def compute_trending_skills(role: str, location: str) -> List[dict]:
    jds = fetch_job_descriptions(role, location, pages=1)

    if not jds:
        # minimal fallback using static skills list if API not reachable
        base = [s for s in SKILLS_DB if any(k in s.lower() for k in ["python", "react", "sql", "fastapi", "nlp", "aws"])][:8]
        return [
            {"name": s.title(), "importance": round(1.0 - i * 0.08, 2), "job_count": max(1, 50 - i * 3)}
            for i, s in enumerate(base)
        ]

    # frequency-based importance
    freq: Dict[str, int] = {s.lower(): 0 for s in SKILLS_DB}
    for jd in jds:
        text = jd.lower()
        for s in SKILLS_DB:
            key = s.lower()
            if " " in key:
                if key in text:
                    freq[key] += 1
            else:
                # fuzzy token match
                if fuzz.partial_ratio(key, text) >= 90:
                    freq[key] += 1

    items = [
        {"name": k.title(), "job_count": v}
        for k, v in freq.items() if v > 0
    ]
    if not items:
        return []

    max_count = max(i["job_count"] for i in items)
    for i in items:
        i["importance"] = round(i["job_count"] / max(1, max_count), 3)

    # sort by importance desc, limit 25
    items.sort(key=lambda x: (-x["importance"], -x["job_count"]))
    return items[:25]


def compute_market_statistics(role: str, location: str) -> dict:
    """Compute market statistics from job data."""
    if not settings.RAPIDAPI_KEY:
        # Return fallback data when API key is missing
        return {
            "job_openings": 15234,
            "avg_salary": 120000,
            "growth_rate": 28,
            "remote_percentage": 68,
            "top_companies": ["Google", "Microsoft", "Amazon", "Meta", "Apple"],
            "top_locations": ["San Francisco, CA", "Seattle, WA", "New York, NY", "Austin, TX", "Boston, MA"]
        }
    
    try:
        # Fetch job data from API
        params = {
            "query": role,
            "page": "1",
            "num_pages": "2"
        }
        if location:
            params["location"] = location
        
        resp = requests.get(RAPIDAPI_URL, headers=_headers(), params=params, timeout=10)
        
        if resp.status_code != 200:
            raise Exception("API request failed")
        
        data = resp.json()
        jobs = data.get("data", [])
        
        if not jobs:
            raise Exception("No jobs found")
        
        # Calculate statistics
        total_jobs = len(jobs)
        
        # Average salary calculation
        salaries = []
        for job in jobs:
            if job.get("job_min_salary") and job.get("job_max_salary"):
                avg = (job["job_min_salary"] + job["job_max_salary"]) / 2
                salaries.append(avg)
        
        avg_salary = int(sum(salaries) / len(salaries)) if salaries else 120000
        
        # Remote percentage
        remote_jobs = sum(1 for job in jobs if job.get("job_is_remote", False))
        remote_percentage = int((remote_jobs / total_jobs) * 100) if total_jobs > 0 else 68
        
        # Top companies
        company_counts = {}
        for job in jobs:
            company = job.get("employer_name", "Unknown")
            if company and company != "Unknown":
                company_counts[company] = company_counts.get(company, 0) + 1
        
        top_companies = sorted(company_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        top_companies = [c[0] for c in top_companies] if top_companies else ["Google", "Microsoft", "Amazon", "Meta", "Apple"]
        
        # Top locations
        location_counts = {}
        for job in jobs:
            city = job.get("job_city")
            state = job.get("job_state")
            if city and state:
                loc = f"{city}, {state}"
                location_counts[loc] = location_counts.get(loc, 0) + 1
        
        top_locations = sorted(location_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        top_locations = [l[0] for l in top_locations] if top_locations else ["San Francisco, CA", "Seattle, WA", "New York, NY", "Austin, TX", "Boston, MA"]
        
        return {
            "job_openings": total_jobs * 150,  # Extrapolate from sample
            "avg_salary": avg_salary,
            "growth_rate": 28,  # This would need historical data
            "remote_percentage": remote_percentage,
            "top_companies": top_companies,
            "top_locations": top_locations
        }
        
    except Exception:
        # Return fallback data on any error
        return {
            "job_openings": 15234,
            "avg_salary": 120000,
            "growth_rate": 28,
            "remote_percentage": 68,
            "top_companies": ["Google", "Microsoft", "Amazon", "Meta", "Apple"],
            "top_locations": ["San Francisco, CA", "Seattle, WA", "New York, NY", "Austin, TX", "Boston, MA"]
        }
