from flask import Blueprint, jsonify, request, g
from marshmallow import validates_schema, ValidationError, fields
from config.models import Message, MessageSchema, User, UserSchema
from config.extensions import socketio
# from lib.secure_route import secure_route

blueprint = Blueprint('message', __name__)
message_schema = MessageSchema()


@blueprint.route('/messages', methods=['GET'])
def index():
    messages = Message.query.all()
    return message_schema.jsonify(messages, many=True), 200


@blueprint.route('/users/<int:user_id>/messages', methods=['GET'])
def show(user_id):
    messages = Message.query \
        .order_by(Message.created_at) \
        .filter(Message.owner_id == user_id).all()
    if not messages:
        return jsonify({'message': 'not found'}), 404
    return message_schema.jsonify(messages, many=True), 200


@blueprint.route('/users/<int:user_id>/messages', methods=['POST'])
def create(user_id):
    # print(request)
    data = request.get_json()
    # print('there is a new message', data)

    # Validate and deserialize input
    try:
        message = message_schema.load(data)
    except ValidationError as err:
        return err.messages, 422

    message.save()
    messages = Message.query \
        .order_by(Message.created_at) \
        .filter(Message.owner_id == user_id).all()
    
    # if we dont find any messages then something went wrong
    if not messages:
        return jsonify({'message': 'not found'}), 404
    
    # now all of that is done, ping it out if anyone is listening
    # decide if it is a user message, or a support message, and emit it appropriately
    # do this on the message schema not the raw data so that we have the optional field 'incoming' populated
    if message.incoming:
        socketio.emit('new support message', data)
    else:
        socketio.emit('new user message', data)

    # and finally return the response to the requestor
    return message_schema.jsonify(messages, many=True), 201


@blueprint.route('/users/<int:user_id>/messages/<int:message_id>/archive', methods=['POST'])
def archive(user_id, message_id):
    message = Message.query.get(message_id)
    if not message:
        return jsonify({'message': 'not found'}), 404
    if message.owner_id != user_id:
        return jsonify({'message': 'message does not belong to user'}), 422
    message.archived = not message.archived
    message.save()
    messages = Message.query \
        .order_by(Message.created_at) \
        .filter(Message.owner_id == user_id).all()
    if not messages:
        return jsonify({'message': 'not found'}), 404
    return message_schema.jsonify(messages, many=True), 201

# @blueprint.route('/cats/<int:cat_id>', methods=['PUT'])
# @secure_route
# def update(cat_id):
#     cat = Cat.query.get(cat_id)
#     if not cat:
#         return jsonify({'message': 'Not Found'}), 404
#     if cat.creator != g.current_user:
#         return jsonify({'message': 'Unauthorized'})
#     data = request.get_json()
#     errors = {}
#     if not is_unique(model=Cat, key='name', value=data.get('name')):
#         errors['name'] = errors.get('name', []) + ['Cat name already taken']
#         return jsonify(errors), 422
#     cat, errors = cat_schema.load(data, instance=cat, partial=True)
#     if errors:
#         return jsonify(errors), 422
#     cat.save()
#     return cat_schema.jsonify(cat), 202
