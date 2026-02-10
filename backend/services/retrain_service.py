import os
import threading
import logging
import time
from datetime import datetime
from fastapi import HTTPException, status
from chatbot.train_intent_model import train_model

logger = logging.getLogger(__name__)

class RetrainService:
    _lock = threading.Lock()
    _is_training = False
    
    def __init__(self):
        self.model_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
            'chatbot',
            'model'
        )

    def retrain_model(self) -> dict:
        """
        Trigger model retraining safely.
        """
        if RetrainService._is_training:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Model retraining is already in progress"
            )

        with RetrainService._lock:
            # Double-check inside lock
            if RetrainService._is_training:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Model retraining is already in progress"
                )
            
            RetrainService._is_training = True
            
            try:
                logger.info("Starting model retraining...")
                start_time = time.time()
                
                # Call existing training logic
                # Note: train_model saves to 'chatbot/model/' by default
                train_model()
                
                # Create versioned artifacts
                version = datetime.now().strftime("%Y%m%d_%H%M%S")
                self._version_artifacts(version)
                
                duration = time.time() - start_time
                logger.info(f"Model retraining completed in {duration:.2f}s")
                
                return {
                    "message": "Model retraining completed successfully",
                    "model_version": version,
                    "status": "success"
                }
                
            except Exception as e:
                logger.error(f"Model retraining failed: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Model retraining failed: {str(e)}"
                )
            finally:
                RetrainService._is_training = False

    def _version_artifacts(self, version: str):
        """
        Create versioned copies of model artifacts.
        """
        artifacts = ['intent_classifier.pkl', 'tfidf_vectorizer.pkl']
        
        for artifact in artifacts:
            src = os.path.join(self.model_dir, artifact)
            dst = os.path.join(self.model_dir, f"{artifact.split('.')[0]}_{version}.pkl")
            
            if os.path.exists(src):
                try:
                    import shutil
                    shutil.copy2(src, dst)
                    logger.info(f"Created versioned artifact: {dst}")
                except Exception as e:
                    logger.error(f"Failed to version artifact {artifact}: {e}")
