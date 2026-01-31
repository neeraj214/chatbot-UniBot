from flask import Blueprint, jsonify, request, send_file
from database.db_handler import get_db_session
from database.models import Conversation, Message, Intent, Pattern, Response, Feedback
from sqlalchemy import func, desc
from datetime import datetime, timedelta
import json
import os

# Import token_required decorator
from auth.jwt_middleware import token_required

# Create blueprint for API routes
api = Blueprint('api', __name__)

@api.route('/stats', methods=['GET'])
@token_required
def get_stats():
    db_session = None
    try:
        db_session = get_db_session()
        
        # Get total conversations
        total_conversations = db_session.query(func.count(Conversation.id)).scalar() or 0
        
        # Get total messages
        total_messages = db_session.query(func.count(Message.id)).scalar() or 0
        
        # Get average user satisfaction
        avg_satisfaction = db_session.query(func.avg(Feedback.rating)).scalar() or 0
        avg_satisfaction = round(float(avg_satisfaction), 1) if avg_satisfaction else 0.0
        
        # Get total intents
        total_intents = db_session.query(func.count(Intent.id)).scalar() or 0
        
        # Get intent distribution
        intent_distribution = []
        intents = db_session.query(Intent).all()
        for intent in intents:
            count = db_session.query(func.count(Message.id)).filter(Message.intent == intent.name).scalar() or 0
            intent_distribution.append({
                'name': intent.name,
                'count': count
            })
        
        # Get daily activity for the last 7 days
        daily_activity = []
        for i in range(7):
            date = datetime.now().date() - timedelta(days=i)
            start_of_day = datetime.combine(date, datetime.min.time())
            end_of_day = datetime.combine(date, datetime.max.time())
            
            count = db_session.query(func.count(Message.id)).filter(
                Message.timestamp >= start_of_day,
                Message.timestamp <= end_of_day
            ).scalar() or 0
            
            daily_activity.append({
                'date': date.strftime('%Y-%m-%d'),
                'count': count
            })
        
        # Reverse to show oldest to newest
        daily_activity.reverse()
        
        return jsonify({
            'total_conversations': total_conversations,
            'total_messages': total_messages,
            'avg_satisfaction': avg_satisfaction,
            'total_intents': total_intents,
            'intent_distribution': intent_distribution,
            'daily_activity': daily_activity
        })
    
    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': 'An error occurred while retrieving dashboard statistics',
            'details': str(e)
        }), 500
    
    finally:
        if db_session is not None:
            db_session.close()

@api.route('/intents', methods=['GET'])
def get_intents():
    db_session = None
    try:
        db_session = get_db_session()
        intents = db_session.query(Intent).all()
        
        result = []
        for intent in intents:
            result.append({
                'id': intent.id,
                'name': intent.name,
                'description': intent.description,
                'patterns': len(intent.patterns),
                'responses': len(intent.responses)
            })
        
        return jsonify(result)
    
    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': 'An error occurred while retrieving intents',
            'details': str(e)
        }), 500
    
    finally:
        if db_session is not None:
            db_session.close()

@api.route('/intent/<int:intent_id>', methods=['GET'])
def get_intent(intent_id):
    db_session = None
    try:
        db_session = get_db_session()
        intent = db_session.query(Intent).filter_by(id=intent_id).first()
        
        if not intent:
            return jsonify({
                'error': f'Intent with ID {intent_id} not found'
            }), 404
        
        patterns = []
        for pattern in intent.patterns:
            patterns.append({
                'id': pattern.id,
                'text': pattern.text
            })
        
        responses = []
        for response in intent.responses:
            responses.append({
                'id': response.id,
                'text': response.text
            })
        
        result = {
            'id': intent.id,
            'name': intent.name,
            'description': intent.description,
            'patterns': patterns,
            'responses': responses,
            'created_at': intent.created_at.isoformat(),
            'updated_at': intent.updated_at.isoformat()
        }
        
        return jsonify(result)
    
    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': f'An error occurred while retrieving intent {intent_id}',
            'details': str(e)
        }), 500
    
    finally:
        if db_session is not None:
            db_session.close()

