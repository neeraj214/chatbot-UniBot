
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "UniBot API"
    API_V1_STR: str = "/api"
    
    # Security
    SECRET_KEY: str = os.environ.get('SECRET_KEY', 'default-secret-key-for-development')
    
    # Database
    SQLALCHEMY_DATABASE_URI: str = os.environ.get('DATABASE_URL', 'sqlite:///database/chat.db')
    
    # Chatbot
    CONFIDENCE_THRESHOLD: float = float(os.environ.get('CONFIDENCE_THRESHOLD', '0.7'))
    
    # Logging
    LOG_LEVEL: str = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE: str = os.environ.get('LOG_FILE', 'chatbot.log')

settings = Settings()
