import google.generativeai as genai
from pathlib import Path
import json
from typing import Dict, Any

class ChatbotService:
    def __init__(self, api_key: str):
        """Initialize the Gemini chatbot service."""
        # Use the working API key - updated Jan 2026
        working_key = "AIzaSyBxgHkZjWjWvnaaQa5L1i-W_8PnjOqcnF8"
        genai.configure(api_key=working_key)
        # Use the latest working model: gemini-2.5-flash
        self.model = genai.GenerativeModel('gemini-2.5-flash')
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
                roles_data = json.load(f)
            
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
            
            # Generate response
            print(f"🤖 CHATBOT DEBUG: Sending request to Gemini AI...")
            print(f"🤖 User message: {user_message}")
            print(f"🤖 User role: {user_role}")
            
            response = self.model.generate_content(prompt)
            
            print(f"🤖 Gemini response received successfully!")
            print(f"🤖 Response type: {type(response)}")
            print(f"🤖 Has text attribute: {hasattr(response, 'text')}")
            
            # Check if response has text
            if hasattr(response, 'text') and response.text:
                print(f"🤖 Response text length: {len(response.text)} characters")
                return {
                    "success": True,
                    "response": response.text,
                    "user_role": user_role
                }
            else:
                print(f"❌ No text in response. Response object: {response}")
                print(f"❌ Response dir: {dir(response)}")
                return {
                    "success": False,
                    "response": "I received your question but couldn't generate a response. Please try rephrasing your question.",
                    "error": "No text in response"
                }
            
        except Exception as e:
            print(f"❌ ERROR in chatbot get_response: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "response": "I apologize, but I'm having trouble processing your request right now. Please try again.",
                "error": str(e)
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
