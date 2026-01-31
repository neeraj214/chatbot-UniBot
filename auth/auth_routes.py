from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from database.db_handler import get_db_session
from database.user_models import User
from config import Config

# Create blueprint for authentication routes
auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    db_session = None
    try:
        # Ensure we can parse the request body as JSON
        try:
            data = request.get_json()
            if data is None:
                return jsonify({
                    'success': False,
                    'message': 'Invalid JSON in request body'
                }), 400
        except Exception as e:
            return jsonify({
                'success': False,
                'message': f'Error parsing JSON: {str(e)}'
            }), 400
        
        # Validate request data
        if not data or not data.get('username') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Missing username or password'
            }), 400
        
        username = data.get('username')
        password = data.get('password')
        
        # Get database session
        db_session = get_db_session()
        
        # Find user by username
        user = db_session.query(User).filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({
                'success': False,
                'message': 'Invalid username or password'
            }), 401
        
        # Update last login time
        user.last_login = datetime.datetime.now()
        db_session.commit()
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user.id,
            'username': user.username,
            'exp': datetime.datetime.now() + datetime.timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm='HS256')
        
        # Set session
        session['user_id'] = user.id
        
        # Return user data and token
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            },
            'token': token
        })
    
    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        # Log the error for server-side debugging
        print(f"Login error: {str(e)}")
        # Return a more user-friendly error message
        return jsonify({
            'success': False,
            'message': 'Login failed. Please try again later.'
        }), 500
    
    finally:
        if db_session is not None:
            db_session.close()

@auth.route('/signup', methods=['POST'])
def signup():
    db_session = None
    try:
        # Ensure we can parse the request body as JSON
        try:
            data = request.get_json()
            if data is None:
                return jsonify({
                    'success': False,
                    'message': 'Invalid JSON in request body'
                }), 400
        except Exception as e:
            return jsonify({
                'success': False,
                'message': f'Error parsing JSON: {str(e)}'
            }), 400
        
        # Validate request data
        if not data or not data.get('username') or not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        # Get database session
        db_session = get_db_session()
        
        # Check if username already exists
        existing_user = db_session.query(User).filter_by(username=username).first()
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'Username already exists'
            }), 409
        
        # Check if email already exists
        existing_email = db_session.query(User).filter_by(email=email).first()
        if existing_email:
            return jsonify({
                'success': False,
                'message': 'Email already exists'
            }), 409
        
        # Create new user
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        
        db_session.add(new_user)
        db_session.commit()
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': new_user.id,
            'username': new_user.username,
            'exp': datetime.datetime.now() + datetime.timedelta(hours=24)
        }, Config.SECRET_KEY, algorithm='HS256')
        
        # Set session
        session['user_id'] = new_user.id
        
        # Return user data and token
        return jsonify({
            'success': True,
            'message': 'Signup successful',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email
            },
            'token': token
        })
    
    except Exception as e:
        if db_session is not None:
            db_session.rollback()
        # Log the error for server-side debugging
        print(f"Signup error: {str(e)}")
        # Return a more user-friendly error message
        return jsonify({
            'success': False,
            'message': 'Signup failed. Please try again later.'
        }), 500
    
    finally:
        if db_session is not None:
            db_session.close()

@auth.route('/logout', methods=['POST'])
def logout():
    try:
        # Clear session
        session.pop('user_id', None)
        
        return jsonify({
            'success': True,
            'message': 'Logout successful'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Logout failed: {str(e)}'
        }), 500

@auth.route('/check', methods=['GET'])
def check_auth():
    try:
        if 'user_id' in session:
            db_session = get_db_session()
            user = db_session.query(User).filter_by(id=session['user_id']).first()
            db_session.close()
            
            if user:
                return jsonify({
                    'success': True,
                    'authenticated': True,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }
                })
        
        return jsonify({
            'success': True,
            'authenticated': False
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Authentication check failed: {str(e)}'
        }), 500