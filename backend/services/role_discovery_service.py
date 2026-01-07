import google.generativeai as genai
from typing import Dict, List, Any
import json
from pathlib import Path


class RoleDiscoveryService:
    def __init__(self, api_key: str):
        """Initialize the Role Discovery service."""
        if not api_key:
            raise ValueError("Gemini API key is required.")
        
        try:
            # Configure Gemini client once per instantiation
            genai.configure(api_key=api_key.strip())

            preferred_models = [
                "gemini-1.5-flash",
                "gemini-1.5-flash-latest",
                "gemini-pro",
            ]

            self.model = None
            last_error = None
            for model_name in preferred_models:
                try:
                    self.model = genai.GenerativeModel(model_name)
                    print(f"✅ RoleDiscoveryService using Gemini model: {model_name}")
                    break
                except Exception as model_error:
                    last_error = model_error
                    print(f"⚠️ Unable to load {model_name}: {model_error}")

            if not self.model:
                raise last_error or RuntimeError("No Gemini model available")

            self.roles_data = self._load_roles_data()
        except Exception as e:
            print(f"Error initializing RoleDiscoveryService: {e}")
            self.model = None
            self.roles_data = {}
    
    def _load_roles_data(self) -> Dict[str, Any]:
        """Load available roles and their skill requirements."""
        try:
            base_path = Path(__file__).parent.parent / "data"
            with open(base_path / "roles_skills.json", "r") as f:
                raw_data = json.load(f)

            if isinstance(raw_data, dict):
                return raw_data

            if isinstance(raw_data, list):
                normalized = {}
                for item in raw_data:
                    role_name = item.get("role")
                    if role_name:
                        normalized[role_name] = item
                return normalized

            return {}
        except Exception as e:
            print(f"Error loading roles data: {e}")
            return {}

    def _match_role_name(self, candidate: str, available_roles: List[str]) -> str | None:
        """Return the closest role name from available roles."""
        if not candidate:
            return None

        candidate_lower = candidate.lower()

        # Exact match ignoring case
        for role in available_roles:
            if candidate_lower == role.lower():
                return role

        # Partial match (substring)
        for role in available_roles:
            role_lower = role.lower()
            if candidate_lower in role_lower or role_lower in candidate_lower:
                return role

        return None
    
    def get_discovery_questions(self) -> List[Dict[str, Any]]:
        """Return the set of questions for role discovery."""
        return [
            {
                "id": 1,
                "question": "What area of technology interests you the most?",
                "options": [
                    "Building websites and web applications",
                    "Creating mobile apps",
                    "Working with data and analytics",
                    "Designing user interfaces and experiences",
                    "Managing databases and backend systems",
                    "Artificial Intelligence and Machine Learning",
                    "Cloud infrastructure and DevOps",
                    "Cybersecurity"
                ]
            },
            {
                "id": 2,
                "question": "Which programming languages or technologies are you familiar with? (Select all that apply)",
                "options": [
                    "HTML, CSS, JavaScript",
                    "Python",
                    "Java",
                    "React, Vue, or Angular",
                    "SQL and databases",
                    "Node.js",
                    "None yet, I'm just starting",
                    "Mobile development (Swift, Kotlin, React Native)"
                ],
                "multiSelect": True
            },
            {
                "id": 3,
                "question": "What type of work excites you?",
                "options": [
                    "Creating visual designs and user experiences",
                    "Writing code and building applications",
                    "Analyzing data and finding insights",
                    "Solving complex technical problems",
                    "Managing projects and teams",
                    "Testing and ensuring quality"
                ]
            },
            {
                "id": 4,
                "question": "What is your current skill level in technology?",
                "options": [
                    "Complete beginner - just exploring",
                    "Beginner - know basic concepts",
                    "Intermediate - can build simple projects",
                    "Advanced - have professional experience"
                ]
            },
            {
                "id": 5,
                "question": "Do you prefer working more on...",
                "options": [
                    "What users see (Frontend - visual elements)",
                    "Behind the scenes logic (Backend - servers, databases)",
                    "Both frontend and backend (Full-Stack)",
                    "Data analysis and visualization",
                    "Not sure yet"
                ]
            },
            {
                "id": 6,
                "question": "Which industry or domain would you like to work in?",
                "options": [
                    "Technology/Software companies",
                    "Finance and Banking",
                    "Healthcare",
                    "E-commerce and Retail",
                    "Gaming and Entertainment",
                    "Education",
                    "Any industry - I'm flexible"
                ]
            },
            {
                "id": 7,
                "question": "What are your career goals?",
                "options": [
                    "Get my first tech job quickly",
                    "Build strong technical skills",
                    "Become a specialist in one area",
                    "Have diverse skills across technologies",
                    "Start my own tech business",
                    "Work remotely and freelance"
                ]
            },
            {
                "id": 8,
                "question": "How do you prefer to learn?",
                "options": [
                    "Hands-on projects and building things",
                    "Structured courses and tutorials",
                    "Reading documentation",
                    "Video lessons",
                    "Working with a mentor",
                    "Mix of everything"
                ]
            }
        ]
    
    def analyze_answers_and_recommend_role(self, answers: Dict[int, Any]) -> Dict[str, Any]:
        """
        Analyze user answers and recommend the best matching role.
        
        Args:
            answers: Dictionary mapping question_id to selected answer(s)
            
        Returns:
            Dictionary with recommended role, confidence level, and explanation
        """
        try:
            if not self.model:
                raise RuntimeError("Gemini model not initialized; falling back to rule-based prediction")
            questions = self.get_discovery_questions()
            
            # Get available roles - handle both dict and list
            if isinstance(self.roles_data, dict) and self.roles_data:
                available_roles = list(self.roles_data.keys())
            else:
                # Fallback to common roles if data not loaded
                available_roles = [
                    "Frontend Developer", "Backend Developer", "Full Stack Developer",
                    "Data Scientist", "ML Engineer", "DevOps Engineer", 
                    "Mobile Developer", "Data Analyst"
                ]
            
            # Build a concise prompt for FAST AI analysis
            prompt = f"""Analyze quickly and recommend ONE role from: {', '.join(available_roles)}

User's answers:
"""
            
            for q_id, answer in answers.items():
                question = next((q for q in questions if q["id"] == q_id), None)
                if question:
                    prompt += f"{q_id}. {answer}\n"
            
            prompt += """
Return ONLY valid JSON (no markdown):
{"recommended_role":"Role Name","confidence":85,"skill_level":"beginner","explanation":"Why this fits","key_strengths":["s1","s2","s3"],"next_steps":["n1","n2","n3"]}"""
            
            print("🔍 Analyzing user responses for role recommendation...")
            # Use faster generation settings
            generation_config = {
                "temperature": 0.3,  # Lower for faster, more consistent results
                "top_p": 0.8,
                "top_k": 20,
                "max_output_tokens": 500,  # Limit output for speed
            }
            response = self.model.generate_content(prompt, generation_config=generation_config)
            
            # Extract and parse JSON response
            response_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            
            result = json.loads(response_text.strip())
            
            matched_role = self._match_role_name(result.get("recommended_role"), available_roles)
            if matched_role:
                result["recommended_role"] = matched_role
            else:
                return self._fallback_role_recommendation(answers, available_roles)
            
            return {
                "success": True,
                **result
            }
            
        except Exception as e:
            print(f"Error in role analysis: {e}")
            import traceback
            traceback.print_exc()
            
            # Fallback logic based on simple rules
            return self._fallback_role_recommendation(answers)
    
    def _fallback_role_recommendation(self, answers: Dict[int, Any], available_roles: List[str] | None = None) -> Dict[str, Any]:
        """FAST fallback role recommendation using simple rules."""
        if not available_roles:
            available_roles = [
                "Frontend Developer", "Backend Developer", "Full Stack Developer",
                "Data Scientist", "ML Engineer", "DevOps Engineer", 
                "Mobile Developer", "Data Analyst"
            ]
        
        # Quick role matching based on first question
        interests = str(answers.get(1, "")).lower()
        
        # Fast mapping
        role_map = {
            "website": "Frontend Developer",
            "web": "Frontend Developer", 
            "mobile": "Mobile Developer",
            "data": "Data Analyst",
            "analytics": "Data Analyst",
            "design": "Frontend Developer",
            "database": "Backend Developer",
            "ai": "Data Scientist",
            "machine learning": "Data Scientist",
            "cloud": "DevOps Engineer",
            "security": "Backend Developer"
        }
        
        recommended_role = available_roles[0] if available_roles else "Full Stack Developer"
        for keyword, role in role_map.items():
            if keyword in interests:
                recommended_role = role
                break
        
        return {
            "success": True,
            "recommended_role": recommended_role,
            "confidence": 80,
            "skill_level": "beginner",
            "explanation": f"Based on your interests in {interests[:50]}, {recommended_role} is an excellent match! This role offers great career growth and aligns with current market demands.",
            "key_strengths": [
                "Clear interest in relevant technologies",
                "Motivated to learn and grow",
                "Good understanding of career goals"
            ],
            "next_steps": [
                f"Master the core skills for {recommended_role}",
                "Build 2-3 portfolio projects to showcase your abilities",
                "Follow your personalized learning roadmap"
            ]
        }
