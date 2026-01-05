from __future__ import annotations
from typing import List, Optional
import re
from rapidfuzz import fuzz
import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
SKILLS_DB_PATH = DATA_DIR / "skills_database.json"

# Try to load spaCy if available for better NER/lemmatization
try:
    import spacy
    _nlp: Optional["spacy.Language"] = None
    try:
        _nlp = spacy.load("en_core_web_sm")
    except Exception:
        _nlp = None
except Exception:
    _nlp = None


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def load_skills_db() -> List[str]:
    with open(SKILLS_DB_PATH, "r", encoding="utf-8") as f:
        skills = json.load(f)
    return [normalize(s) for s in skills]

_SKILLS_DB = set(load_skills_db())


def lemmatize(text: str) -> str:
    if _nlp is None:
        return text
    doc = _nlp(text)
    return " ".join([t.lemma_ for t in doc])


def extract_skills(resume_text: str) -> List[str]:
    text = normalize(resume_text)
    text = lemmatize(text)

    found: set[str] = set()

    # direct exact token match
    tokens = set(re.split(r"[^a-z0-9+.#]+", text))
    
    print(f"\n=== RESUME SKILL EXTRACTION DEBUG ===")
    print(f"Raw text length: {len(resume_text)} chars")
    print(f"Normalized text sample: {text[:200]}...")
    print(f"Total tokens extracted: {len(tokens)}")
    
    for skill in _SKILLS_DB:
        # skills with spaces handle separately
        if " " in skill:
            if skill in text:
                found.add(skill)
                print(f"  ✓ Exact match (multi-word): {skill}")
        else:
            if skill in tokens:
                found.add(skill)
                print(f"  ✓ Exact match (single): {skill}")

    # fuzzy match for near misses - LOWERED THRESHOLD for better matching
    fuzzy_matches = 0
    for skill in _SKILLS_DB:
        if skill in found:
            continue
        score = fuzz.partial_ratio(skill, text)
        # Lowered from 90 to 75 for better coverage
        if score >= 75:
            found.add(skill)
            fuzzy_matches += 1
            if fuzzy_matches <= 10:  # Show first 10 fuzzy matches
                print(f"  ✓ Fuzzy match ({score}%): {skill}")

    # title-case and dedupe for UI
    result = sorted({s.replace("node.js", "Node.js").replace("three.js", "Three.js").replace("vue.js", "Vue.js").title() for s in found})
    
    # DEBUG: Print extracted skills
    print(f"Total skills found: {len(result)}")
    print(f"Skills: {result}")
    print(f"====================================\n")
    
    return result


def guess_current_role(resume_text: str) -> Optional[str]:
    text = resume_text.lower()
    
    # More comprehensive role detection
    role_patterns = {
        "Frontend Developer": ["frontend", "react", "vue", "angular", "html", "css", "typescript", "jsx"],
        "Backend Developer": ["backend", "fastapi", "django", "node.js", "express", "java", "spring", "microservice"],
        "Full Stack Developer": ["full stack", "mern", "mean", "full-stack"],
        "Data Scientist": ["data scientist", "data science", "machine learning", "ml", "nlp", "pandas", "numpy", "scikit"],
        "ML Engineer": ["ml engineer", "machine learning engineer", "mlops", "tensorflow", "pytorch"],
        "DevOps Engineer": ["devops", "kubernetes", "docker", "ci/cd", "jenkins", "terraform"],
        "Cloud Engineer": ["cloud engineer", "aws", "azure", "gcp", "cloud architect"],
        "Database Administrator": ["database", "dba", "sql", "mongodb", "postgresql"],
        "Solutions Architect": ["architect", "solution architect", "system design"],
        "QA Engineer": ["qa engineer", "qa", "testing", "selenium", "test automation"],
    }
    
    # Score each role based on keyword matches
    role_scores = {}
    for role, keywords in role_patterns.items():
        score = sum(1 for kw in keywords if kw in text)
        if score > 0:
            role_scores[role] = score
    
    # Return highest scoring role
    if role_scores:
        best_role = max(role_scores, key=role_scores.get)
        print(f"Detected role: {best_role} (score: {role_scores[best_role]})")
        return best_role
    
    print("No role detected")
    return None


def extract_experience_years(resume_text: str) -> Optional[int]:
    """Extract years of experience from resume text"""
    text = resume_text.lower()
    
    # Try multiple patterns for experience extraction
    patterns = [
        r"(\d+)\s+years?(?:\s+of)?\s+experience",  # "5 years experience"
        r"(?:with|over|about|around|approximately)\s+(\d+)\s+years?",  # "with 5 years"
        r"(\d+)\s+year\+",  # "5 year+"
        r"total\s+(\d+)\s+years?",  # "total 5 years"
    ]
    
    for pattern in patterns:
        m = re.search(pattern, text)
        if m:
            try:
                years = int(m.group(1))
                if 0 < years <= 70:  # Sanity check
                    print(f"Extracted experience: {years} years (pattern: {pattern})")
                    return years
            except ValueError:
                continue
    
    print("No experience pattern found")
    return None
