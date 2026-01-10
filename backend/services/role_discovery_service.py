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
        """Return comprehensive questions for accurate role discovery."""
        return [
            {
                "id": 1,
                "question": "What area of technology interests you the most?",
                "category": "interest",
                "weight": 3,
                "options": [
                    "Building websites and web applications",
                    "Creating mobile apps",
                    "Working with data and analytics",
                    "Designing user interfaces and experiences",
                    "Managing databases and backend systems",
                    "Artificial Intelligence and Machine Learning",
                    "Cloud infrastructure and DevOps",
                    "Cybersecurity and Network Security",
                    "Game Development",
                    "IoT and Embedded Systems"
                ]
            },
            {
                "id": 2,
                "question": "Which programming languages or technologies are you familiar with? (Select all)",
                "category": "technical_skills",
                "weight": 3,
                "options": [
                    "HTML, CSS, JavaScript",
                    "Python",
                    "Java / Kotlin",
                    "React, Vue, or Angular",
                    "SQL and databases",
                    "Node.js / Express",
                    "TypeScript",
                    "C# / .NET",
                    "Swift / Objective-C",
                    "Docker / Kubernetes",
                    "AWS / Azure / GCP",
                    "TensorFlow / PyTorch",
                    "None yet, I'm just starting"
                ],
                "multiSelect": True
            },
            {
                "id": 3,
                "question": "What type of work excites you the most?",
                "category": "work_style",
                "weight": 2,
                "options": [
                    "Creating visual designs and user experiences",
                    "Writing code and building applications",
                    "Analyzing data and finding insights",
                    "Solving complex technical problems",
                    "Managing projects and teams",
                    "Testing and ensuring quality",
                    "Automating processes and infrastructure",
                    "Research and experimentation",
                    "Teaching and mentoring others"
                ]
            },
            {
                "id": 4,
                "question": "What is your current skill level in technology?",
                "category": "experience_level",
                "weight": 2,
                "options": [
                    "Complete beginner - just exploring",
                    "Beginner - know basic concepts",
                    "Intermediate - can build simple projects",
                    "Advanced - have 1-2 years experience",
                    "Expert - have 3+ years professional experience"
                ]
            },
            {
                "id": 5,
                "question": "Which aspect of software do you prefer working on?",
                "category": "technical_focus",
                "weight": 3,
                "options": [
                    "What users see (Frontend - UI/UX)",
                    "Behind the scenes logic (Backend - APIs, databases)",
                    "Both frontend and backend (Full-Stack)",
                    "Data pipelines and analytics",
                    "Machine Learning models and AI",
                    "Infrastructure and cloud systems",
                    "Mobile applications",
                    "Desktop applications",
                    "Not sure yet"
                ]
            },
            {
                "id": 6,
                "question": "Which industry or domain interests you?",
                "category": "industry",
                "weight": 1,
                "options": [
                    "Technology/Software companies",
                    "Finance and Banking",
                    "Healthcare and Biotech",
                    "E-commerce and Retail",
                    "Gaming and Entertainment",
                    "Education and EdTech",
                    "Social Media and Communication",
                    "Startups and Innovation",
                    "Government and Public Sector",
                    "Any industry - I'm flexible"
                ]
            },
            {
                "id": 7,
                "question": "What are your career goals for the next 2-3 years?",
                "category": "career_goals",
                "weight": 2,
                "options": [
                    "Get my first tech job quickly",
                    "Build strong technical skills and expertise",
                    "Become a specialist in one area (deep knowledge)",
                    "Have diverse skills across technologies (broad knowledge)",
                    "Move into leadership or management",
                    "Start my own tech business or freelance",
                    "Work remotely for international companies",
                    "Transition from another field into tech"
                ]
            },
            {
                "id": 8,
                "question": "How do you prefer to learn new technologies?",
                "category": "learning_style",
                "weight": 1,
                "options": [
                    "Hands-on projects and building things",
                    "Structured courses and tutorials",
                    "Reading documentation and articles",
                    "Video lessons and online bootcamps",
                    "Working with a mentor or coach",
                    "Contributing to open source projects",
                    "Mix of everything"
                ]
            },
            {
                "id": 9,
                "question": "Which type of problems do you enjoy solving?",
                "category": "problem_solving",
                "weight": 2,
                "options": [
                    "Visual and design challenges",
                    "Logic and algorithmic puzzles",
                    "Data patterns and statistical analysis",
                    "System architecture and scalability",
                    "User experience and usability",
                    "Performance optimization",
                    "Security vulnerabilities",
                    "Process automation",
                    "Business and strategic problems"
                ]
            },
            {
                "id": 10,
                "question": "What is your math and statistics comfort level?",
                "category": "math_skills",
                "weight": 2,
                "options": [
                    "Not comfortable - prefer to avoid heavy math",
                    "Basic level - simple calculations are fine",
                    "Moderate level - comfortable with algebra and basic stats",
                    "Strong level - enjoy probability, statistics, and calculus",
                    "Expert level - love advanced mathematics and algorithms"
                ]
            },
            {
                "id": 11,
                "question": "Which work environment appeals to you?",
                "category": "work_environment",
                "weight": 1,
                "options": [
                    "Fast-paced startup with rapid changes",
                    "Established company with clear processes",
                    "Remote/distributed team",
                    "Collaborative office environment",
                    "Research and innovation lab",
                    "Freelance/Contract work",
                    "Any environment is fine"
                ]
            },
            {
                "id": 12,
                "question": "What motivates you the most in your career?",
                "category": "motivation",
                "weight": 1,
                "options": [
                    "High salary and financial growth",
                    "Learning and skill development",
                    "Creating impact and helping users",
                    "Innovation and cutting-edge technology",
                    "Work-life balance and flexibility",
                    "Job security and stability",
                    "Recognition and career advancement",
                    "Solving challenging problems"
                ]
            }
        ]
    
    def analyze_answers_and_recommend_role(self, answers: Dict[int, Any]) -> Dict[str, Any]:
        """
        Analyze user answers using Gemini AI and comprehensive database for accurate role recommendation.
        
        Args:
            answers: Dictionary mapping question_id to selected answer(s)
            
        Returns:
            Dictionary with recommended role, confidence level, and detailed explanation
        """
        try:
            if not self.model:
                raise RuntimeError("Gemini model not initialized; falling back to rule-based prediction")
            
            questions = self.get_discovery_questions()
            
            # Get ALL available roles from comprehensive database
            if isinstance(self.roles_data, dict) and self.roles_data:
                available_roles = list(self.roles_data.keys())
            else:
                # Extended fallback list with more roles
                available_roles = [
                    "Frontend Developer", "Backend Developer", "Full Stack Developer",
                    "Data Scientist", "ML Engineer", "DevOps Engineer", 
                    "Mobile Developer", "Data Analyst", "Cloud Architect",
                    "UI/UX Designer", "QA Engineer", "Product Manager",
                    "Cybersecurity Analyst", "Game Developer"
                ]
            
            # Build comprehensive analysis prompt with ALL roles
            prompt = f"""You are an expert career counselor analyzing a user's survey responses to recommend the BEST matching tech career role.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AVAILABLE ROLES ({len(available_roles)}):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{json.dumps(available_roles, indent=2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
USER'S SURVEY RESPONSES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
            
            # Add each question and answer with context
            for q_id, answer in answers.items():
                question_obj = next((q for q in questions if q["id"] == q_id), None)
                if question_obj:
                    weight = question_obj.get("weight", 1)
                    category = question_obj.get("category", "general")
                    prompt += f"\n[Q{q_id}] [{category.upper()}] (Weight: {weight}/3)\n"
                    prompt += f"Question: {question_obj['question']}\n"
                    prompt += f"User's Answer: {answer}\n"
            
            prompt += """
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANALYSIS INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Analyze ALL survey responses considering question weights
2. Match interests, skills, work style, and goals to roles
3. Consider technical skills, math comfort, problem-solving style
4. Recommend the SINGLE BEST role from the available roles list
5. Provide detailed reasoning and next steps

