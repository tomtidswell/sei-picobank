from models.user import UserSchema
user_schema = UserSchema()

user1, errors = user_schema.load({
    'username': 'Tommykins',
    'email': 'tom@email',
    'password': 'pass',
    'password_confirmation': 'pass'
})
user2, errors = user_schema.load({
    'username': 'Gfoec1',
    'email': 'gfo@email',
    'password': 'pass',
    'password_confirmation': 'pass'
})

if errors:
    raise Exception(errors)


users = [
    user1,
    user2
]
