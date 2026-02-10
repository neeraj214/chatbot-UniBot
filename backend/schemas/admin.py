from pydantic import BaseModel, Field
from typing import List, Optional

class IntentExample(BaseModel):
    text: str = Field(..., min_length=1, description="Example sentence for the intent")

class IntentCreate(BaseModel):
    tag: str = Field(..., min_length=1, description="Unique tag for the intent")
    patterns: List[str] = Field(..., min_items=1, description="List of example patterns")
    responses: List[str] = Field(..., min_items=1, description="List of possible responses")

class IntentUpdate(BaseModel):
    patterns: Optional[List[str]] = Field(None, min_items=1)
    responses: Optional[List[str]] = Field(None, min_items=1)

class RetrainResponse(BaseModel):
    message: str
    model_version: str
    status: str
