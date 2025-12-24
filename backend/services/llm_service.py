from __future__ import annotations
from typing import List

try:
    import google.generativeai as genai
except Exception:
    genai = None

from backend.utils.settings import settings


def explain_roadmap(roadmap: dict) -> dict:
    if not genai or not settings.GEMINI_API_KEY:
        # fallback narrative if Gemini not configured
        return {
            "narrative": "This roadmap progresses from fundamentals to advanced topics based on market demand and role requirements.",
            "project_ideas": ["Build a full-stack demo app", "Implement a data pipeline", "Deploy a model with CI/CD"]
        }

    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = (
        "You are a career mentor AI. Given this structured roadmap JSON, write a short, encouraging narrative (120-180 words) that explains the phases and why they are ordered this way. Then list 3 concise micro-project ideas aligned to the roadmap, each under 12 words.\n\n"
        f"Roadmap JSON:\n{roadmap}\n"
    )

    try:
        resp = model.generate_content(prompt)
        text = resp.text.strip() if hasattr(resp, 'text') else ""
        # naive split of ideas
        lines = [l.strip('- •').strip() for l in text.splitlines() if l.strip()]
        if len(lines) <= 3:
            return {"narrative": text, "project_ideas": lines[:3]}
        # assume first paragraph then bullets
        para = []
        bullets: List[str] = []
        in_bullets = False
        for l in lines:
            if any(k in l.lower() for k in ["project", "idea", "build", "create", "develop"]) or in_bullets:
                in_bullets = True
                bullets.append(l)
            else:
                para.append(l)
        narrative = " ".join(para) or text
        ideas = bullets[:3] if bullets else lines[-3:]
        return {"narrative": narrative, "project_ideas": ideas}
    except Exception:
        return {
            "narrative": "This roadmap progresses from fundamentals to advanced topics based on market signals and prerequisites.",
            "project_ideas": ["Implement a CRUD service", "Analyze job postings for trends", "Deploy app to cloud"]
        }
