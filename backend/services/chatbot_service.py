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

            # Create context string
            context = f"""
You are CareerAI Assistant, an AI chatbot specifically designed to help users with their career development using the CareerAI platform.

IMPORTANT INSTRUCTIONS:
- You MUST ONLY answer questions related to the CareerAI application, career guidance, courses, roadmaps, skills, and job roles available in this platform.
- If asked about anything unrelated to CareerAI, career development, or the data provided, politely decline and redirect to career-related topics.
- Always be helpful, professional, and encouraging.

AVAILABLE DATA IN CAREERAI PLATFORM:

1. AVAILABLE CAREER ROLES:
{json.dumps(list(courses_data.keys()), indent=2)}

2. COURSES DATABASE (Sample):
{json.dumps({k: v[:2] for k, v in list(courses_data.items())[:3]}, indent=2)}

3. SKILLS DATABASE (Sample):
{json.dumps(list(skills_data.keys())[:20], indent=2)}

4. ROLES AND REQUIRED SKILLS (Sample):
{json.dumps({k: v for k, v in list(roles_data.items())[:3]}, indent=2)}

CAPABILITIES:
- Provide information about available courses for specific roles
- Explain what skills are needed for different career paths
- Suggest learning roadmaps based on user goals
- Answer questions about the CareerAI platform features
- Help users understand career progression paths
- Recommend courses based on skill gaps

When users ask about courses or roadmaps, provide specific recommendations from the available data.
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
            
            # Detect which role(s) the user is asking about
            mentioned_roles = []
            user_message_lower = user_message.lower()
            
            for role in self.roles_data.keys():
                if role.lower() in user_message_lower:
                    mentioned_roles.append(role)
            
            # If no role mentioned in question, use user's current role
            if not mentioned_roles and user_role:
                mentioned_roles = [user_role]
            
            # Build comprehensive context with relevant role data
            role_specific_data = ""
            if mentioned_roles:
                role_specific_data = "\n\nRELEVANT ROLE DATA FOR THIS QUESTION:\n"
                for role in mentioned_roles[:3]:  # Limit to 3 roles for context size
                    skills = self.roles_data.get(role, [])[:8]
                    courses = self.courses_data.get(role, [])[:4]
                    
                    role_specific_data += f"\n--- {role.upper()} ---\n"
                    role_specific_data += f"Required Skills: {', '.join(skills)}\n"
                    
                    if courses:
                        role_specific_data += f"Top Courses:\n"
                        for i, course in enumerate(courses, 1):
                            title = course.get('title') or course.get('name', 'Course')
                            provider = course.get('provider', 'Platform')
                            role_specific_data += f"  {i}. {title} - {provider}\n"
            
            # Get sample of all available roles
            all_roles_sample = list(self.roles_data.keys())[:15]
            
            system_context = f"""You are CareerAI Assistant, an expert career counselor with access to comprehensive career data.

[Request ID: {request_id}] - NEW QUESTION requiring UNIQUE response

YOUR CAPABILITIES:
- Answer questions about ANY career role, not just the user's current role
- Provide courses, skills, and roadmaps for any role user asks about
- Help users transition between different career paths
- Give specific, actionable career guidance

CRITICAL INSTRUCTIONS:
- Read the question CAREFULLY - identify which role(s) the user is asking about
- If user asks about "Data Scientist" courses, provide Data Scientist courses (NOT Frontend Developer courses)
- If user asks about skills for "Backend Developer", provide Backend Developer skills
- ALWAYS answer about the SPECIFIC role mentioned in the question
- If no specific role mentioned, provide general guidance or ask for clarification
- DO NOT limit responses to only the user's current role
- Provide DIFFERENT courses and skills each time for variety

AVAILABLE CAREER ROLES (Sample):
{', '.join(all_roles_sample[:15])}
...and 32 more roles in Healthcare, Education, Agriculture, Business domains.

{role_specific_data}

USER'S CURRENT ROLE: {user_role or 'Not specified'}"""
            
            # Build the complete prompt with emphasis on the specific question
            prompt = f"""{system_context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION #{request_id}: "{user_message}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Analyze this question carefully:
1. Which career role is the user asking about?
2. Are they asking about courses, skills, career path, or transition?
3. Provide a specific answer using the relevant role data above

Answer the question directly and specifically. If the question asks about a different role than the user's current role, that's completely fine - provide information about the role they're asking about."""
            
            # Generate response with optimized config for variety
            print(f"🤖 CHATBOT DEBUG: Sending request to Gemini AI...")
            print(f"🤖 User message: {user_message}")
            print(f"🤖 User role: {user_role}")
            
            generation_config = {
                "temperature": 0.9,  # High for maximum variety
                "top_p": 0.95,
                "top_k": 50,
                "max_output_tokens": 800,
                "candidate_count": 1,
            }
            
            response = self.model.generate_content(prompt, generation_config=generation_config)
            
            print(f"🤖 Gemini response received successfully!")
            print(f"🤖 Response type: {type(response)}")
            print(f"🤖 Has text attribute: {hasattr(response, 'text')}")
            
            extracted_text = self._extract_text(response)

            if extracted_text:
                print(f"🤖 Response text length: {len(extracted_text)} characters")
                return {
                    "success": True,
                    "response": extracted_text,
                    "user_role": user_role
                }

            print(f"❌ No text in response. Response object: {response}")
            print(f"❌ Response dir: {dir(response)}")
            fallback = self._build_fallback_response(user_message, user_role)
            return fallback
            
        except Exception as e:
            print(f"❌ ERROR in chatbot get_response: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            fallback = self._build_fallback_response(user_message, user_role)
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

    def _build_fallback_response(self, user_message: str, user_role: str | None) -> Dict[str, Any]:
        """Generate a dynamic fallback response based on the specific question."""
        user_message_lower = user_message.lower()
        
        # Detect which role the user is asking about (not just their current role)
        mentioned_role = None
        for role in self.courses_data.keys():
            if role.lower() in user_message_lower:
                mentioned_role = role
                break
        
        # If no role mentioned, use user's current role
        target_role = mentioned_role or user_role or "Software Developer"
        
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
