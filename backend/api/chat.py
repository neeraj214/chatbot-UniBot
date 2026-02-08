from fastapi import APIRouter, HTTPException
import uuid
import sys
import os

# Ensure root is in sys.path to import chatbot
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.schemas.chat import ChatRequest, ChatResponse
from chatbot.processor import ChatProcessor
from chatbot.intent_handler import IntentHandler
from chatbot.response_generator import ResponseGenerator

router = APIRouter()

# Initialize Chatbot components (Singleton)
intent_handler = IntentHandler()
response_generator = ResponseGenerator()
chat_processor = ChatProcessor(intent_handler, response_generator)

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        user_id = request.user_id or str(uuid.uuid4())
        
        # Process the message
        result = chat_processor.process_message(request.message, user_id)
        
        detected_intent = result['intent']
        bot_response = result['response']
        
        # Retrieve confidence score
        # Note: ChatProcessor doesn't return confidence, so we fetch it from the classifier
        # to satisfy the API contract without modifying Phase 1 files.
        confidence = 0.0
        try:
            if hasattr(chat_processor.intent_handler, 'ml_classifier'):
                ml_intent, ml_conf = chat_processor.intent_handler.ml_classifier.predict(request.message)
                
                # If the detected intent matches ML prediction, use that confidence
                if detected_intent == ml_intent:
                    confidence = float(ml_conf)
                else:
                    # If intents differ, fallback logic was likely used.
                    # We report the ML confidence if it's "unknown", otherwise we don't have a score.
                    # For semantic fallback, we might assign a default "fallback confidence" or use ML's.
                    # Here we default to ML confidence for consistency.
                    confidence = float(ml_conf)
        except Exception as e:
            # Fallback if confidence retrieval fails
            pass

        return ChatResponse(
            intent=detected_intent,
            confidence=confidence,
            response=bot_response
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
