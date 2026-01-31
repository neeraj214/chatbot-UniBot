import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Application configuration
class Config:
    # Flask configuration
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default-secret-key-for-development')
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///database/chat.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Chatbot configuration
    CONFIDENCE_THRESHOLD = float(os.environ.get('CONFIDENCE_THRESHOLD', '0.7'))
    DEFAULT_RESPONSE = "I'm sorry, I don't understand that. Could you rephrase?"
    MAX_CONVERSATION_HISTORY = int(os.environ.get('MAX_CONVERSATION_HISTORY', '10'))
    
    # NLP configuration
    LANGUAGE_MODEL = os.environ.get('LANGUAGE_MODEL', 'en_core_web_sm')
    
    # Logging configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.environ.get('LOG_FILE', 'chatbot.log')
    
    # API keys (if needed)
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
    
    # Training configuration
    TRAINING_DATA_PATH = os.path.join('data', 'training_data.json')
    MODEL_SAVE_PATH = os.path.join('ai_chatbot', 'models')
    EPOCHS = int(os.environ.get('EPOCHS', '100'))
    BATCH_SIZE = int(os.environ.get('BATCH_SIZE', '5'))
    LEARNING_RATE = float(os.environ.get('LEARNING_RATE', '0.001'))