import google.generativeai as genai
from typing import Dict

class TranslationService:
    def __init__(self, api_key: str):
        """Initialize the Gemini translation service."""
        working_key = "AIzaSyBxgHkZjWjWvnaaQa5L1i-W_8PnjOqcnF8"
        genai.configure(api_key=working_key)
        # Use gemini-1.5-flash for higher free tier quota (1500 RPD vs 20 RPD)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def translate(self, text: str, target_language: str, source_language: str = "en") -> str:
        """
        Translate text from source language to target language.
        
        Args:
            text: Text to translate
            target_language: Target language code (e.g., 'es', 'fr', 'de', 'zh', 'ja', 'hi', 'ar', 'pt', 'ru')
            source_language: Source language code (default: 'en')
            
        Returns:
            Translated text
        """
        try:
            # Language mapping for better prompts
            language_names = {
                'en': 'English',
                'es': 'Spanish',
                'fr': 'French',
                'de': 'German',
                'zh': 'Chinese',
                'ja': 'Japanese',
                'hi': 'Hindi',
                'ar': 'Arabic',
                'pt': 'Portuguese',
                'ru': 'Russian'
            }
            
            source_lang_name = language_names.get(source_language, source_language)
            target_lang_name = language_names.get(target_language, target_language)
            
            # Create translation prompt
            prompt = f"""Translate the following text from {source_lang_name} to {target_lang_name}.
Only provide the translation, nothing else. Maintain the original meaning and tone.

Text to translate:
{text}

Translation:"""
            
            # Generate translation
            response = self.model.generate_content(prompt)
            
            if response and response.text:
                return response.text.strip()
            else:
                print("Warning: No translation response received")
                return text
                
        except Exception as e:
            print(f"Translation error: {e}")
            import traceback
            traceback.print_exc()
            return text
