from __future__ import annotations
from typing import List, Dict
from pathlib import Path
import json
import random

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
ROLES_SKILLS_PATH = DATA_DIR / "roles_skills.json"
COURSES_DB_PATH = DATA_DIR / "courses_database.json"

with open(ROLES_SKILLS_PATH, "r", encoding="utf-8") as f:
    ROLES_SKILLS = json.load(f)

# Load courses database
try:
    with open(COURSES_DB_PATH, "r", encoding="utf-8") as f:
        COURSES_DB = json.load(f)
except FileNotFoundError:
    COURSES_DB = {}


def load_required_skills(target_role: str) -> List[str]:
    for entry in ROLES_SKILLS:
        if entry.get("role", "").lower() == target_role.lower():
            return [s.title() for s in entry.get("required_skills", [])]
    # fallback: empty
    return []


def get_courses_for_role(target_role: str, skills: List[str]) -> List[Dict]:
    """Get relevant courses from database for the target role"""
    role_courses = COURSES_DB.get(target_role, [])
    
    if not role_courses:
        # Fallback to generic courses
        return [{
            "type": "course",
            "title": f"Master {skill}",
            "provider": "Udemy",
            "duration_hours": 8,
            "url": f"https://www.udemy.com/courses/search/?q={skill.replace(' ', '+')}",
            "rating": 4.5,
            "level": "All Levels"
        } for skill in skills[:3]]
    
    # Return relevant courses (limit to 3-4 per phase)
    return random.sample(role_courses, min(len(role_courses), 4))


def generate_roadmap(current_skills: List[str], target_role: str, market_trends: List[Dict]) -> Dict:
    # Define phase helper function first
    def phase(skills: List[str], name: str, duration: str, importance: str):
        # Get real courses from database
        courses = get_courses_for_role(target_role, skills)
        
        resources = []
        # Add real courses
        for course in courses:
            resources.append({
                "type": "course",
                "title": course.get("title", ""),
                "provider": course.get("provider", "Udemy"),
                "duration_hours": course.get("duration_hours", 8),
                "url": course.get("url", ""),
                "rating": course.get("rating", 4.5),
                "level": course.get("level", "All Levels"),
                "image": course.get("image", "")
            })
        
        # Add project suggestions
        for s in skills[:2]:  # Limit projects to 2
            resources.append({
                "type": "project",
                "title": f"Build a {s} portfolio project",
                "provider": "Self-paced",
                "duration_hours": 10,
                "url": f"https://github.com/search?q={s.replace(' ', '+')}+project"
            })
        
        return {"name": name, "duration": duration, "skills": skills, "importance_level": importance, "resources": resources}
    
    req = load_required_skills(target_role)
    current = {s.lower() for s in current_skills}

    # DEBUG: Print what we're working with
    print(f"\n=== ROADMAP GENERATION DEBUG ===")
    print(f"Target Role: {target_role}")
    print(f"Current Skills: {current_skills}")
    print(f"Required Skills for {target_role}: {req}")
    
    # market_trends may be list of dicts or Pydantic-derived structures
    normalized = []
    for t in market_trends:
        if isinstance(t, dict):
            normalized.append(t)
        else:
            try:
                normalized.append(t.model_dump())
            except Exception:
                pass
    market_trends = normalized or market_trends

    trending_importance = {t.get("name", "").lower(): t.get("importance", 0.5) for t in market_trends}

    missing = [s for s in req if s.lower() not in current]
    
    print(f"Missing Skills (gap): {missing}")
    print(f"Trending Skills: {list(trending_importance.keys())[:5]}")
    print(f"=================================\n")

    # rank missing by market importance (desc)
    missing.sort(key=lambda s: trending_importance.get(s.lower(), 0.0), reverse=True)

    # split into 3 phases
    n = len(missing)
    if n == 0:
        # If no missing skills, use market trending skills to still show a roadmap
        print("⚠️ No skill gap found! Using market trending skills instead...")
        trending_skills = [t.get("name", "") for t in market_trends[:15] if t.get("name")]
        
        # If still no skills, use default skills for the role
        if not trending_skills:
            if "frontend" in target_role.lower() or "react" in target_role.lower():
                trending_skills = ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Node.js", "Tailwindcss", "Next.js", "Redux"]
            elif "backend" in target_role.lower() or "python" in target_role.lower():
                trending_skills = ["Python", "FastAPI", "SQL", "MongoDB", "Docker", "AWS", "Redis", "PostgreSQL", "REST APIs"]
            elif "data" in target_role.lower():
                trending_skills = ["Python", "Pandas", "NumPy", "Scikit-Learn", "Machine Learning", "SQL", "Tableau", "TensorFlow", "PyTorch"]
            else:
                trending_skills = ["JavaScript", "Python", "SQL", "Docker", "AWS", "Git", "REST APIs", "MongoDB", "React"]
        
        # Split trending skills into 3 phases
        chunk = max(1, len(trending_skills) // 3)
        p1 = trending_skills[:chunk]
        p2 = trending_skills[chunk:2*chunk]
        p3 = trending_skills[2*chunk:]
        
        phases = [
            phase(p1, "Foundation", "0-3 months", "High"),
            phase(p2, "Intermediate", "3-6 months", "Medium"),
            phase(p3, "Advanced", "6-9 months", "Medium"),
        ]
        return {
            "phases": phases,
            "current_skills": current_skills,  # Include current skills
            "target_role": target_role,
            "missing_skills": trending_skills,
        }

    chunk = max(1, n // 3)
    p1 = missing[:chunk]
    p2 = missing[chunk: 2*chunk]
    p3 = missing[2*chunk:]

    phases = [
        phase(p1, "Foundation", "0-3 months", "High"),
        phase(p2, "Intermediate", "3-6 months", "Medium"),
        phase(p3, "Advanced", "6-9 months", "Medium" if len(p3) else "Low")
    ]

    return {
        "phases": phases,
        "current_skills": current_skills,  # Include current skills
        "target_role": target_role,
        "missing_skills": missing,  # Include missing/gap skills
    }
