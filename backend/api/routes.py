from fastapi import APIRouter, HTTPException, Query, Depends, Header, UploadFile, File
from backend.models.schemas import (
    AnalyzeResumeRequest, AnalyzeResumeResponse,
    MarketTrendsResponse, MarketTrendsResponseItem,
    GenerateRoadmapRequest, GenerateRoadmapResponse,
    ExplainRoadmapRequest, ExplainRoadmapResponse,
    ChatbotRequest, ChatbotResponse,
    TranslationRequest, TranslationResponse,
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
import pdfplumber
import io

router = APIRouter()

@router.get("/ping")
def ping():
    return {"status": "ok"}


@router.post("/upload_resume", response_model=AnalyzeResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    authorization: str | None = Header(default=None)
):
    """Upload and analyze PDF resume - works from mobile and desktop"""
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Check file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Read PDF content
        pdf_bytes = await file.read()
        resume_text = ""
        
        # Extract text from PDF using pdfplumber
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    resume_text += text + "\n"
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Analyze the resume
        skills = extract_skills(resume_text)
        role = guess_current_role(resume_text)
        years = extract_experience_years(resume_text)
        
        resp = AnalyzeResumeResponse(
            skills=skills,
            current_role=role,
            experience_years=years,
            education=None
        )
        
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
                        "resume_text": resume_text,
                        "created_at": datetime.utcnow(),
                    })
        except Exception:
            pass
        
        return resp
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


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
    
    # Debug logging
    print(f"🔍 SKILL GAP CALCULATION DEBUG:")
    print(f"   Current skills: {current_skills}")
    print(f"   Required skills: {required_skills[:10]}...")  # Show first 10
    print(f"   All required (set): {len(all_required)} skills")
    print(f"   Skills you have: {have}")
    print(f"   Total skills: {total}")
    print(f"   Readiness: {readiness}%")
    print(f"   Skill Gap: {gap}%")

    # Ensure response data always includes role and current skills
    data.setdefault("target_role", payload.target_role)
    data.setdefault("current_skills", current_skills)

    response = GenerateRoadmapResponse(
        **data,
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


@router.get("/courses")
def get_all_courses(role: str = Query(None)):
    """Get all courses or filter by role"""
    from pathlib import Path
    import json
    
    data_dir = Path(__file__).parent.parent / "data"
    courses_path = data_dir / "courses_database.json"
    
    try:
        with open(courses_path, "r", encoding="utf-8") as f:
            courses_db = json.load(f)
        
        if role:
            return {"courses": courses_db.get(role, [])}
        
        # Return all courses from all roles
        all_courses = []
        for role_name, courses in courses_db.items():
            for course in courses:
                course_with_role = course.copy()
                course_with_role["role"] = role_name
                all_courses.append(course_with_role)
        
        return {"courses": all_courses}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading courses: {str(e)}")


@router.post("/chatbot", response_model=ChatbotResponse)
async def chatbot_query(request: ChatbotRequest, current_user: dict = Depends(get_current_user)):
    """
    AI Chatbot endpoint for CareerAI application queries.
    Uses Gemini AI to answer questions about courses, roadmaps, skills, and career guidance.
    """
    try:
        from backend.services.chatbot_service import ChatbotService
        from backend.utils.settings import settings
        
        # Initialize chatbot service
        chatbot = ChatbotService(api_key=settings.GEMINI_API_KEY)
        
        # Get response from chatbot (not async anymore)
        result = chatbot.get_response(
            user_message=request.message,
            user_role=request.user_role
        )
        
        return ChatbotResponse(**result)
        
    except Exception as e:
        print(f"Chatbot endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")


@router.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest, current_user: dict = Depends(get_current_user)):
    """
    Translation endpoint using Gemini AI.
    Translates text from one language to another.
    """
    try:
        from backend.services.translation_service import TranslationService
        from backend.utils.settings import settings
        
        # Initialize translation service
        translator = TranslationService(api_key=settings.GEMINI_API_KEY)
        
        # Translate the text
        translated_text = translator.translate(
            text=request.text,
            target_language=request.target_language,
            source_language=request.source_language
        )
        
        return TranslationResponse(
            success=True,
            translated_text=translated_text,
            source_language=request.source_language,
            target_language=request.target_language
        )
        
    except Exception as e:
        print(f"Translation endpoint error: {e}")
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")
