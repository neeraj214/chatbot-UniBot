import os
import joblib
import numpy as np
from chatbot.train_intent_model import IntentModelTrainer

class MLIntentClassifier:
    """
    Predicts intent using the trained TF-IDF + Logistic Regression model.
    """
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.model_dir = os.path.join(self.base_dir, 'model')
        self.vectorizer_path = os.path.join(self.model_dir, 'tfidf_vectorizer.pkl')
        self.classifier_path = os.path.join(self.model_dir, 'intent_classifier.pkl')
        
        self.vectorizer = None
        self.classifier = None
        # We reuse the trainer's preprocessing to ensure consistency
        self.trainer = IntentModelTrainer()
        
        self.load_model()

    def load_model(self):
        """
        Loads the saved vectorizer and classifier artifacts.
        """
        if not os.path.exists(self.vectorizer_path) or not os.path.exists(self.classifier_path):
            print(f"Error: Model files not found in {self.model_dir}")
            return

        try:
            self.vectorizer = joblib.load(self.vectorizer_path)
            self.classifier = joblib.load(self.classifier_path)
        except Exception as e:
            print(f"Error loading model: {e}")

    def predict(self, text):
        """
        Predicts the intent of the given text.
        
        Args:
            text (str): The user's input text.
            
        Returns:
            tuple: (predicted_intent, confidence_score)
        """
        if not self.vectorizer or not self.classifier:
            return None, 0.0
            
        # Preprocess using the same logic as training
        processed_text = self.trainer.preprocess_text(text)
        
        if not processed_text:
            return None, 0.0
            
        try:
            # Transform text to vector
            vectorized_text = self.vectorizer.transform([processed_text])
            
            # Get probabilities
            probabilities = self.classifier.predict_proba(vectorized_text)[0]
            
            # Find max probability
            max_prob_index = np.argmax(probabilities)
            confidence = probabilities[max_prob_index]
            intent = self.classifier.classes_[max_prob_index]
            
            return intent, float(confidence)
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return None, 0.0
