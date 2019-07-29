from flask import Blueprint, jsonify, request, g
from models.user import User, UserSchema
from lib.secure_route import secure_route

# from lib.secure_route import secure_route


api = Blueprint('users', __name__)
user_schema = UserSchema(exclude=('password', 'id', 'updated_at', 'messages'))


# ROUTES FOR USERS TO ACCESS

@api.route('/users/<int:user_id>', methods=['GET'])
@secure_route
def show(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'not found'}), 404
    return user_schema.jsonify(user, many=False), 200


# ROUTES FOR SUPPORT CENTRE ACCESS

@api.route('/users', methods=['GET'])
def index():
    # redefine the account schema so that we exclude the transactions when we are looking at the index - this will improve performance
    users = User.query.all()
    return user_schema.jsonify(users, many=True), 200
