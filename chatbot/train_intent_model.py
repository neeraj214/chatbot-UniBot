import json
import os
import re
import nltk
import joblib
import numpy as np
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Ensure NLTK data is available
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')

class IntentModelTrainer:
    """
    Trains a Logistic Regression model on TF-IDF vectors for intent classification.
    """
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=5000)
        self.classifier = LogisticRegression(max_iter=1000, random_state=42)
        
        # Paths
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_path = os.path.join(self.base_dir, '..', 'data', 'training_data.json')
        self.model_dir = os.path.join(self.base_dir, 'model')
        
        # Ensure model directory exists
        os.makedirs(self.model_dir, exist_ok=True)

    def preprocess_text(self, text):
        """
        Cleans and normalizes text: lowercase, remove punctuation/numbers, remove stopwords, lemmatize.
        """
        # Lowercase
        text = text.lower()
        # Remove punctuation and numbers
        text = re.sub(r'[^a-z\s]', '', text)
        # Tokenize
        tokens = nltk.word_tokenize(text)
        # Remove stopwords and lemmatize
        tokens = [self.lemmatizer.lemmatize(word) for word in tokens if word not in self.stop_words]
        return ' '.join(tokens)

    def load_data(self):
        """
        Loads training data from JSON file.
        """
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Training data not found at {self.data_path}")
            
        with open(self.data_path, 'r') as f:
            data = json.load(f)
            
        X = []
        y = []
        
        for intent in data['intents']:
            tag = intent['tag']
            for pattern in intent['patterns']:
                cleaned_pattern = self.preprocess_text(pattern)
                if cleaned_pattern: # Ensure not empty after cleaning
                    X.append(cleaned_pattern)
                    y.append(tag)
                    
        return X, y

    def train(self):
        """
        Trains the model and saves artifacts.
        """
        print("Loading data...")
        X_raw, y = self.load_data()
        
        print(f"Training on {len(X_raw)} samples...")
        
        # Vectorize
        X_vectorized = self.vectorizer.fit_transform(X_raw)
        
        # Train classifier
        self.classifier.fit(X_vectorized, y)
        
        # Save artifacts
        print("Saving model artifacts...")
        joblib.dump(self.vectorizer, os.path.join(self.model_dir, 'tfidf_vectorizer.pkl'))
        joblib.dump(self.classifier, os.path.join(self.model_dir, 'intent_classifier.pkl'))
        
        print("Training completed successfully.")

def train_model():
    """
    Convenience function for triggering training from other modules.
    """
    trainer = IntentModelTrainer()
    trainer.train()

if __name__ == "__main__":
    train_model()
