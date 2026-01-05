import google.generativeai as genai

# Configure API with the NEW key
api_key = "AIzaSyBxgHkZjWjWvnaaQa5L1i-W_8PnjOqcnF8"
print(f"Testing with API key: {api_key[:20]}...")

genai.configure(api_key=api_key)

# List all available models
print("\n=== Available Models ===")
try:
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"✓ {model.name} - {model.display_name}")
except Exception as e:
    print(f"Error listing models: {e}")

# Try different model names
model_names_to_try = [
    'gemini-pro',
    'gemini-1.5-pro',
    'gemini-1.5-flash',
    'models/gemini-pro',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash'
]

print("\n=== Testing Models ===")
for model_name in model_names_to_try:
    try:
        print(f"\nTrying: {model_name}")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say hello")
        print(f"  ✓ SUCCESS! Response: {response.text[:50]}...")
        break
    except Exception as e:
        print(f"  ✗ Failed: {str(e)[:100]}...")
