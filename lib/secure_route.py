from functools import wraps #wraps allows us to correct the way errors are reported using decorators
import jwt
from flask import request, jsonify, g
from models.user import User
from config.environment import secret

def secure_route(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if 'Authorization' not in request.headers:
            return jsonify({'message': 'Unauthorised'}), 401
        token = request.headers.get('Authorization').replace('Bearer ', '')

        #what follows is the equivalent of a try/catch - it works like a switch/case statement, matching thriwn exceptions to except statements
        try:
            payload = jwt.decode(token, secret)
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token Expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid Token'}), 401

        user = User.query.get(payload.get('sub'))

        if not user:
            return jsonify({'message': 'Unauthorised'}), 401

        #g is the flask globals
        g.current_user = user

        return func(*args, **kwargs)

    return wrapper
