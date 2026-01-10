from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AnalyzeResumeRequest(BaseModel):
    resume_text: str = Field(..., description="Raw resume text; PDF upload to be added later")

class AnalyzeResumeResponse(BaseModel):
    skills: List[str]
    current_role: Optional[str] = None
    experience_years: Optional[int] = None
    education: Optional[List[str]] = None

class MarketTrendsResponseItem(BaseModel):
    name: str
    importance: float
    job_count: int

class MarketTrendsResponse(BaseModel):
    trending_skills: List[MarketTrendsResponseItem]

class GenerateRoadmapRequest(BaseModel):
    current_skills: Optional[List[str]] = None
    resume_text: Optional[str] = None
    target_role: str
    years_of_experience: int
    location: Optional[str] = None

class ChatbotRequest(BaseModel):
    message: str = Field(..., description="User's message to the chatbot")
    user_role: Optional[str] = Field(None, description="User's current or target role")

class ChatbotResponse(BaseModel):
    success: bool
    response: str
    user_role: Optional[str] = None

class TranslationRequest(BaseModel):
    text: str = Field(..., description="Text to translate")
    target_language: str = Field(..., description="Target language code (e.g., 'es', 'fr', 'de', 'zh', 'ja', 'hi', 'ar', 'pt', 'ru')")
    source_language: str = Field(default="en", description="Source language code")

class TranslationResponse(BaseModel):
    success: bool
    translated_text: str
    source_language: str
    target_language: str

class ResourceItem(BaseModel):
    type: str  # course, project, certification
    title: str
    provider: Optional[str] = None
    duration_hours: Optional[int] = None
    url: Optional[str] = None

class RoadmapPhase(BaseModel):
    name: str  # Foundation, Intermediate, Advanced
    duration: str  # "0-3 months"
    skills: List[str]
    importance_level: str  # High, Medium, Low
    resources: List[ResourceItem]

class GenerateRoadmapResponse(BaseModel):
    phases: List[RoadmapPhase]
    target_role: Optional[str] = None
    current_skills: Optional[List[str]] = None
    readiness_score: Optional[int] = None
    skill_gap_percentage: Optional[int] = None

class ExplainRoadmapRequest(BaseModel):
    roadmap: GenerateRoadmapResponse

class ExplainRoadmapResponse(BaseModel):
    narrative: str
    project_ideas: List[str]


class RoleDiscoveryAnswersRequest(BaseModel):
    answers: Dict[int, Any] = Field(..., description="Map of question_id to answer(s)")


class RoleDiscoveryResponse(BaseModel):
    success: bool
    recommended_role: str
    confidence: int = Field(..., ge=0, le=100, description="Confidence percentage")
    skill_level: str = Field(..., description="Estimated skill level: beginner/intermediate/advanced")
    explanation: str
    key_strengths: List[str]
    next_steps: List[str]


class CourseProgressRequest(BaseModel):
    phase: str = Field(..., description="Phase name: foundation, intermediate, or advanced")
    course_title: str = Field(..., description="Course title to mark as complete")
    phase_total: Optional[int] = Field(None, description="Total number of skills in this phase (optional)")


class PhaseProgressDetail(BaseModel):
    completed: List[str] = []
    total: int = 0
    progress: float = 0.0


class CourseProgressResponse(BaseModel):
    success: bool
    message: str
    completed_courses: List[str]
    phase_progress: Dict[str, PhaseProgressDetail]
    total_progress: float