CRITICAL: Return ONLY valid JSON (no markdown, no code blocks):
{
    "recommended_role": "Exact Role Name from Available Roles",
    "confidence": 85,
    "skill_level": "beginner/intermediate/advanced",
    "explanation": "Detailed 2-3 sentence explanation why this role is the perfect match based on survey responses",
    "key_strengths": ["Strength 1 based on answers", "Strength 2", "Strength 3"],
    "match_factors": {
        "technical_alignment": 85,
        "interest_match": 90,
        "career_goals_fit": 80
    },
    "alternative_roles": ["Alternative Role 1", "Alternative Role 2"],
    "next_steps": ["Specific action 1", "Specific action 2", "Specific action 3"],
    "learning_path": "Brief description of recommended learning path",
    "time_to_job_ready": "3-6 months / 6-12 months / 12+ months"
}

Analyze deeply and provide accurate recommendation:"""
            
            print(f"🔍 Analyzing {len(answers)} survey responses with Gemini AI...")
            
            # Use optimal generation settings for accuracy
            generation_config = {
                "temperature": 0.2,  # Lower for consistent, accurate analysis
                "top_p": 0.8,
                "top_k": 20,
                "max_output_tokens": 1000,
            }
            
            response = self.model.generate_content(prompt, generation_config=generation_config)
            
            # Extract and parse JSON response
            response_text = response.text.strip()
            
            # Clean markdown code blocks if present
            if "```json" in response_text:
                start = response_text.find("```json") + 7
                end = response_text.find("```", start)
                response_text = response_text[start:end].strip()
            elif "```" in response_text:
                response_text = response_text.replace("```", "").strip()
            
            print(f"✅ AI Analysis Response received")
            
            result = json.loads(response_text.strip())
            
            # Validate and match recommended role to exact role name in database
            matched_role = self._match_role_name(result.get("recommended_role"), available_roles)
            if matched_role:
                result["recommended_role"] = matched_role
                print(f"✅ Recommended Role: {matched_role} (Confidence: {result.get('confidence')}%)")
            else:
                print(f"⚠️ Role '{result.get('recommended_role')}' not found, using fallback")
                return self._fallback_role_recommendation(answers, available_roles)
            
            # Get role-specific data if available
            if matched_role in self.roles_data:
                role_data = self.roles_data[matched_role]
                result["required_skills"] = role_data.get("required_skills", [])
                result["experience_level"] = role_data.get("experience_level", "intermediate")
                result["category"] = role_data.get("category", "technical")
            
            return {
                "success": True,
                **result
            }
            
        except Exception as e:
            print(f"❌ Error in AI role analysis: {e}")
            import traceback
            traceback.print_exc()
            
            # Use enhanced fallback logic
            return self._fallback_role_recommendation(answers)
    
    def _fallback_role_recommendation(self, answers: Dict[int, Any], available_roles: List[str] | None = None) -> Dict[str, Any]:
        """Enhanced fallback role recommendation using intelligent rule-based analysis."""
        if not available_roles:
            available_roles = [
                "Frontend Developer", "Backend Developer", "Full Stack Developer",
                "Data Scientist", "ML Engineer", "DevOps Engineer", 
                "Mobile Developer", "Data Analyst", "Cloud Architect",
                "UI/UX Designer", "QA Engineer"
            ]
        
        # Score each role based on answers
        role_scores = {}
        
        # Question 1: Technology interest (weight 3)
        interest = str(answers.get(1, "")).lower()
        interest_map = {
            "website": {"Frontend Developer": 3, "Full Stack Developer": 2, "Backend Developer": 1},
            "web": {"Frontend Developer": 3, "Full Stack Developer": 2, "Backend Developer": 1},
            "mobile": {"Mobile Developer": 3, "Full Stack Developer": 1},
            "data": {"Data Analyst": 3, "Data Scientist": 2},
            "analytics": {"Data Analyst": 3, "Data Scientist": 2},
            "design": {"UI/UX Designer": 3, "Frontend Developer": 2},
            "interface": {"UI/UX Designer": 3, "Frontend Developer": 2},
            "database": {"Backend Developer": 3, "Full Stack Developer": 2},
            "backend": {"Backend Developer": 3, "Full Stack Developer": 2},
            "ai": {"ML Engineer": 3, "Data Scientist": 2},
            "machine learning": {"ML Engineer": 3, "Data Scientist": 2},
            "cloud": {"DevOps Engineer": 3, "Cloud Architect": 2, "Backend Developer": 1},
            "devops": {"DevOps Engineer": 3, "Cloud Architect": 2},
            "security": {"Backend Developer": 2, "DevOps Engineer": 2},
            "game": {"Frontend Developer": 2, "Full Stack Developer": 1}
        }
        
        for keyword, scores in interest_map.items():
            if keyword in interest:
                for role, score in scores.items():
                    role_scores[role] = role_scores.get(role, 0) + score * 3
                break
        
        # Question 2: Technical skills (weight 3)
        skills = str(answers.get(2, "")).lower()
        if "html" in skills or "css" in skills or "javascript" in skills:
            role_scores["Frontend Developer"] = role_scores.get("Frontend Developer", 0) + 3
            role_scores["Full Stack Developer"] = role_scores.get("Full Stack Developer", 0) + 2
        if "react" in skills or "vue" in skills or "angular" in skills:
            role_scores["Frontend Developer"] = role_scores.get("Frontend Developer", 0) + 3
        if "python" in skills:
            role_scores["Backend Developer"] = role_scores.get("Backend Developer", 0) + 2
            role_scores["Data Scientist"] = role_scores.get("Data Scientist", 0) + 2
            role_scores["ML Engineer"] = role_scores.get("ML Engineer", 0) + 1
        if "node.js" in skills:
            role_scores["Backend Developer"] = role_scores.get("Backend Developer", 0) + 3
            role_scores["Full Stack Developer"] = role_scores.get("Full Stack Developer", 0) + 2
        if "sql" in skills or "database" in skills:
            role_scores["Backend Developer"] = role_scores.get("Backend Developer", 0) + 2
            role_scores["Data Analyst"] = role_scores.get("Data Analyst", 0) + 2
        if "docker" in skills or "kubernetes" in skills:
            role_scores["DevOps Engineer"] = role_scores.get("DevOps Engineer", 0) + 3
        if "aws" in skills or "azure" in skills or "gcp" in skills:
            role_scores["Cloud Architect"] = role_scores.get("Cloud Architect", 0) + 3
            role_scores["DevOps Engineer"] = role_scores.get("DevOps Engineer", 0) + 2
        if "tensorflow" in skills or "pytorch" in skills:
            role_scores["ML Engineer"] = role_scores.get("ML Engineer", 0) + 3
        
        # Question 5: Technical focus (weight 3)
        focus = str(answers.get(5, "")).lower()
        focus_map = {
            "frontend": {"Frontend Developer": 3, "UI/UX Designer": 2},
            "backend": {"Backend Developer": 3, "DevOps Engineer": 1},
            "full": {"Full Stack Developer": 3},
            "data pipelines": {"Data Analyst": 3, "Data Scientist": 2},
            "machine learning": {"ML Engineer": 3, "Data Scientist": 2},
            "infrastructure": {"DevOps Engineer": 3, "Cloud Architect": 2},
            "mobile": {"Mobile Developer": 3}
        }
        
        for keyword, scores in focus_map.items():
            if keyword in focus:
                for role, score in scores.items():
                    role_scores[role] = role_scores.get(role, 0) + score * 3
                break
        
        # Question 10: Math comfort (weight 2)
        math_level = str(answers.get(10, "")).lower()
        if "strong" in math_level or "expert" in math_level:
            role_scores["Data Scientist"] = role_scores.get("Data Scientist", 0) + 2 * 2
            role_scores["ML Engineer"] = role_scores.get("ML Engineer", 0) + 2 * 2
        elif "not comfortable" in math_level or "avoid" in math_level:
            role_scores["Frontend Developer"] = role_scores.get("Frontend Developer", 0) + 2 * 2
            role_scores["UI/UX Designer"] = role_scores.get("UI/UX Designer", 0) + 2 * 2
        
        # Find role with highest score
        if not role_scores:
            recommended_role = "Full Stack Developer"  # Default
            confidence = 70
        else:
            recommended_role = max(role_scores, key=role_scores.get)
            max_score = role_scores[recommended_role]
            confidence = min(95, 60 + (max_score * 2))  # Scale confidence
        
        # Ensure recommended role is in available roles
        if recommended_role not in available_roles and available_roles:
            recommended_role = available_roles[0]
        
        # Get alternative roles (top 2 other scored roles)
        sorted_roles = sorted(role_scores.items(), key=lambda x: x[1], reverse=True)
        alternative_roles = [r for r, s in sorted_roles[1:3] if r != recommended_role and r in available_roles]
        
        # Get required skills if available
        required_skills = []
        if recommended_role in self.roles_data:
            role_data = self.roles_data[recommended_role]
            required_skills = role_data.get("required_skills", [])[:8]
        
        return {
            "success": True,
            "recommended_role": recommended_role,
            "confidence": int(confidence),
            "skill_level": self._determine_skill_level(answers),
            "explanation": f"Based on your interests in {interest[:40] if interest else 'technology'} and your technical skills, {recommended_role} is an excellent match! This role aligns perfectly with your career goals and offers strong job market demand.",
            "key_strengths": [
                "Clear interest alignment with role requirements",
                "Relevant technical skills or strong learning motivation",
                "Career goals match well with role progression path"
            ],
            "match_factors": {
                "technical_alignment": min(95, confidence + 5),
                "interest_match": min(95, confidence),
                "career_goals_fit": min(95, confidence - 5)
            },
            "alternative_roles": alternative_roles[:2] if alternative_roles else [],
            "required_skills": required_skills,
            "next_steps": [
                f"Master the core skills for {recommended_role}: {', '.join(required_skills[:3]) if required_skills else 'fundamental technologies'}",
                "Build 2-3 portfolio projects showcasing your abilities",
                "Follow your personalized learning roadmap from CareerAI",
                "Network with professionals in the field"
            ],
            "learning_path": f"Start with fundamentals, build projects, contribute to open source, and prepare for interviews in {recommended_role}",
            "time_to_job_ready": self._estimate_time_to_ready(answers)
        }
    
    def _determine_skill_level(self, answers: Dict[int, Any]) -> str:
        """Determine skill level from question 4."""
        skill_answer = str(answers.get(4, "")).lower()
        if "complete beginner" in skill_answer or "just exploring" in skill_answer:
            return "beginner"
        elif "advanced" in skill_answer or "professional" in skill_answer or "expert" in skill_answer:
            return "advanced"
        else:
            return "intermediate"
    
    def _estimate_time_to_ready(self, answers: Dict[int, Any]) -> str:
        """Estimate time to job readiness based on current level."""
        skill_level = self._determine_skill_level(answers)
        if skill_level == "advanced":
            return "1-3 months (ready for interviews)"
        elif skill_level == "intermediate":
            return "3-6 months (build portfolio)"
        else:
            return "6-12 months (learn fundamentals)"
