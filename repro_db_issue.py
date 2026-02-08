
import sys
import os
import uuid
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add root to path
sys.path.append(os.getcwd())

from database.models import Conversation, Base
from database.db_handler import init_db
from config import Config

def test_db_insert():
    print(f"DB URI: {Config.SQLALCHEMY_DATABASE_URI}")
    
    # Initialize DB first (create tables)
    print("Initializing database...")
    init_db()
    
    engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        user_id = str(uuid.uuid4())
        print(f"Attempting to insert Conversation with user_id={user_id} (type: {type(user_id)})")
        
        # This mirrors what ChatProcessor does
        conversation = Conversation(user_id=user_id)
        session.add(conversation)
        session.commit()
        print("Success!")
    except Exception as e:
        print(f"Failed: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    test_db_insert()
