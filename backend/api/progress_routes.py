from fastapi import APIRouter, HTTPException, Depends
from backend.models.schemas import CourseProgressRequest, CourseProgressResponse
from backend.utils.db import get_db
from backend.api.auth_routes import get_current_user
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/progress/mark-complete", response_model=CourseProgressResponse)
async def mark_course_complete(
    request: CourseProgressRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Mark a course as completed and update progress."""
    try:
        user_id = current_user["_id"]
        print(f"\n🔵 MARK COMPLETE - User: {user_id}")
        print(f"📝 Course: {request.course_title}, Phase: {request.phase}, Phase Total: {request.phase_total}")
        
        # Get or create user progress document
        progress = db.course_progress.find_one({"user_id": user_id})
        
        if not progress:
            progress = {
                "user_id": user_id,
                "completed_courses": [],
                "phase_progress": {
                    "foundation": {"completed": [], "total": 0, "progress": 0},
                    "intermediate": {"completed": [], "total": 0, "progress": 0},
                    "advanced": {"completed": [], "total": 0, "progress": 0}
                },
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            db.course_progress.insert_one(progress)
        
        # Add course to completed list if not already there
        course_id = f"{request.phase}_{request.course_title}"
        
        if course_id not in progress.get("completed_courses", []):
            db.course_progress.update_one(
                {"user_id": user_id},
                {
                    "$push": {"completed_courses": course_id},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
        
        # Get user's roadmap to calculate progress
        user_roadmap = db.roadmaps.find_one({"user_id": user_id})
        
        # Calculate progress for each phase
        # Get existing phase_progress to preserve previously known totals
        existing_phase_progress = progress.get("phase_progress", {})
        
        phase_progress = {}
        for phase in ["foundation", "intermediate", "advanced"]:
            completed = [c for c in progress.get("completed_courses", []) if c.startswith(phase)]
            completed_count = len(completed)
            
            # Try to get total from multiple sources (in order of preference)
            total_courses = 0
            
            # 1. Try roadmap first
            if user_roadmap and "phases" in user_roadmap:
                phase_data = next((p for p in user_roadmap["phases"] if p.get("name", "").lower() == phase), None)
                if phase_data:
                    total_courses = len(phase_data.get("courses", []))
            
            # 2. If this is the current phase being marked, use provided phase_total
            if total_courses == 0 and phase == request.phase and request.phase_total:
                total_courses = request.phase_total
            
            # 3. Try to reuse previously saved total from existing progress
            if total_courses == 0 and phase in existing_phase_progress:
                existing_total = existing_phase_progress[phase].get("total", 0)
                if existing_total > 0:
                    total_courses = existing_total
            
            # 4. If still no total, use completed count (prevents division by zero)
            if total_courses == 0:
                total_courses = max(completed_count, 1)
            
            progress_percent = (completed_count / total_courses * 100) if total_courses > 0 else 0
            
            phase_progress[phase] = {
                "completed": completed,
                "total": total_courses,
                "progress": round(progress_percent, 1)
            }
        
        # Update phase progress
        db.course_progress.update_one(
            {"user_id": user_id},
            {"$set": {"phase_progress": phase_progress}}
        )
        
        # Fetch updated progress
        updated_progress = db.course_progress.find_one({"user_id": user_id})
        
        print(f"✅ Progress Updated!")
        print(f"📊 Completed Courses: {updated_progress.get('completed_courses', [])}")
        print(f"📈 Phase Progress: {updated_progress.get('phase_progress', {})}")
        
        return {
            "success": True,
            "message": "Course marked as complete!",
            "completed_courses": updated_progress.get("completed_courses", []),
            "phase_progress": updated_progress.get("phase_progress", {}),
            "total_progress": calculate_overall_progress(updated_progress.get("phase_progress", {}))
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/progress/status", response_model=CourseProgressResponse)
async def get_progress_status(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Get user's course completion progress."""
    try:
        user_id = current_user["_id"]
        print(f"\n🟢 GET PROGRESS STATUS - User: {user_id}")
        
        progress = db.course_progress.find_one({"user_id": user_id})
        
        if not progress:
            print("⚠️ No progress document found - returning empty progress")
            return {
                "success": True,
                "message": "No progress yet",
                "completed_courses": [],
                "phase_progress": {
                    "foundation": {"completed": [], "total": 0, "progress": 0},
                    "intermediate": {"completed": [], "total": 0, "progress": 0},
                    "advanced": {"completed": [], "total": 0, "progress": 0}
                },
                "total_progress": 0
            }
        
        print(f"✅ Found progress document")
        print(f"📊 Completed Courses: {progress.get('completed_courses', [])}")
        print(f"📈 Phase Progress: {progress.get('phase_progress', {})}")
        
        return {
            "success": True,
            "message": "Progress retrieved",
            "completed_courses": progress.get("completed_courses", []),
            "phase_progress": progress.get("phase_progress", {}),
            "total_progress": calculate_overall_progress(progress.get("phase_progress", {}))
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/progress/uncomplete")
async def unmark_course_complete(
    request: CourseProgressRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Remove a course from completed list."""
    try:
        user_id = current_user["_id"]
        course_id = f"{request.phase}_{request.course_title}"
        
        # Remove from completed courses
        db.course_progress.update_one(
            {"user_id": user_id},
            {
                "$pull": {"completed_courses": course_id},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        # Recalculate phase progress
        progress = db.course_progress.find_one({"user_id": user_id})
        if progress:
            user_roadmap = db.roadmaps.find_one({"user_id": user_id})
            
            # Get existing phase_progress to preserve previously known totals
            existing_phase_progress = progress.get("phase_progress", {})
            
            # Calculate progress for each phase
            phase_progress = {}
            for phase in ["foundation", "intermediate", "advanced"]:
                completed = [c for c in progress.get("completed_courses", []) if c.startswith(phase)]
                completed_count = len(completed)
                
                # Try to get total from multiple sources
                total_courses = 0
                
                # 1. Try roadmap first
                if user_roadmap and "phases" in user_roadmap:
                    phase_data = next((p for p in user_roadmap["phases"] if p.get("name", "").lower() == phase), None)
                    if phase_data:
                        total_courses = len(phase_data.get("courses", []))
                
                # 2. If this is the current phase, use provided phase_total
                if total_courses == 0 and phase == request.phase and request.phase_total:
                    total_courses = request.phase_total
                
                # 3. Reuse previously saved total
                if total_courses == 0 and phase in existing_phase_progress:
                    existing_total = existing_phase_progress[phase].get("total", 0)
                    if existing_total > 0:
                        total_courses = existing_total
                
                # 4. Use completed count as fallback
                if total_courses == 0:
                    total_courses = max(completed_count, 1)
                
                progress_percent = (completed_count / total_courses * 100) if total_courses > 0 else 0
                
                phase_progress[phase] = {
                    "completed": completed,
                    "total": total_courses,
                    "progress": round(progress_percent, 1)
                }
            
            # Update phase progress
            db.course_progress.update_one(
                {"user_id": user_id},
                {"$set": {"phase_progress": phase_progress}}
            )
        
        return {"success": True, "message": "Course unmarked"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def calculate_overall_progress(phase_progress: dict) -> float:
    """Calculate overall progress across all phases."""
    if not phase_progress:
        return 0.0
    
    total_progress = sum(p.get("progress", 0) for p in phase_progress.values())
    return round(total_progress / 3, 1)  # Average of 3 phases
