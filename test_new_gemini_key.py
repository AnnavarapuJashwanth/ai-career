import google.generativeai as genai

# Configure API with the NEW key provided by user
api_key = "AIzaSyBxgHkZjWjWvnaaQa5L1i-W_8PnjOqcnF8"
print(f"Testing NEW API key: {api_key[:20]}...")

genai.configure(api_key=api_key)

# Try to create a model and generate content
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("✓ Model created successfully!")
    response = model.generate_content("Say hello in one sentence")
    print(f"✓ Success! Response: {response.text}")
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
