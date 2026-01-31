from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
import os
import sys

# Add the project root to the path so we can import the config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config
from database.models import Base, Conversation, Message, Intent, Pattern, Response, Feedback
from database.user_models import User  # Import User model

# Create engine
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)

# Create session factory
Session = scoped_session(sessionmaker(bind=engine))

def get_db_session():
    """Get a new database session"""
    return Session()

def init_db():
    """Initialize the database by creating all tables"""
    # Create tables if they don't exist
    Base.metadata.create_all(engine)
    
    # Initialize with default intents if the intents table is empty
    session = get_db_session()
    intent_count = session.query(Intent).count()
    
    if intent_count == 0:
        # Add default intents
        default_intents = [
            {
                'name': 'greeting',
                'description': 'User greetings',
                'patterns': ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'],
                'responses': ['Hello! How can I help you today?', 'Hi there! What can I do for you?', 'Greetings! How may I assist you?']
            },
            {
                'name': 'goodbye',
                'description': 'User saying goodbye',
                'patterns': ['bye', 'goodbye', 'see you later', 'see ya', 'farewell', 'that\'s all'],
                'responses': ['Goodbye! Have a great day!', 'See you later!', 'Take care!']
            },
            {
                'name': 'thanks',
                'description': 'User expressing gratitude',
                'patterns': ['thanks', 'thank you', 'appreciate it', 'thanks a lot', 'thank you very much'],
                'responses': ['You\'re welcome!', 'Happy to help!', 'Anytime!', 'My pleasure!']
            },
            {
                'name': 'help',
                'description': 'User asking for help',
                'patterns': ['help', 'can you help me', 'I need help', 'assist me', 'support'],
                'responses': ['I\'m here to help! What do you need assistance with?', 'How can I assist you today?', 'I\'d be happy to help. What\'s your question?']
            },
            {
                'name': 'about',
                'description': 'User asking about the chatbot',
                'patterns': ['who are you', 'what are you', 'tell me about yourself', 'what is your name', 'what can you do'],
                'responses': ['I am an AI chatbot designed to assist with various tasks and answer questions.', 'I\'m your virtual assistant, here to help with information and tasks.', 'I\'m an AI assistant created to make your life easier!']
            }
        ]
        
        for intent_data in default_intents:
            # Create intent
            intent = Intent(name=intent_data['name'], description=intent_data['description'])
            session.add(intent)
            session.flush()  # Flush to get the intent ID
            
            # Add patterns
            for pattern_text in intent_data['patterns']:
                pattern = Pattern(intent_id=intent.id, text=pattern_text)
                session.add(pattern)
            
            # Add responses
            for response_text in intent_data['responses']:
                response = Response(intent_id=intent.id, text=response_text)
                session.add(response)
        
        session.commit()
    
    session.close()

def get_all_intents():
    """Get all intents from the database"""
    session = get_db_session()
    intents = session.query(Intent).all()
    session.close()
    return intents

def get_intent_patterns(intent_id):
    """Get all patterns for a specific intent"""
    session = get_db_session()
    patterns = session.query(Pattern).filter_by(intent_id=intent_id).all()
    session.close()
    return patterns

def get_intent_responses(intent_id):
    """Get all responses for a specific intent"""
    session = get_db_session()
    responses = session.query(Response).filter_by(intent_id=intent_id).all()
    session.close()
    return responses

def add_conversation(user_id):
    """Add a new conversation to the database"""
    session = get_db_session()
    conversation = Conversation(user_id=user_id)
    session.add(conversation)
    session.commit()
    conversation_id = conversation.id
    session.close()
    return conversation_id

def add_message(conversation_id, content, sender, intent=None, confidence=None):
    """Add a new message to the database"""
    session = get_db_session()
    message = Message(
        conversation_id=conversation_id,
        content=content,
        sender=sender,
        intent=intent,
        confidence=confidence
    )
    session.add(message)
    session.commit()
    message_id = message.id
    session.close()
    return message_id

def add_feedback(message_id, rating, comment=None):
    """Add feedback for a message"""
    session = get_db_session()
    feedback = Feedback(
        message_id=message_id,
        rating=rating,
        comment=comment
    )
    session.add(feedback)
    session.commit()
    feedback_id = feedback.id
    session.close()
    return feedback_id

def get_conversation_messages(conversation_id):
    """Get all messages for a specific conversation"""
    session = get_db_session()
    messages = session.query(Message).filter_by(conversation_id=conversation_id).order_by(Message.timestamp).all()
    session.close()
    return messages

def get_user_conversations(user_id):
    """Get all conversations for a specific user"""
    session = get_db_session()
    conversations = session.query(Conversation).filter_by(user_id=user_id).order_by(Conversation.start_time.desc()).all()
    session.close()
    return conversations