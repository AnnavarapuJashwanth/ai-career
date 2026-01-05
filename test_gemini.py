import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('backend/.env')

# Get API key
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key loaded: {api_key[:20]}..." if api_key else "No API key found")

# Configure Gemini
genai.configure(api_key=api_key)

# Create model
model = genai.GenerativeModel('gemini-pro')

# Test simple query
try:
    print("\nTesting Gemini API...")
    response = model.generate_content("Say 'Hello, CareerAI!' in a friendly way.")
    print(f"\nResponse received!")
    print(f"Response text: {response.text}")
except Exception as e:
    print(f"\nError: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