@api.route('/intent/<int:intent_id>', methods=['PUT'])
def update_intent(intent_id):
    db_session = None
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No data provided',
                'details': 'Request body must contain JSON data'
            }), 400
        
        # Validate required fields
        required_fields = ['name', 'description']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'error': 'Missing required fields',
                'details': f'The following fields are required: {", ".join(missing_fields)}'
            }), 400
            
        db_session = get_db_session()
        intent = db_session.query(Intent).filter_by(id=intent_id).first()
        
        if not intent:
            return jsonify({
                'error': 'Intent not found',
                'details': f'Intent with ID {intent_id} does not exist'
            }), 404
        
        # Check if new name conflicts with existing intent
        if 'name' in data and data['name'] != intent.name:
            existing_intent = db_session.query(Intent).filter_by(name=data['name']).first()
            if existing_intent:
                return jsonify({
                    'error': 'Intent name conflict',
                    'details': f'An intent with name "{data["name"]}" already exists'
                }), 409
        
        # Update intent properties
        intent.name = data.get('name', intent.name)
        intent.description = data.get('description', intent.description)
        intent.updated_at = datetime.now()
        
        # Update patterns
        if 'patterns' in data:
            if not isinstance(data['patterns'], list):
                db_session.rollback()
                return jsonify({
                    'error': 'Invalid patterns format',
                    'details': 'Patterns must be provided as a list'
                }), 400
            
            # Get existing pattern IDs
            existing_pattern_ids = [pattern.id for pattern in intent.patterns]
            updated_pattern_ids = []
            
            # Update or create patterns
            for pattern_data in data['patterns']:
                if not isinstance(pattern_data, dict) or 'text' not in pattern_data:
                    return jsonify({
                        'error': 'Invalid pattern format',
                        'details': 'Each pattern must be an object with a "text" field'
                    }), 400
                
                if pattern_data.get('id') and int(pattern_data['id']) in existing_pattern_ids:
                    # Update existing pattern
                    pattern = db_session.query(Pattern).filter_by(id=pattern_data['id']).first()
                    pattern.text = pattern_data['text']
                    updated_pattern_ids.append(pattern.id)
                else:
                    # Create new pattern
                    pattern = Pattern(intent_id=intent.id, text=pattern_data['text'])
                    db_session.add(pattern)
            
            # Delete patterns that were not updated
            for pattern_id in existing_pattern_ids:
                if pattern_id not in updated_pattern_ids:
                    db_session.query(Pattern).filter_by(id=pattern_id).delete()
        
        # Update responses
        if 'responses' in data:
            if not isinstance(data['responses'], list):
                return jsonify({
                    'error': 'Invalid responses format',
                    'details': 'Responses must be provided as a list'
                }), 400
            
            # Get existing response IDs
            existing_response_ids = [response.id for response in intent.responses]
            updated_response_ids = []
            
            # Update or create responses
            for response_data in data['responses']:
                if not isinstance(response_data, dict) or 'text' not in response_data:
                    return jsonify({
                        'error': 'Invalid response format',
                        'details': 'Each response must be an object with a "text" field'
                    }), 400
                
                if response_data.get('id') and int(response_data['id']) in existing_response_ids:
                    # Update existing response
                    response = db_session.query(Response).filter_by(id=response_data['id']).first()
                    response.text = response_data['text']
                    updated_response_ids.append(response.id)
                else:
                    # Create new response
                    response = Response(intent_id=intent.id, text=response_data['text'])
                    db_session.add(response)
            
            # Delete responses that were not updated
            for response_id in existing_response_ids:
                if response_id not in updated_response_ids:
                    db_session.query(Response).filter_by(id=response_id).delete()
        
        db_session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Intent {intent_id} updated successfully'
        })
    
    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': f'An error occurred while updating intent {intent_id}',
            'details': str(e)
        }), 500
    
    finally:
        if db_session is not None:
            db_session.close()

@api.route('/intent/<int:intent_id>', methods=['DELETE'])
def delete_intent(intent_id):
    db_session = None
    try:
        db_session = get_db_session()
        intent = db_session.query(Intent).filter_by(id=intent_id).first()
        
        if not intent:
            return jsonify({
                'error': f'Intent with ID {intent_id} not found'
            }), 404
        
        db_session.delete(intent)
        db_session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Intent {intent_id} deleted successfully'
        })
    
    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': f'An error occurred while deleting intent {intent_id}',
            'details': str(e)
        }), 500
    
    finally:
        if db_session is not None:
            db_session.close()

