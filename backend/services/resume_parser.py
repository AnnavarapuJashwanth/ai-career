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
    for skill in _SKILLS_DB:
        # skills with spaces handle separately
        if " " in skill:
            if skill in text:
                found.add(skill)
        else:
            if skill in tokens:
                found.add(skill)

    # fuzzy match for near misses
    for skill in _SKILLS_DB:
        if skill in found:
            continue
        score = fuzz.partial_ratio(skill, text)
        if score >= 90:
            found.add(skill)

    # title-case and dedupe for UI
    result = sorted({s.replace("node.js", "Node.js").replace("three.js", "Three.js").title() for s in found})
    
    # DEBUG: Print extracted skills
    print(f"\n=== RESUME SKILL EXTRACTION ===")
    print(f"Resume text length: {len(resume_text)} chars")
    print(f"Extracted {len(result)} skills: {result[:10]}")  # Show first 10
    print(f"================================\n")
    
    return result


def guess_current_role(resume_text: str) -> Optional[str]:
    text = resume_text.lower()
    if "frontend" in text or "react" in text:
        return "Frontend Developer"
    if "backend" in text or "fastapi" in text or "server" in text:
        return "Backend Developer"
    if "data science" in text or "machine learning" in text or "pandas" in text:
        return "Data Scientist"
    if "ml engineer" in text or "mlops" in text:
        return "ML Engineer"
    return None


def extract_experience_years(resume_text: str) -> Optional[int]:
    # naive: look for patterns like "X years"
    m = re.search(r"(\d+)\s+years", resume_text.lower())
    if m:
        try:
            return int(m.group(1))
        except ValueError:
            return None
    return None
