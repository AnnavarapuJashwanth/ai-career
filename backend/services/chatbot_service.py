import google.generativeai as genai
from pathlib import Path
import json
from typing import Dict, Any

class ChatbotService:
    def __init__(self, api_key: str):
        """Initialize the Gemini chatbot service."""
        if not api_key:
            raise ValueError("Gemini API key is required. Set GEMINI_API_KEY in backend/.env.")

        self.courses_data: Dict[str, Any] = {}
        self.skills_data: Dict[str, Any] = {}
        self.roles_data: Dict[str, Any] = {}

        sanitized_key = api_key.strip()
        genai.configure(api_key=sanitized_key)
        
        # Try multiple Gemini models for compatibility
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
                print(f"✅ ChatbotService using Gemini model: {model_name}")
                break
            except Exception as model_error:
                last_error = model_error
                print(f"⚠️ Unable to load {model_name}: {model_error}")
        
        if not self.model:
            raise last_error or RuntimeError("No Gemini model available for chatbot")
        
        self.context = self._load_application_context()
    
    def _load_application_context(self) -> str:
        """Load application context from data files."""
        try:
            base_path = Path(__file__).parent.parent / "data"
            
            # Load courses database
            with open(base_path / "courses_database.json", "r") as f:
                courses_data = json.load(f)
            
            # Load skills database
            with open(base_path / "skills_database.json", "r") as f:
                skills_data = json.load(f)
            
            # Load roles and skills mapping
            with open(base_path / "roles_skills.json", "r") as f:
                raw_roles_data = json.load(f)
            
            # Normalize roles_data to dict format
            if isinstance(raw_roles_data, list):
                roles_data = {}
                for item in raw_roles_data:
                    role_name = item.get("role")
                    if role_name:
                        roles_data[role_name] = item.get("required_skills", [])
            else:
                roles_data = raw_roles_data
            
            # Expose structured data for fallbacks
            self.courses_data = courses_data
            self.skills_data = skills_data
            self.roles_data = roles_data

            # Create optimized context string - don't overwhelm with ALL data
            all_roles_list = list(courses_data.keys())
            all_skills_list = list(skills_data) if isinstance(skills_data, list) else list(skills_data.keys())
            
            # Sample representative roles from each category
            tech_roles = [r for r in roles_data.keys() if "developer" in r.lower() or "engineer" in r.lower() or "data" in r.lower() or "ml" in r.lower() or "cloud" in r.lower()][:10]
            healthcare_roles = [r for r in roles_data.keys() if any(x in r.lower() for x in ["doctor", "nurse", "pharmacist", "psychologist", "medical"])][:5]
            education_roles = [r for r in roles_data.keys() if any(x in r.lower() for x in ["teacher", "professor", "administrator", "curriculum"])][:5]
            agriculture_roles = [r for r in roles_data.keys() if any(x in r.lower() for x in ["agriculture", "agricultural", "farm", "soil", "crop"])][:5]
            business_roles = [r for r in roles_data.keys() if any(x in r.lower() for x in ["manager", "analyst", "sales", "marketing", "product"])][:5]
            
            context = f"""
You are CareerAI Assistant, an expert AI career counselor with access to comprehensive career database.

DATABASE OVERVIEW:
- {len(all_roles_list)} Career Roles across Technology, Healthcare, Education, Agriculture, Business
- {len(all_skills_list)} Technical & Professional Skills
- Courses and Learning Paths for all roles

CRITICAL INSTRUCTIONS:
✅ Answer about ANY role user asks about (not limited to their current role)
✅ If user asks "What courses for Data Scientist?" → provide Data Scientist info
✅ If user asks "Skills for Backend Developer?" → provide Backend Developer skills
✅ You can access data for ALL {len(all_roles_list)} roles
✅ Provide specific, actionable advice from your knowledge
✅ Be helpful, professional, and encouraging

AVAILABLE ROLES (Sample):
Technology: {', '.join(tech_roles)}
Healthcare: {', '.join(healthcare_roles)}  
Education: {', '.join(education_roles)}
Agriculture: {', '.join(agriculture_roles)}
Business: {', '.join(business_roles)}
...and {len(all_roles_list) - len(tech_roles) - len(healthcare_roles) - len(education_roles) - len(agriculture_roles) - len(business_roles)} more roles

When user asks about a specific role, provide:
1. Required skills for that role
2. Top 3-4 courses recommendations  
3. Career path and next steps
4. Salary insights and job market trends
"""
            return context
            
        except Exception as e:
            print(f"Error loading context: {e}")
            return "You are CareerAI Assistant, helping users with career development and the CareerAI platform."
    
    def get_response(self, user_message: str, user_role: str = None) -> Dict[str, Any]:
        """
        Get chatbot response based on user message.
        
        Args:
            user_message: The user's question/message
            user_role: Optional - the user's current career role or target role
            
        Returns:
            Dict containing response and metadata
        """
        try:
            # Build a focused, dynamic prompt based on the question
            import time
            request_id = int(time.time() * 1000) % 10000  # Unique ID for each request
            
            # Detect which role(s) the user is asking about from ALL roles
            mentioned_roles = []
            user_message_lower = user_message.lower()
            
            # Search through ALL roles in database
            for role in self.roles_data.keys():
                if role.lower() in user_message_lower:
                    mentioned_roles.append(role)
            
            # Check for partial matches or keywords
            if not mentioned_roles:
                role_keywords = {
                    "frontend": ["Frontend Developer"],
                    "backend": ["Backend Developer"],
                    "full stack": ["Full Stack Developer"],
                    "data scien": ["Data Scientist"],
                    "machine learning": ["ML Engineer"],
                    "devops": ["DevOps Engineer"],
                    "mobile": ["Mobile Developer"],
                    "doctor": ["Medical Doctor"],
                    "nurse": ["Nurse"],
                    "teacher": ["Teacher"],
                    "farmer": ["Agricultural Farm Manager"],
                    "engineer": ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer"]
                }
                
                for keyword, roles_list in role_keywords.items():
                    if keyword in user_message_lower:
                        mentioned_roles.extend(roles_list)
                        break
            
            # Build comprehensive context with relevant role data from FULL database
            role_specific_data = ""
            if mentioned_roles:
                role_specific_data = "\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                role_specific_data += "SPECIFIC DATA FOR ROLES IN THIS QUESTION:\n"
                role_specific_data += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
                for role in mentioned_roles[:5]:  # Include up to 5 roles
                    skills = self.roles_data.get(role, [])
                    courses = self.courses_data.get(role, [])[:6]
                    
                    role_specific_data += f"\n🎯 {role.upper()}\n"
                    role_specific_data += f"   Required Skills ({len(skills)}): {', '.join(skills)}\n"
                    
            # Build OPTIMIZED context with only relevant role data
            role_specific_data = ""
            if mentioned_roles:
                role_specific_data = "\n\n📋 RELEVANT ROLE DATA:\n"
                for role in mentioned_roles[:3]:  # Limit to 3 roles max
                    skills = self.roles_data.get(role, [])[:10]  # Top 10 skills
                    courses = self.courses_data.get(role, [])[:4]  # Top 4 courses
                    
                    role_specific_data += f"\n🎯 {role}:\n"
                    if skills:
                        role_specific_data += f"   Skills: {', '.join(skills)}\n"
                    if courses:
                        role_specific_data += f"   Top Courses:\n"
                        for i, course in enumerate(courses, 1):
                            title = course.get('title') or course.get('name', 'Course')
                            provider = course.get('provider', 'Platform')
                            role_specific_data += f"      {i}. {title} ({provider})\n"
            
            # Get sample of all roles
            all_roles_sample = list(self.roles_data.keys())[:20]  # Sample only
            
            system_context = f"""You are CareerAI Assistant - Expert career counselor.

[Request #{request_id}] - Provide unique, specific response

DATABASE: {len(self.roles_data)} roles, {len(self.skills_data)} skills, courses for all roles

SAMPLE ROLES: {', '.join(all_roles_sample)}... (and more)

{role_specific_data}

INSTRUCTIONS:
✅ Answer about the SPECIFIC role in user's question
✅ Provide courses, skills, career advice for that role
✅ Use the data shown above
✅ Keep responses helpful and concise

User's Current Role: {user_role or 'Not set'}"""
            
            # Build the prompt
            prompt = f"""{system_context}

QUESTION: "{user_message}"

Provide a helpful answer about the role mentioned in the question. Be specific and use the course/skill data shown above."""
            
            # Generate response with faster config
            print(f"🤖 Chatbot: Processing '{user_message[:50]}...'")
            print(f"🤖 User role: {user_role}, Mentioned roles: {mentioned_roles}")
            
            generation_config = {
                "temperature": 0.7,
                "top_p": 0.9,
                "top_k": 40,
                "max_output_tokens": 600,  # Faster responses
            }
            
            response = self.model.generate_content(prompt, generation_config=generation_config)
            
            print(f"✅ Gemini response received!")
            
            extracted_text = self._extract_text(response)

            if extracted_text:
                print(f"✅ Response: {len(extracted_text)} chars")
                return {
                    "success": True,
                    "response": extracted_text,
                    "user_role": user_role
                }

            print(f"⚠️ No text in response, using fallback")
            fallback = self._build_fallback_response(user_message, user_role, mentioned_roles)
            return fallback
            
        except Exception as e:
            print(f"❌ Chatbot error: {type(e).__name__}: {str(e)}")
            fallback = self._build_fallback_response(user_message, user_role, mentioned_roles)
            return fallback

    def _extract_text(self, response: Any) -> str | None:
        """Safely extract response text from Gemini SDK responses."""
        if hasattr(response, 'text') and response.text:
            return response.text.strip()

        candidates = getattr(response, 'candidates', None) or []
        for candidate in candidates:
            content = getattr(candidate, 'content', None)
            parts = []
            if content is not None:
                if hasattr(content, 'parts'):
                    parts = content.parts
                elif isinstance(content, dict):
                    parts = content.get('parts', [])
            if not parts:
                parts = getattr(candidate, 'parts', []) or []

            for part in parts:
                text_value = None
                if hasattr(part, 'text'):
                    text_value = part.text
                elif isinstance(part, dict):
                    text_value = part.get('text') or part.get('formattedText')
                if text_value:
                    return text_value.strip()
        return None

    def _build_fallback_response(self, user_message: str, user_role: str | None, mentioned_roles: list = None) -> Dict[str, Any]:
        """Generate a fast, accurate fallback response using database."""
        user_message_lower = user_message.lower()
        
        # Use mentioned roles from detection, or detect here
        if not mentioned_roles:
            mentioned_roles = []
            for role in self.courses_data.keys():
                if role.lower() in user_message_lower:
                    mentioned_roles.append(role)
                    break
        
        # Target role: first mentioned role, or user's role, or default
        target_role = mentioned_roles[0] if mentioned_roles else (user_role or "Full Stack Developer")
        
        # Detect question type and provide relevant response
        if any(word in user_message_lower for word in ['course', 'learn', 'training', 'tutorial', 'study']):
            # Course recommendation question
            courses = self.courses_data.get(target_role, [])[:4]
            
            if not courses:
                return {
                    "success": True,
                    "response": f"I don't have specific course data for {target_role} right now, but I can help you with other roles. What would you like to learn about?",
                }
            
            response = f"Great choice! Here are some excellent courses for {target_role}:\n\n"
            for i, course in enumerate(courses, 1):
                title = course.get('title') or course.get('name', 'Course')
                provider = course.get('provider', 'Top Platform')
                url = course.get('url', '')
                response += f"{i}. **{title}**\n   Provider: {provider}\n"
                if url:
                    response += f"   Link: {url}\n"
                response += "\n"
            
            response += f"These courses will help you master {target_role} skills. Want more recommendations or details about any course?"
            return {"success": True, "response": response, "user_role": target_role}
        
        elif any(word in user_message_lower for word in ['skill', 'know', 'learn', 'master', 'ability', 'require']):
            # Skills question
            skills = self.roles_data.get(target_role, [])[:8]
            
            if not skills:
                return {
                    "success": True,
                    "response": f"I don't have specific skills data for {target_role} right now. Would you like to know about another role?",
                }
            
            response = f"To excel as a {target_role}, you should develop these key skills:\n\n"
            for i, skill in enumerate(skills, 1):
                response += f"{i}. **{skill}**\n"
            
            response += f"\nFocus on building these skills through hands-on projects, courses, and real-world experience. Which skill would you like to learn more about?"
            return {"success": True, "response": response, "user_role": target_role}
        
        elif any(word in user_message_lower for word in ['transition', 'switch', 'change', 'move', 'become']):
            # Career transition question
            if mentioned_role and user_role and mentioned_role != user_role:
                from_skills = set(self.roles_data.get(user_role, [])[:8])
                to_skills = set(self.roles_data.get(mentioned_role, [])[:8])
                common_skills = from_skills & to_skills
                new_skills = to_skills - from_skills
                
                response = f"Transitioning from {user_role} to {mentioned_role}?\n\n"
                if common_skills:
                    response += f"✅ Skills you already have: {', '.join(list(common_skills)[:4])}\n\n"
                if new_skills:
                    response += f"📚 Skills to learn: {', '.join(list(new_skills)[:5])}\n\n"
                
                courses = self.courses_data.get(mentioned_role, [])[:2]
                if courses:
                    response += f"Recommended courses:\n"
                    for course in courses:
                        title = course.get('title') or course.get('name', 'Course')
                        response += f"• {title}\n"
                
                return {"success": True, "response": response, "user_role": mentioned_role}
        
        elif any(word in user_message_lower for word in ['career', 'job', 'role', 'path']):
            # Career path question
            available_roles = list(self.courses_data.keys())[:10]
            response = f"I can help you explore various career paths! Here are some popular roles:\n\n"
            for i, role in enumerate(available_roles, 1):
                response += f"{i}. {role}\n"
            
            response += f"\nWhich career path interests you? I can provide:\n• Required skills\n• Course recommendations\n• Career roadmap\n• Transition guidance"
            return {"success": True, "response": response}
        
        else:
            # General question - show capabilities
            return {
                "success": True,
                "response": f"I'm CareerAI Assistant! I can help with:\n\n📚 **Course Recommendations** - For any career role\n🎯 **Skills & Requirements** - What you need to learn\n🗺️ **Career Roadmaps** - Step-by-step guidance\n🔄 **Career Transitions** - Switch between roles\n\nYour current role: {user_role or 'Not set'}\n\nWhat would you like to know? Try asking:\n• 'What courses for Data Scientist?'\n• 'Skills needed for Backend Developer'\n• 'How to transition to Machine Learning Engineer?'",
            }
    
    def get_course_recommendations(self, role: str) -> Dict[str, Any]:
        """Get course recommendations for a specific role."""
        try:
            base_path = Path(__file__).parent.parent / "data"
            with open(base_path / "courses_database.json", "r") as f:
                courses_data = json.load(f)
            
            if role in courses_data:
                return {
                    "success": True,
                    "role": role,
                    "courses": courses_data[role]
                }
            else:
                return {
                    "success": False,
                    "message": f"No courses found for role: {role}",
                    "available_roles": list(courses_data.keys())
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
