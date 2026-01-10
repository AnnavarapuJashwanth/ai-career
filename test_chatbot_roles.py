"""
Test chatbot to verify it can answer about ANY role, not just user's current role.
"""
import sys
sys.path.insert(0, 'E:/cmr')

from backend.services.chatbot_service import ChatbotService
from backend.utils.settings import settings

print("🤖 Testing Chatbot with Different Role Questions\n")
print("=" * 60)

# Initialize chatbot
chatbot = ChatbotService(api_key=settings.GEMINI_API_KEY)

# Test cases: User is Frontend Developer but asks about other roles
test_cases = [
    {
        "user_role": "Frontend Developer",
        "question": "What courses should I take for Data Scientist?",
        "expected": "Should return Data Scientist courses, NOT Frontend Developer courses"
    },
    {
        "user_role": "Frontend Developer", 
        "question": "What skills do I need for Backend Developer?",
        "expected": "Should return Backend Developer skills, NOT Frontend Developer skills"
    },
    {
        "user_role": "Frontend Developer",
        "question": "Tell me about Machine Learning Engineer",
        "expected": "Should provide Machine Learning Engineer information"
    }
]

for i, test in enumerate(test_cases, 1):
    print(f"\n📝 TEST {i}:")
    print(f"   User's Current Role: {test['user_role']}")
    print(f"   Question: {test['question']}")
    print(f"   Expected: {test['expected']}")
    print(f"\n   🔄 Asking chatbot...")
    
    try:
        result = chatbot.get_response(
            user_message=test['question'],
            user_role=test['user_role']
        )
        
        print(f"\n   ✅ Response received:")
        print(f"   {'-' * 56}")
        response_text = result.get('response', '')
        # Print first 300 characters
        print(f"   {response_text[:300]}...")
        print(f"   {'-' * 56}")
        
        # Check if response mentions the asked role, not user's role
        question_lower = test['question'].lower()
        response_lower = response_text.lower()
        
        if 'data scientist' in question_lower and 'data scientist' in response_lower:
            print(f"   ✅ PASS: Response is about Data Scientist")
        elif 'backend developer' in question_lower and 'backend' in response_lower:
            print(f"   ✅ PASS: Response is about Backend Developer")
        elif 'machine learning' in question_lower and 'machine learning' in response_lower:
            print(f"   ✅ PASS: Response is about Machine Learning")
        else:
            print(f"   ⚠️ CHECK: Review response manually")
            
    except Exception as e:
        print(f"   ❌ ERROR: {e}")
    
    print("\n" + "=" * 60)

print("\n✅ Testing complete!")
print("\nNow test in the actual application:")
print("1. Go to http://localhost:5173/dashboard")
print("2. Open the chatbot")
print("3. Ask: 'What courses for Data Scientist?'")
print("4. Verify you get Data Scientist courses, not your current role's courses")
