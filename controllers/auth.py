from flask import Blueprint, jsonify, request, g
# we need: Blueprint to create the auth route
#          jsonify to serialise and send the response when we arent using the schema to do that
#          request to access the request data
from models.user import User, UserSchema


#these controllers should be kept as 'skinny' as possible so they are easy to understand. Any additional functions we need to write, should be written in the model and used from here

api = Blueprint('auth', __name__)
user_schema = UserSchema()


@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user, errors = user_schema.load(data) #validate the data against the schema
    if errors:
        return jsonify(errors), 422
    user.save()
    return jsonify({'message': 'Registration Successful'}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first() #this query will return as a list from the database, even though it is only returning one item, so we just make sure we are using the first item
    if not user or not user.validate_password(data['password']):
        return jsonify({'message': 'Unauthorised'}), 401
    return jsonify({
        'token': user.generate_token(),
        'message': f'Welcome back {user.email}'
    }), 200
