import os
import sys

# Add backend/ai to sys.path so we can import app.main
backend_ai_path = os.path.join(os.path.dirname(__file__), '..', 'backend', 'ai')
sys.path.append(backend_ai_path)

from app.main import app
