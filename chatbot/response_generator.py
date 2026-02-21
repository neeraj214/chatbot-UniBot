import random
import json
import os
from datetime import datetime

# Import database handlers
from database.db_handler import get_db_session, get_intent_responses
from database.models import Intent, Response
from config import Config

class ResponseGenerator:
    def __init__(self):
        self.responses = {}
        self.default_response = Config.DEFAULT_RESPONSE
        self.load_responses()
    
    def load_responses(self):
        db_session = None
        try:
            db_session = get_db_session()
            if not db_session:
                raise Exception("Failed to create database session")

            intents = db_session.query(Intent).all()
            self.responses = {}

            for intent in intents:
                responses = get_intent_responses(intent.id)
                response_texts = [response.text for response in responses]

                self.responses[intent.name] = response_texts

            self._merge_file_responses()

        except Exception as e:
            print(f"Error loading responses from database: {str(e)}")
            self.responses = {}
            self._merge_file_responses()
        finally:
            if db_session is not None:
                db_session.close()
    
    def _merge_file_responses(self):
        try:
            with open(Config.TRAINING_DATA_PATH, 'r') as file:
                data = json.load(file)

                for intent in data.get('intents', []):
                    intent_name = intent.get('tag')
                    responses = intent.get('responses', [])

                    if not intent_name:
                        continue

                    if intent_name not in self.responses or not self.responses[intent_name]:
                        self.responses[intent_name] = responses

        except Exception as e:
            print(f"Error loading responses from file: {str(e)}")
            if not self.responses:
                self.responses = {
                    'greeting': ['Hello! How can I help you today?', 'Hi there!'],
                    'goodbye': ['Goodbye!', 'See you later!'],
                    'thanks': ['You\'re welcome!', 'Happy to help!'],
                    'unknown': [self.default_response]
                }
    
    def generate_response(self, intent, context=None):
        """Generate a response based on the intent and context"""
        # If we have responses for this intent, choose one randomly
        if intent in self.responses and self.responses[intent]:
            response = random.choice(self.responses[intent])
        else:
            # Use default response for unknown intents
            response = self.default_response
        
        # Process any dynamic content in the response
        response = self.process_dynamic_content(response, context)
        
        return response
    
    def process_dynamic_content(self, response, context=None):
        """Process any dynamic content in the response"""
        # Replace placeholders with dynamic content
        if '{time}' in response:
            current_time = datetime.now().strftime('%H:%M')
            response = response.replace('{time}', current_time)
        
        if '{date}' in response:
            current_date = datetime.now().strftime('%Y-%m-%d')
            response = response.replace('{date}', current_date)
        
        # If we have context, we can use it to personalize the response
        if context:
            if '{name}' in response and 'name' in context:
                response = response.replace('{name}', context['name'])
        
        return response
    
    def add_response(self, intent, response_text):
        """Add a new response for an intent"""
        if not intent or not response_text:
            print("Invalid parameters: intent or response_text is missing")
            return False

        if intent not in self.responses:
            self.responses[intent] = []
        
        if response_text not in self.responses[intent]:
            self.responses[intent].append(response_text)
            
            # Save to database
            db_session = None
            try:
                db_session = get_db_session()
                # Find the intent in the database
                intent_obj = db_session.query(Intent).filter_by(name=intent).first()
                
                if not intent_obj:
                    print(f"Intent '{intent}' not found in database")
                    return False
                
                # Create Response object with correct parameter names
                response = Response(intent_id=intent_obj.id, text=response_text)
                db_session.add(response)
                db_session.commit()
                return True
                
            except Exception as e:
                if db_session:
                    db_session.rollback()
                print(f"Error adding response to database: {str(e)}")
                return False
            finally:
                if db_session is not None:
                    db_session.close()
        
        return False
    
    def remove_response(self, intent, response_text):
        """Remove a response for an intent"""
        if intent in self.responses and response_text in self.responses[intent]:
            self.responses[intent].remove(response_text)
            
            # Remove from database
            db_session = None
            try:
                db_session = get_db_session()
                from database.models import Intent, Response
                
                # Find the intent in the database
                intent_obj = db_session.query(Intent).filter_by(name=intent).first()
                
                if intent_obj:
                    # Find and remove the response
                    response = db_session.query(Response).filter_by(
                        intent_id=intent_obj.id, 
                        text=response_text
                    ).first()
                    
                    if response:
                        db_session.delete(response)
                        db_session.commit()
                        return True
                    
            except Exception as e:
                if db_session:
                    db_session.rollback()
                print(f"Error removing response from database: {str(e)}")
            finally:
                if db_session is not None:
                    db_session.close()
            
        return False
