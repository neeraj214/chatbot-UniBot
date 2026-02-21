import os
import json
import random
from datetime import datetime

# Import database handlers
from database.db_handler import get_db_session
from database.models import Conversation, Message
from utils.logger import setup_logger
from utils.text_processor import preprocess_text
from config import Config

class ChatProcessor:
    def __init__(self, intent_handler, response_generator):
        self.intent_handler = intent_handler
        self.response_generator = response_generator
        self.logger = setup_logger(__name__, Config.LOG_LEVEL, Config.LOG_FILE)
        self.logger.info("ChatProcessor initialized")
    
    def process_message(self, user_message, user_id=None, conversation_id=None):
        """
        Process a user message and generate a response
        
        Args:
            user_message (str): The message from the user
            user_id (str, optional): The ID of the user
            conversation_id (str, optional): The ID of the conversation
            
        Returns:
            dict: A dictionary containing the bot's response and metadata
        """
        try:
            processed_message = preprocess_text(user_message)

            intent = self.intent_handler.detect_intent(user_message, user_id)
            self.logger.info(f"Detected intent: {intent}")
            
            # Generate a response based on the intent
            context = {
                'user_id': user_id,
                'conversation_id': conversation_id,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            bot_response = self.response_generator.generate_response(intent, context)
            
            # Update Short-term Context Memory (Task 3)
            if user_id and hasattr(self.intent_handler, 'context_manager'):
                 self.intent_handler.context_manager.update_context(user_id, user_message, intent, bot_response)

            # Save the conversation to the database if user_id is provided
            if user_id:
                self._save_conversation(user_id, user_message, bot_response, conversation_id)
            
            # Return the response with metadata
            return {
                'response': bot_response,
                'intent': intent,
                'timestamp': context['timestamp'],
                'conversation_id': conversation_id
            }
            
        except Exception as e:
            self.logger.error(f"Error processing message: {str(e)}")
            return {
                'response': "I'm sorry, I encountered an error while processing your message.",
                'intent': 'error',
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'conversation_id': conversation_id
            }
    
    def _save_conversation(self, user_id, user_message, bot_response, conversation_id=None):
        """
        Save the conversation to the database
        
        Args:
            user_id (str): The ID of the user
            user_message (str): The message from the user
            bot_response (str): The response from the bot
            conversation_id (str, optional): The ID of the conversation
            
        Returns:
            str: The ID of the conversation
        """
        db_session = None
        try:
            db_session = get_db_session()
            
            # If no conversation_id is provided, create a new conversation
            if not conversation_id:
                conversation = Conversation(user_id=user_id)
                db_session.add(conversation)
                db_session.flush()  # Flush to get the ID
                conversation_id = conversation.id
            else:
                # Get the existing conversation
                conversation = db_session.query(Conversation).filter_by(id=conversation_id).first()
                if not conversation:
                    # If conversation doesn't exist, create a new one
                    conversation = Conversation(user_id=user_id)
                    db_session.add(conversation)
                    db_session.flush()  # Flush to get the ID
                    conversation_id = conversation.id
            
            # Add the user message
            user_msg = Message(
                conversation_id=conversation_id,
                sender='user',
                content=user_message,
                timestamp=datetime.now()
            )
            db_session.add(user_msg)
            
            # Add the bot response
            bot_msg = Message(
                conversation_id=conversation_id,
                sender='bot',
                content=bot_response,
                timestamp=datetime.now()
            )
            db_session.add(bot_msg)
            
            # Update the conversation's last_updated timestamp
            conversation.last_updated = datetime.now()
            
            db_session.commit()
            return conversation_id
            
        except Exception as e:
            self.logger.error(f"Error saving conversation: {str(e)}")
            if db_session:
                db_session.rollback()
            return conversation_id
            
        finally:
            if db_session:
                db_session.close()
