import os
from pathlib import Path
import google.generativeai as genai

# Load .env
env_file = Path(".env")
if env_file.exists():
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip("'\"")

api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
print(f"API Key found: {api_key[:8]}..." if api_key else "No API Key found")

if api_key:
    genai.configure(api_key=api_key)
    try:
        print("Available models supporting generateContent:")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(" -", m.name)
    except Exception as e:
        print("Error listing models:", e)
