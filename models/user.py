from datetime import datetime, timedelta
import jwt
from sqlalchemy.ext.hybrid import hybrid_property # this allows us to create virtual (hybrid) fields that arent saved but are included on the interface
from marshmallow import validates_schema, ValidationError, fields
from app import db, ma, bcrypt
from config.environment import secret
from .base import BaseModel, BaseSchema

class User(db.Model, BaseModel):
    __tablename__ = 'users'
    email = db.Column(db.String(128), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)

    #this allows us to use the hybrid property password, which will be passed to sqlalchemy from the marshmallow schema now it's defined
    @hybrid_property
    def password(self):
        pass

    #this sets the hybrid property
    @password.setter
    def password(self, plaintext):
        #this is the field password_hash being set with the hashed password
        self.password_hash = bcrypt.generate_password_hash(plaintext).decode('utf-8')

    #this is the definition of a function which we can use later to validate a password.
    # self is the first argument here and doesnt need to be passed in when calling the function - this is because it is a class, and is the behaviour for methods in any class
    def validate_password(self, plaintext):
        return bcrypt.check_password_hash(self.password_hash, plaintext)

    def generate_token(self):
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow(),
            'sub': self.id
        }
        #encode the data and into the token using the secret and the hs256 algorithm, and then convert it to utf-8 for transmission
        token = jwt.encode(payload, secret, 'HS256').decode('utf-8')
        return token


#the schema helps us with the conversion into JSON
class UserSchema(ma.ModelSchema, BaseSchema):

    @validates_schema
    def check_passwords_match(self, data):
        if data.get('password') != data.get('password_confirmation'):
            #use marshmallow's extension to raise the error for field password_confirmation
            raise ValidationError('Passwords do not match', 'password_confirmation')

    @validates_schema
    def additional_request_validation(self, data):
        if data.get('password') == '':
            raise ValidationError('Password cannot be blank', 'password')

    #define these virtual fields on the JSON schema which we dont have on the database schema
    password = fields.String(required=True)
    password_confirmation = fields.String(required=True)

    accounts = fields.Nested('AccountSchema', many=True, only=('type', 'id', 'nickname'))


    class Meta:
        model = User
        exclude = ('password_hash',)
