from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict
from backend.core.security import get_current_admin
from backend.schemas.admin import IntentCreate, IntentUpdate, RetrainResponse
from backend.services.intent_service import IntentService
from backend.services.retrain_service import RetrainService

router = APIRouter(dependencies=[Depends(get_current_admin)])

# Initialize services
intent_service = IntentService()
retrain_service = RetrainService()

# --- Intent Management Endpoints ---

@router.get("/intents", response_model=List[Dict])
async def get_intents():
    """
    Get all intents from the training data.
    """
    return intent_service.get_all_intents()

@router.post("/intent", status_code=status.HTTP_201_CREATED)
async def create_intent(intent: IntentCreate):
    """
    Create a new intent in the training data.
    """
    return intent_service.create_intent(intent)

@router.put("/intent/{intent_tag}")
async def update_intent(intent_tag: str, intent: IntentUpdate):
    """
    Update an existing intent.
    """
    return intent_service.update_intent(intent_tag, intent)

@router.delete("/intent/{intent_tag}")
async def delete_intent(intent_tag: str):
    """
    Delete an intent from the training data.
    """
    return intent_service.delete_intent(intent_tag)

# --- Retraining Endpoint ---

@router.post("/retrain", response_model=RetrainResponse)
async def retrain_model():
    """
    Trigger the model retraining pipeline.
    This process is protected by a lock to prevent concurrent runs.
    """
    return retrain_service.retrain_model()
