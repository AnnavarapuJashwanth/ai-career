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
            # Create the prompt with context
            prompt = f"{self.context}\n\n"
            
            if user_role:
                prompt += f"User's Current/Target Role: {user_role}\n\n"
            
            prompt += f"User Question: {user_message}\n\nAssistant Response:"
            
            # Generate response with speed optimization
            print(f"🤖 CHATBOT DEBUG: Sending request to Gemini AI...")
            print(f"🤖 User message: {user_message}")
            print(f"🤖 User role: {user_role}")
            
            generation_config = {
                "temperature": 0.7,
                "top_p": 0.9,
                "top_k": 40,
                "max_output_tokens": 800,
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
        """Generate a deterministic fallback response using local data when Gemini fails."""
        if not self.courses_data:
            return {
                "success": False,
                "response": "I'm here to help with CareerAI questions, but I'm unable to fetch fresh insights right now. Please try again soon.",
            }

        role_key = user_role if user_role in self.courses_data else None
        if not role_key:
            found_role = next((role for role in self.courses_data.keys() if role.lower() in user_message.lower()), None)
            role_key = found_role or next(iter(self.courses_data.keys()))

        recommendations = self.courses_data.get(role_key, [])[:3]
        skills = self.roles_data.get(role_key, [])[:5]

        response_lines = [
            f"Let's focus on the {role_key} path. Based on CareerAI's knowledge base, here is how you can move forward:",
        ]

        if skills:
            response_lines.append("Key skills to strengthen: " + ", ".join(skills) + ".")

        if recommendations:
            response_lines.append("Recommended courses:")
            for course in recommendations:
                title = course.get('title') or course.get('name')
                provider = course.get('provider', 'Trusted Provider')
                response_lines.append(f"• {title} — {provider}")

        response_lines.append("Let me know if you'd like more resources or a different specialization.")

        return {
            "success": True,
            "response": "\n".join(response_lines),
            "user_role": role_key,
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
