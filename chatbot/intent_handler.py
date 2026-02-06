import logging
import json
import os
import random
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from chatbot.ml_intent_classifier import MLIntentClassifier
from chatbot.context_manager import ContextManager
from config import Config

# Configure logging
logger = logging.getLogger(__name__)

class IntentHandler:
    def __init__(self):
        self.ml_classifier = MLIntentClassifier()
        self.context_manager = ContextManager()
        self.confidence_threshold = 0.60
        self.nlp = None
        self.training_data = self.load_training_data()
        
        # Try to load spaCy for semantic similarity
        try:
            import spacy
            try:
                # Try to load the requested model
                self.nlp = spacy.load("en_core_web_md")
                logger.info("spaCy en_core_web_md loaded successfully.")
            except OSError:
                logger.warning("spaCy model 'en_core_web_md' not found. Trying 'en_core_web_sm'.")
                try:
                    self.nlp = spacy.load("en_core_web_sm")
                    logger.info("spaCy en_core_web_sm loaded successfully.")
                except:
                    logger.warning("spaCy models not found. Will fallback to TF-IDF similarity.")
                    self.nlp = None
        except ImportError:
            logger.warning("spaCy not installed. Will fallback to TF-IDF similarity.")
        except Exception as e:
            logger.warning(f"spaCy init error: {e}")
            self.nlp = None

    def load_training_data(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        data_path = os.path.join(base_dir, '..', 'data', 'training_data.json')
        try:
            with open(data_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to load training data: {e}")
            return {"intents": []}

    def get_semantic_match(self, user_query):
        """
        Fallback layer: Uses spaCy embeddings (or TF-IDF) to find best match.
        """
        best_score = 0
        best_intent = None
        
        # Option 1: spaCy
        if self.nlp:
            try:
                user_doc = self.nlp(user_query)
                # Check if vector is valid (not empty/zero)
                if user_doc.vector_norm == 0:
                    return None
                    
                for intent in self.training_data['intents']:
                    for pattern in intent['patterns']:
                        pattern_doc = self.nlp(pattern)
                        if pattern_doc.vector_norm == 0:
                            continue
                            
                        similarity = user_doc.similarity(pattern_doc)
                        if similarity > best_score:
                            best_score = similarity
                            best_intent = intent['tag']
            except Exception as e:
                logger.error(f"spaCy similarity error: {e}")

        # Option 2: TF-IDF Fallback (if spaCy missing or failed to find match)
        # We only use this if spaCy is missing. If spaCy ran and found nothing, we might trust it.
        # But if spaCy is missing (self.nlp is None), we use TF-IDF.
        if not self.nlp and self.ml_classifier.vectorizer:
            try:
                # Preprocess
                processed_query = self.ml_classifier.trainer.preprocess_text(user_query)
                if processed_query:
                    user_vec = self.ml_classifier.vectorizer.transform([processed_query])
                    
                    for intent in self.training_data['intents']:
                        for pattern in intent['patterns']:
                            processed_pattern = self.ml_classifier.trainer.preprocess_text(pattern)
                            if processed_pattern:
                                pattern_vec = self.ml_classifier.vectorizer.transform([processed_pattern])
                                
                                # Compute cosine similarity
                                similarity = cosine_similarity(user_vec, pattern_vec)[0][0]
                                if similarity > best_score:
                                    best_score = similarity
                                    best_intent = intent['tag']
            except Exception as e:
                logger.error(f"TF-IDF similarity error: {e}")

        # Threshold for semantic match
        # If using TF-IDF, values might be lower/higher than spaCy. 0.4 is a safe conservative bet.
        if best_score > 0.4: 
            return best_intent
        return None

    def detect_intent(self, user_message, user_id=None):
        """
        Hybrid Intent Resolution Flow.
        Args:
            user_message (str): The user's input.
            user_id (str, optional): User ID for context lookup.
        """
        # 1. ML Prediction
        intent, confidence = self.ml_classifier.predict(user_message)
        logger.info(f"ML Prediction: {intent}, Confidence: {confidence}")
        
        final_intent = intent
        
        # 2. Fallback if confidence is low
        if confidence < self.confidence_threshold:
            logger.info(f"Low confidence ({confidence}). Attempting semantic fallback.")
            semantic_intent = self.get_semantic_match(user_message)
            if semantic_intent:
                final_intent = semantic_intent
                logger.info(f"Semantic Fallback found: {final_intent}")
            else:
                # If no semantic match and confidence is very low, return unknown
                if confidence < 0.3:
                     final_intent = 'unknown'

        # 3. Context (Optional usage for resolution)
        # In a real hybrid system, we would use context to disambiguate here.
        # For now, we just ensure context is updated later (in processor or explicit call).
        
        return final_intent
