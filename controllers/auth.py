from flask import Blueprint, jsonify, request, g
# we need: Blueprint to create the auth route
#          jsonify to serialise and send the response when we arent using the schema to do that
#          request to access the request data
from config.models import User, UserSchema
from marshmallow import ValidationError


#these controllers should be kept as 'skinny' as possible so they are easy to understand. Any additional functions we need to write, should be written in the model and used from here

blueprint = Blueprint('auth', __name__)
user_schema = UserSchema()


@blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    try:
        user = user_schema.load(data)
    except ValidationError as errors:
        return jsonify({'errors': errors.messages}), 422

    user.save()
    return jsonify({'message': 'Registration Successful'}), 201


@blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first() #this query will return as a list from the database, even though it is only returning one item, so we just make sure we are using the first item
    if not user or not user.validate_password(data['password']):
        return jsonify({'message': 'Unauthorised'}), 401
    return jsonify({
        'token': user.generate_token(),
        'message': f'Welcome back {user.email}'
    }), 200
