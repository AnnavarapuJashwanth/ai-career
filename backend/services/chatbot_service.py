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
            
            system_context = f"""You are CareerAI Assistant, an expert career counselor helping users navigate their career journey.

[Request ID: {request_id}] - This is a NEW question requiring a UNIQUE response.

YOUR ROLE:
- Provide personalized career guidance and course recommendations
- Answer questions about skills, roles, and learning paths
- Be conversational, friendly, and encouraging
- Give specific, actionable advice based on the question asked

CRITICAL RULES:
- THIS IS A NEW QUESTION - DO NOT repeat previous responses
- ALWAYS provide unique, relevant answers to EACH question
- Read the question carefully and answer EXACTLY what is being asked
- DO NOT give generic or repetitive responses
- Be concise but informative (3-5 sentences)
- If asked about courses, recommend 2-3 DIFFERENT courses each time
- If asked about skills, list 4-6 key skills with brief explanations
- If asked about career paths, describe specific progression steps
- Vary your language and examples for each response

AVAILABLE DATA:
- 47+ career roles across Software, Engineering, Healthcare, Education, Business, and Agriculture
- Comprehensive courses database with real courses from Udemy, Coursera, edX
- Skills mapping for each career role
"""
            
            # Add role-specific context if provided
            role_context = ""
            if user_role and user_role in self.roles_data:
                skills = self.roles_data.get(user_role, [])[:6]
                courses = self.courses_data.get(user_role, [])[:3]
                role_context = f"\n\nUSER'S ROLE: {user_role}\nKey Skills: {', '.join(skills)}\n"
                if courses:
                    role_context += f"Available Courses: {', '.join([c.get('title', c.get('name', '')) for c in courses])}"
            
            # Build the complete prompt with emphasis on the specific question
            prompt = f"""{system_context}{role_context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION #{request_id}: "{user_message}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Provide a specific, unique answer to this exact question. Make sure your response is directly relevant to what the user asked. Be conversational and helpful. THIS IS A NEW QUESTION - provide a fresh, unique response."""
            
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
        
        # Detect question type and provide relevant response
        if any(word in user_message_lower for word in ['course', 'learn', 'training', 'tutorial', 'study']):
            # Course recommendation question
            role_key = user_role if user_role in self.courses_data else None
            if not role_key:
                found_role = next((role for role in self.courses_data.keys() if role.lower() in user_message_lower), None)
                role_key = found_role or "Software Developer"
            
            courses = self.courses_data.get(role_key, [])[:3]
            response = f"Here are some great courses for {role_key}:\n\n"
            for i, course in enumerate(courses, 1):
                title = course.get('title') or course.get('name', 'Course')
                provider = course.get('provider', 'Top Platform')
                response += f"{i}. {title} by {provider}\n"
            
            response += f"\nThese courses will help you build essential {role_key} skills. Would you like more recommendations?"
            return {"success": True, "response": response, "user_role": role_key}
        
        elif any(word in user_message_lower for word in ['skill', 'know', 'learn', 'master', 'ability']):
            # Skills question
            role_key = user_role if user_role in self.roles_data else None
            if not role_key:
                found_role = next((role for role in self.roles_data.keys() if role.lower() in user_message_lower), None)
                role_key = found_role or "Software Developer"
            
            skills = self.roles_data.get(role_key, [])[:6]
            response = f"For {role_key}, these are the key skills you should develop:\n\n"
            for i, skill in enumerate(skills, 1):
                response += f"{i}. {skill}\n"
            
            response += f"\nFocus on building these skills through hands-on projects and courses. What specific skill would you like to learn more about?"
            return {"success": True, "response": response, "user_role": role_key}
        
        elif any(word in user_message_lower for word in ['career', 'job', 'role', 'path', 'become', 'transition']):
            # Career path question
            available_roles = list(self.courses_data.keys())[:8]
            response = "CareerAI can help you with various career paths! Here are some popular roles:\n\n"
            for i, role in enumerate(available_roles, 1):
                response += f"{i}. {role}\n"
            
            response += "\nWhich career path interests you? I can provide personalized guidance, skills needed, and course recommendations!"
            return {"success": True, "response": response}
        
        else:
            # General question
            return {
                "success": True,
                "response": "I'm CareerAI Assistant, here to help with your career development! You can ask me about:\n\n• Course recommendations for any role\n• Skills required for different careers\n• Learning roadmaps and career paths\n• How to transition between roles\n\nWhat would you like to know?",
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
