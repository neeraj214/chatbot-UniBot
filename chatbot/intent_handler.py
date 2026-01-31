import json
import os
import random
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Import database handlers
from database.db_handler import get_db_session, get_intent_patterns
from database.models import Intent, Pattern
from utils.logger import setup_logger
from config import Config

class IntentHandler:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.intents = {}
        self.words = []
        self.classes = []
        self.documents = []
        self.ignore_words = ['?', '!', '.', ',', ';', ':']
        self.logger = setup_logger(__name__, Config.LOG_LEVEL, Config.LOG_FILE)
        self.load_intents()
    
    def load_intents(self):
        """Load intents from the database"""
        db_session = None
        try:
            # Get all intents from the database
            db_session = get_db_session()
            if not db_session:
                raise Exception("Failed to create database session")
                
            intents = db_session.query(Intent).all()
            
            for intent in intents:
                # Get patterns for this intent
                patterns = get_intent_patterns(intent.id)
                pattern_texts = [pattern.text for pattern in patterns]
                
                # Add to our intents dictionary
                self.intents[intent.name] = pattern_texts
                self.classes.append(intent.name)
                
                # Add each pattern to our documents list
                for pattern in pattern_texts:
                    # Tokenize each word in the pattern
                    w = word_tokenize(pattern.lower())
                    # Add to our words list
                    self.words.extend(w)
                    # Add to our documents list
                    self.documents.append((w, intent.name))
            
            # Lemmatize and remove duplicates
            self.words = [self.lemmatizer.lemmatize(w.lower()) for w in self.words if w not in self.ignore_words]
            self.words = sorted(list(set(self.words)))
            
        except Exception as e:
            self.logger.error(f"Error loading intents from database: {str(e)}")
            # Fallback to loading from file if database fails
            self.load_intents_from_file()
        finally:
            if db_session is not None:
                db_session.close()
    
    def load_intents_from_file(self):
        """Fallback method to load intents from a JSON file"""
        try:
            with open(Config.TRAINING_DATA_PATH, 'r') as file:
                data = json.load(file)
                
                for intent in data.get('intents', []):
                    intent_name = intent.get('tag')
                    patterns = intent.get('patterns', [])
                    
                    self.intents[intent_name] = patterns
                    self.classes.append(intent_name)
                    
                    # Add each pattern to our documents list
                    for pattern in patterns:
                        # Tokenize each word in the pattern
                        w = word_tokenize(pattern.lower())
                        # Add to our words list
                        self.words.extend(w)
                        # Add to our documents list
                        self.documents.append((w, intent_name))
                
                # Lemmatize and remove duplicates
                self.words = [self.lemmatizer.lemmatize(w.lower()) for w in self.words if w not in self.ignore_words]
                self.words = sorted(list(set(self.words)))
                
        except Exception as e:
            self.logger.error(f"Error loading intents from file: {str(e)}")
            # Initialize with default intents if both methods fail
            self.intents = {
                'greeting': ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
                'goodbye': ['bye', 'goodbye', 'see you later', 'see you soon', 'have a good day'],
                'thanks': ['thank you', 'thanks', 'appreciate it', 'thank you so much'],
                'unknown': ['unknown']
            }
            self.classes = list(self.intents.keys())
    
    def detect_intent(self, message):
        """Detect the intent of a message"""
        try:
            # Tokenize the message
            message_words = word_tokenize(message.lower())
            # Lemmatize each word
            message_words = [self.lemmatizer.lemmatize(word.lower()) for word in message_words if word not in self.ignore_words]
            
            # Check for exact matches first
            for intent, patterns in self.intents.items():
                for pattern in patterns:
                    if message.lower() == pattern.lower():
                        return intent
            
            # If no exact match, check for partial matches
            best_match = None
            best_score = 0
            
            for intent, patterns in self.intents.items():
                for pattern in patterns:
                    pattern_words = word_tokenize(pattern.lower())
                    pattern_words = [self.lemmatizer.lemmatize(word.lower()) for word in pattern_words if word not in self.ignore_words]
                    
                    # Count how many words match
                    matches = sum(1 for word in message_words if word in pattern_words)
                    
                    # Calculate a score based on the percentage of matching words
                    if len(pattern_words) > 0:
                        score = matches / len(pattern_words)
                        
                        if score > best_score:
                            best_score = score
                            best_match = intent
            
            # If we have a good match, return it
            if best_score > 0.5:
                return best_match
            
            # If no good match, return 'unknown'
            return 'unknown'
            
        except Exception as e:
            self.logger.error(f"Error detecting intent: {str(e)}")
            return 'unknown'
    
    def add_pattern(self, intent, pattern_text):
        """Add a new pattern for an intent"""
        if not intent or not pattern_text:
            return False
        
        db_session = None
        try:
            db_session = get_db_session()
            
            # Check if the intent exists
            intent_obj = db_session.query(Intent).filter_by(name=intent).first()
            
            if not intent_obj:
                # Create the intent if it doesn't exist
                intent_obj = Intent(name=intent)
                db_session.add(intent_obj)
                db_session.flush()  # Flush to get the ID
            
            # Create the pattern
            pattern = Pattern(intent_id=intent_obj.id, text=pattern_text)
            db_session.add(pattern)
            
            db_session.commit()
            
            # Update our local data
            if intent in self.intents:
                self.intents[intent].append(pattern_text)
            else:
                self.intents[intent] = [pattern_text]
                self.classes.append(intent)
            
            # Update our words and documents
            w = word_tokenize(pattern_text.lower())
            self.words.extend(w)
            self.documents.append((w, intent))
            
            # Lemmatize and remove duplicates
            self.words = [self.lemmatizer.lemmatize(word.lower()) for word in self.words if word not in self.ignore_words]
            self.words = sorted(list(set(self.words)))
            
            return True
            
        except Exception as e:
            self.logger.error(f"Error adding pattern: {str(e)}")
            if db_session:
                db_session.rollback()
            return False
            
        finally:
            if db_session:
                db_session.close()