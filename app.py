from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os
import uuid
from datetime import datetime
from functools import wraps

# Import configuration
from config import Config

# Import chatbot components
from chatbot.processor import ChatProcessor
from chatbot.intent_handler import IntentHandler
from chatbot.response_generator import ResponseGenerator

# Import database handlers
from database.db_handler import get_db_session, init_db
from database.models import Conversation, Message
from database.user_models import User

# Import authentication routes
from auth.auth_routes import auth

# Import API routes
from api_routes import api

# Import utilities
from utils.logger import setup_logger
from utils.text_processor import preprocess_text

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Set up secret key for session management
app.secret_key = Config.SECRET_KEY

# Register blueprints
app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(auth, url_prefix='/auth')

# Initialize database
db = SQLAlchemy(app)

# Set up logger
logger = setup_logger(__name__, Config.LOG_LEVEL, Config.LOG_FILE)

# Initialize chatbot components
intent_handler = IntentHandler()
response_generator = ResponseGenerator()
chat_processor = ChatProcessor(intent_handler, response_generator)

# Ensure the database exists
# Using with_app_context instead of before_first_request which is deprecated
def init_database():
    with app.app_context():
        init_db()
        logger.info("Database initialized")

# Initialize database on startup
init_database()

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    # Serve the React app for all routes except API and auth routes
    # This allows React Router to handle client-side routing
    try:
        return send_from_directory('dist', 'index.html')
    except Exception as e:
        app.logger.error(f"Error serving React app: {str(e)}")
        return jsonify({'error': 'Frontend not found. Make sure to build the React app first.'}), 404

# Serve static files from the React build
@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory('dist/assets', path)

@app.route('/api/chat', methods=['POST'])
def api_chat():
    # Initialize db_session to None so we can check if it exists in the finally block
    db_session = None

    try:
        # Get user message from request
        data = request.get_json()
        user_message = data.get('message', '')
        user_id = session.get('user_id', str(uuid.uuid4()))

        # Log the incoming message
        logger.info(f"Received message from {user_id}: {user_message}")

        # Process the message and get a response
        processed_text = preprocess_text(user_message)
        intent = intent_handler.identify_intent(processed_text)
        bot_response = chat_processor.process(processed_text, intent)

        # Save conversation to database
        db_session = get_db_session()

        # Check if conversation exists for this user
        conversation = db_session.query(Conversation).filter_by(user_id=user_id).first()

        # Create a new conversation if it doesn't exist
        if not conversation:
            conversation = Conversation(user_id=user_id, start_time=datetime.now())
            db_session.add(conversation)
            db_session.commit()

        # Add user message to database
        user_msg = Message(
            conversation_id=conversation.id,
            content=user_message,
            sender="user",
            timestamp=datetime.now()
        )
        db_session.add(user_msg)

        # Add bot response to database
        bot_msg = Message(
            conversation_id=conversation.id,
            content=bot_response,
            sender="bot",
            timestamp=datetime.now()
        )
        db_session.add(bot_msg)

        # Update conversation last_update time
        conversation.last_update = datetime.now()
        db_session.commit()

        # Return the response
        return jsonify({
            'response': bot_response,
            'intent': intent,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        # Rollback the session if an error occurred and the session exists
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': 'An error occurred while processing your request',
            'details': str(e)
        }), 500

    finally:
        # Ensure the session is always closed if it exists
        if db_session is not None:
            db_session.close()


@app.route('/api/conversations', methods=['GET'])
def get_conversations():
    # Initialize db_session to None so we can check if it exists in the finally block
    db_session = None
    
    try:
        db_session = get_db_session()
        conversations = db_session.query(Conversation).all()
        
        result = []
        for conv in conversations:
            result.append({
                'id': conv.id,
                'user_id': conv.user_id,
                'start_time': conv.start_time.isoformat(),
                'last_update': conv.last_update.isoformat() if conv.last_update else None
            })
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error retrieving conversations: {str(e)}")
        # Rollback the session if an error occurred and the session exists
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': 'An error occurred while retrieving conversations',
            'details': str(e)
        }), 500
    
    finally:
        # Ensure the session is always closed if it exists
        if db_session is not None:
            db_session.close()

@app.route('/api/conversation/<int:conversation_id>/messages', methods=['GET'])
def get_conversation_messages(conversation_id):
    try:
        # Use the function from db_handler to get messages
        from database.db_handler import get_conversation_messages as db_get_messages
        messages = db_get_messages(conversation_id)
        
        result = []
        for msg in messages:
            result.append({
                'id': msg.id,
                'content': msg.content,
                'sender': msg.sender,
                'timestamp': msg.timestamp.isoformat()
            })
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error retrieving messages for conversation {conversation_id}: {str(e)}")
        return jsonify({
            'error': f'An error occurred while retrieving messages for conversation {conversation_id}',
            'details': str(e)
        }), 500

# Run the application
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=Config.DEBUG)