@api.route('/intent', methods=['POST'])
def create_intent():
    db_session = None
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'No data provided',
                'details': 'Request body must contain JSON data'
            }), 400

        # Validate required fields
        if 'name' not in data:
            return jsonify({
                'error': 'Missing required field',
                'details': 'The "name" field is required'
            }), 400

        db_session = get_db_session()

        # Check if intent with same name already exists
        existing_intent = db_session.query(Intent).filter_by(name=data['name']).first()
        if existing_intent:
            return jsonify({
                'error': 'Intent already exists',
                'details': f'An intent with name "{data["name"]}" already exists'
            }), 409

        # Create new intent
        intent = Intent(
            name=data['name'],
            description=data.get('description', '')
        )
        db_session.add(intent)
        db_session.flush()  # Flush to get the intent ID

        # Add patterns
        if 'patterns' in data:
            if not isinstance(data['patterns'], list):
                return jsonify({
                    'error': 'Invalid patterns format',
                    'details': 'Patterns must be provided as a list'
                }), 400
            for pattern_text in data['patterns']:
                if not isinstance(pattern_text, str):
                    return jsonify({
                        'error': 'Invalid pattern format',
                        'details': 'Each pattern must be a string'
                    }), 400
                pattern = Pattern(intent_id=intent.id, text=pattern_text)
                db_session.add(pattern)

        # Add responses
        if 'responses' in data:
            if not isinstance(data['responses'], list):
                return jsonify({
                    'error': 'Invalid responses format',
                    'details': 'Responses must be provided as a list'
                }), 400
            for response_text in data['responses']:
                if not isinstance(response_text, str):
                    return jsonify({
                        'error': 'Invalid response format',
                        'details': 'Each response must be a string'
                    }), 400
                response = Response(intent_id=intent.id, text=response_text)
                db_session.add(response)

        db_session.commit()

        return jsonify({
            'success': True,
            'message': 'Intent created successfully',
            'intent_id': intent.id
        })

    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': 'An error occurred while creating intent',
            'details': str(e)
        }), 500

    finally:
        if db_session is not None:
            db_session.close()

@api.route('/feedback', methods=['GET'])
def get_feedback():
    db_session = None
    try:
        db_session = get_db_session()
        feedback = db_session.query(Feedback).order_by(desc(Feedback.created_at)).all()
        
        result = []
        for fb in feedback:
            result.append({
                'id': fb.id,
                'message_id': fb.message_id,
                'rating': fb.rating,
                'comment': fb.comment,
                'created_at': fb.created_at.isoformat()
            })
        
        return jsonify(result)
    
    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': 'An error occurred while retrieving feedback',
            'details': str(e)
        }), 500
    
    finally:
        if db_session is not None:
            db_session.close()

@api.route('/train', methods=['POST'])
def train_model():
    try:
        # In a real application, this would trigger model training
        # For now, we'll just simulate a successful training
        
        return jsonify({
            'success': True,
            'message': 'Model trained successfully'
        })
    
    except Exception as e:
        return jsonify({
            'error': 'An error occurred while training the model',
            'details': str(e)
        }), 500

@api.route('/export', methods=['GET'])
def export_data():
    db_session = None
    try:
        db_session = get_db_session()
        
        # Get all intents with patterns and responses
        intents = db_session.query(Intent).all()
        
        export_data = []
        for intent in intents:
            intent_data = {
                'tag': intent.name,
                'patterns': [pattern.text for pattern in intent.patterns],
                'responses': [response.text for response in intent.responses],
                'description': intent.description
            }
            export_data.append(intent_data)
        
        # Create export file
        export_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'export.json')
        with open(export_path, 'w') as f:
            json.dump({'intents': export_data}, f, indent=4)
        
        # Send file to client
        return send_file(export_path, as_attachment=True, download_name='chatbot_data.json')
    
    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': 'An error occurred while exporting data',
            'details': str(e)
        }), 500
    
    finally:
        if db_session is not None:
            db_session.close()

@api.route('/import', methods=['POST'])
def import_data():
    db_session = None
    try:
        if 'file' not in request.files:
            return jsonify({
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({
                'error': 'No file selected'
            }), 400
        
        if not file.filename.endswith('.json'):
            return jsonify({
                'error': 'File must be a JSON file'
            }), 400
        
        # Read file content
        content = json.loads(file.read())
        if 'intents' not in content:
            return jsonify({
                'error': 'Invalid file format'
            }), 400
        
        db_session = get_db_session()
        
        # Process intents
        for intent_data in content['intents']:
            # Check if intent exists
            intent = db_session.query(Intent).filter_by(name=intent_data['tag']).first()
            
            if intent:
                # Update existing intent
                intent.description = intent_data.get('description', '')
                
                # Delete existing patterns and responses
                db_session.query(Pattern).filter_by(intent_id=intent.id).delete()
                db_session.query(Response).filter_by(intent_id=intent.id).delete()
            else:
                # Create new intent
                intent = Intent(
                    name=intent_data['tag'],
                    description=intent_data.get('description', '')
                )
                db_session.add(intent)
                db_session.flush()  # Flush to get the intent ID
            
            # Add patterns
            for pattern_text in intent_data.get('patterns', []):
                pattern = Pattern(intent_id=intent.id, text=pattern_text)
                db_session.add(pattern)
            
            # Add responses
            for response_text in intent_data.get('responses', []):
                response = Response(intent_id=intent.id, text=response_text)
                db_session.add(response)
        
        db_session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Data imported successfully'
        })
    
    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        return jsonify({
            'error': 'An error occurred while importing data',
            'details': str(e)
        }), 500
    
    finally:
        if db_session is not None:
            db_session.close()