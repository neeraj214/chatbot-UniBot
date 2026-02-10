import json
import os
from typing import List, Dict, Optional
from fastapi import HTTPException, status
from backend.schemas.admin import IntentCreate, IntentUpdate

class IntentService:
    def __init__(self):
        self.data_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            'data',
            'training_data.json'
        )

    def _load_data(self) -> Dict:
        try:
            with open(self.data_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to load training data: {str(e)}"
            )

    def _save_data(self, data: Dict):
        try:
            with open(self.data_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save training data: {str(e)}"
            )

    def get_all_intents(self) -> List[Dict]:
        data = self._load_data()
        return data.get("intents", [])

    def create_intent(self, intent_data: IntentCreate) -> Dict:
        data = self._load_data()
        
        # Check if intent already exists
        for intent in data["intents"]:
            if intent["tag"] == intent_data.tag:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Intent with tag '{intent_data.tag}' already exists"
                )
        
        new_intent = {
            "tag": intent_data.tag,
            "patterns": intent_data.patterns,
            "responses": intent_data.responses
        }
        
        data["intents"].append(new_intent)
        self._save_data(data)
        return new_intent

    def update_intent(self, intent_tag: str, intent_data: IntentUpdate) -> Dict:
        data = self._load_data()
        
        found = False
        updated_intent = None
        
        for intent in data["intents"]:
            if intent["tag"] == intent_tag:
                if intent_data.patterns:
                    intent["patterns"] = intent_data.patterns
                if intent_data.responses:
                    intent["responses"] = intent_data.responses
                updated_intent = intent
                found = True
                break
        
        if not found:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Intent with tag '{intent_tag}' not found"
            )
            
        self._save_data(data)
        return updated_intent

    def delete_intent(self, intent_tag: str):
        data = self._load_data()
        
        initial_len = len(data["intents"])
        data["intents"] = [i for i in data["intents"] if i["tag"] != intent_tag]
        
        if len(data["intents"]) == initial_len:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Intent with tag '{intent_tag}' not found"
            )
            
        self._save_data(data)
        return {"message": f"Intent '{intent_tag}' deleted successfully"}
