from config.models import UserSchema, User
from marshmallow import validates_schema, ValidationError, fields
user_schema = UserSchema()

# try:
#     user1 = user_schema.load({
#         # 'username': 'Tommykins',
#         'email': 'tom@email',
#         'password': 'pass',
#         'password_confirmation': 'pass'
#     })
# except ValidationError as err:
#     print(err.messages)


# user2, errors = user_schema.load({
#     # 'username': 'Gfoec1',
#     'email': 'gfo@email',
#     'password': 'pass',
#     'password_confirmation': 'pass'
# })
# user3, errors = user_schema.load({
#     # 'username': 'support',
#     'email': 'support@email',
#     'password': 'pass',
#     'password_confirmation': 'pass',
#     'support': True
# })


# cheeseburger = Cat(name='Cheeseburger', age=1, image='image-url', bio='Large and in charge', breeds=[tuxedo, calico], creator=user1)

user1 = User(email='tom@email', password='pass')
user2 = User(email='gfo@email', password='pass')
user3 = User(email='support@email', password='pass', support=True)


# if errors:
#     raise Exception(errors)


users = [
    user1,
    user2,
    user3
]
