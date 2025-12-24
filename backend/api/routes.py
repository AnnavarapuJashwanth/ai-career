from fastapi import APIRouter, HTTPException, Query, Depends, Header
from backend.models.schemas import (
    AnalyzeResumeRequest, AnalyzeResumeResponse,
    MarketTrendsResponse, MarketTrendsResponseItem,
    GenerateRoadmapRequest, GenerateRoadmapResponse,
    ExplainRoadmapRequest, ExplainRoadmapResponse,
)
from backend.services.resume_parser import extract_skills, guess_current_role, extract_experience_years
from backend.services.market_trend_service import compute_trending_skills, compute_market_statistics
from backend.services.roadmap_generator import generate_roadmap
from backend.services.llm_service import explain_roadmap
from backend.utils.db import get_db
from backend.utils.security import decode_token
from backend.api.auth_routes import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.get("/ping")
def ping():
    return {"status": "ok"}


@router.post("/analyze_resume", response_model=AnalyzeResumeResponse)
def analyze_resume(payload: AnalyzeResumeRequest, authorization: str | None = Header(default=None)):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="resume_text is required")
    skills = extract_skills(payload.resume_text)
    role = guess_current_role(payload.resume_text)
    years = extract_experience_years(payload.resume_text)
    resp = AnalyzeResumeResponse(skills=skills, current_role=role, experience_years=years, education=None)
    # Try to persist if user provided
    try:
        if authorization and authorization.lower().startswith("bearer "):
            payload_token = authorization.split(" ", 1)[1]
            payload_decoded = decode_token(payload_token)
            if payload_decoded and payload_decoded.get("sub"):
                db = get_db()
                col = db["analyses"]
                col.create_index([("user_id", 1), ("created_at", -1)])
                col.insert_one({
                    "user_id": payload_decoded["sub"],
                    "analysis": resp.model_dump(),
                    "created_at": datetime.utcnow(),
                })
    except Exception:
        pass
    return resp


@router.get("/market_trends", response_model=MarketTrendsResponse)
def market_trends(role: str = Query(...), location: str = Query("") ):
    items = compute_trending_skills(role, location)
    stats = compute_market_statistics(role, location)
    response_data = MarketTrendsResponse(trending_skills=[MarketTrendsResponseItem(**i) for i in items])
    # Add statistics to response
    response_dict = response_data.model_dump()
    response_dict.update(stats)
    return response_dict


@router.post("/generate_roadmap", response_model=GenerateRoadmapResponse)
def generate_roadmap_endpoint(payload: GenerateRoadmapRequest):
    # Determine current_skills
    current_skills = payload.current_skills
    if (not current_skills) and payload.resume_text:
        current_skills = extract_skills(payload.resume_text)
    if not current_skills:
        current_skills = []

    # Fetch market trends to weight roadmap
    trends = compute_trending_skills(payload.target_role, payload.location or "")
    data = generate_roadmap(current_skills, payload.target_role, trends)

    # Compute readiness metrics
    total_required = sum(len(p.get("skills", [])) for p in data.get("phases", [])) + len([s for p in data.get("phases", []) for s in p.get("skills", []) if False])
    # approximate: readiness = fraction of role skills already present
    required_skills = [s for p in data.get("phases", []) for s in p.get("skills", [])]
    # If missing list is phases skills, infer required list as missing + have
    all_required = set(required_skills) | set(current_skills)
    have = len([s for s in all_required if s in current_skills])
    total = max(1, len(all_required))
    readiness = int(round((have / total) * 100))
    gap = max(0, 100 - readiness)

    response = GenerateRoadmapResponse(
        **data,
        target_role=payload.target_role,
        current_skills=current_skills,
        readiness_score=readiness,
        skill_gap_percentage=gap,
    )

    # If user authenticated, persist roadmap
    try:
        db = get_db()
        col = db["roadmaps"]
        col.create_index([("user_id", 1), ("created_at", -1)])
        # attach user if available via auth
    except Exception:
        pass
    return response
@router.post("/roadmaps/save", response_model=GenerateRoadmapResponse)
def save_roadmap(payload: GenerateRoadmapResponse, current_user=Depends(get_current_user)):
    db = get_db()
    col = db["roadmaps"]
    doc = {
        "user_id": ObjectId(current_user["_id"]),
        "roadmap": payload.model_dump(),
        "created_at": datetime.utcnow(),
    }
    col.insert_one(doc)
    return payload


@router.get("/roadmaps/latest", response_model=GenerateRoadmapResponse)
def latest_roadmap(current_user=Depends(get_current_user)):
    db = get_db()
    col = db["roadmaps"]
    rec = col.find_one({"user_id": ObjectId(current_user["_id"])}, sort=[("created_at", -1)])
    if not rec:
        raise HTTPException(status_code=404, detail="No roadmap found")
    data = rec.get("roadmap")
    return GenerateRoadmapResponse(**data)


@router.get("/analyses/latest", response_model=AnalyzeResumeResponse)
def latest_analysis(current_user=Depends(get_current_user)):
    db = get_db()
    col = db["analyses"]
    rec = col.find_one({"user_id": str(current_user["_id"])}, sort=[("created_at", -1)])
    if not rec:
        raise HTTPException(status_code=404, detail="No analysis found")
    data = rec.get("analysis")
    return AnalyzeResumeResponse(**data)


@router.post("/explain_roadmap", response_model=ExplainRoadmapResponse)
def explain_roadmap_endpoint(payload: ExplainRoadmapRequest):
    result = explain_roadmap(payload.roadmap.model_dump())
    return ExplainRoadmapResponse(**result)
