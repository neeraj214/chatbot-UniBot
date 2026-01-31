from functools import wraps
from flask import request, jsonify, session
import jwt
from config import Config
from database.db_handler import get_db_session
from database.user_models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        # Check if token is in cookies
        if not token and request.cookies.get('token'):
            token = request.cookies.get('token')
            
        # Check if user is in session (for traditional server-rendered pages)
        if not token and 'user_id' in session:
            # Allow session-based auth to pass through
            return f(*args, **kwargs)
            
        if not token:
            return jsonify({
                'success': False,
                'message': 'Authentication token is missing'
            }), 401
            
        try:
            # Decode the token
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            
            # Get user from database
            db_session = get_db_session()
            current_user = db_session.query(User).filter_by(id=data['user_id']).first()
            db_session.close()
            
            if not current_user:
                return jsonify({
                    'success': False,
                    'message': 'Invalid authentication token'
                }), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({
                'success': False,
                'message': 'Authentication token has expired'
            }), 401
        except jwt.InvalidTokenError:
            return jsonify({
                'success': False,
                'message': 'Invalid authentication token'
            }), 401
            
        # Pass the current user to the route
        return f(current_user=current_user, *args, **kwargs)
        
    return decorated