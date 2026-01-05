import google.generativeai as genai

# Configure API with the NEW key
api_key = "AIzaSyBxgHkZjWjWvnaaQa5L1i-W_8PnjOqcnF8"
genai.configure(api_key=api_key)

# Try the recommended models
print("Testing Gemini models...")

try:
    # Test gemini-2.5-flash (latest fast model)
    print("\n1. Testing: gemini-2.5-flash")
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content("Say hello in one short sentence")
    print(f"   ✓ SUCCESS! Response: {response.text}")
except Exception as e:
    print(f"   ✗ Failed: {e}")

try:
    # Test gemini-pro-latest
    print("\n2. Testing: gemini-pro-latest")
    model = genai.GenerativeModel('gemini-pro-latest')
    response = model.generate_content("Say hello in one short sentence")
    print(f"   ✓ SUCCESS! Response: {response.text}")
except Exception as e:
    print(f"   ✗ Failed: {e}")
