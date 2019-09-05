from datetime import datetime, timedelta
from marshmallow import validates_schema, ValidationError, fields
import jwt
# this allows us to create virtual (hybrid) fields that arent saved but are included on the interface
from sqlalchemy.ext.hybrid import hybrid_property


from config.extensions import bcrypt, db, ma
from config.environment import secret

# pylint: disable=C0413, W0611
Column = db.Column
String = db.String
Integer = db.Integer
Boolean = db.Boolean
DateTime = db.DateTime
Table = db.Table
ForeignKey = db.ForeignKey
relationship = db.relationship


# this is a helper file which enriches the main classes with additional capability to keep the main code readable

class BaseModel:
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    #create a function which can shorten our save and delete processes
    def save(self):
        self.updated_at = datetime.utcnow()
        db.session.add(self)
        db.session.commit()

    def remove(self):
        db.session.delete(self)
        db.session.commit()


class BaseSchema:
    created_at = fields.DateTime(format='%Y-%m-%d %H:%M:%S')
    updated_at = fields.DateTime(format='%Y-%m-%d %H:%M:%S')


class User(db.Model, BaseModel):
    __tablename__ = 'users'
    email = Column(String(128), nullable=False, unique=True)
    password_hash = Column(String(128), nullable=False)

    #this allows us to use the hybrid property password, which will be passed to sqlalchemy from the marshmallow schema now it's defined
    @hybrid_property
    def password(self):
        pass

    #this sets the hybrid property
    @password.setter
    def password(self, plaintext):
        #this is the field password_hash being set with the hashed password
        self.password_hash = bcrypt.generate_password_hash(
            plaintext).decode('utf-8')

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
            raise ValidationError('Passwords do not match',
                                  'password_confirmation')

    @validates_schema
    def additional_request_validation(self, data):
        if data.get('password') == '':
            raise ValidationError('Password cannot be blank', 'password')

    #define these virtual fields on the JSON schema which we dont have on the database schema
    password = fields.String(required=True)
    password_confirmation = fields.String(required=True)
    accounts = fields.Nested('AccountSchema', many=True,
                             only=('type', 'id', 'nickname'))
    messages = fields.Nested('MessageSchema', many=True)

    class Meta:
        model = User
        exclude = ('password_hash',)


class Account(db.Model, BaseModel):
    # database table
    __tablename__ = 'accounts'
    # fields
    type = Column(String(40), nullable=False)
    nickname = Column(String(40), nullable=True)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    # relationships
    owner = relationship('User', backref='accounts')


class AccountSchema(ma.ModelSchema, BaseSchema):
    class Meta:
        model = Account
    owner = fields.Nested('UserSchema', only=('id', 'email'))
    # include the backref fields
    transactions = fields.Nested(
        'TransactionSchema', many=True, exclude=('created_at', 'account'))

# JOIN DEFINITION to TRANSACTIONS
# this is a many to many relationship so is created differently to a one to many relationship like comments
transactions_to_categories = Table(
    'transactions_to_categories',
    Column('transaction_id', Integer, ForeignKey('transactions.id')),
    Column('transaction_category_id', Integer,
              ForeignKey('transaction_categories.id'))
)


#this is a many to many relationship to the cats
class TransCategory(db.Model):
    __tablename__ = 'transaction_categories'
    id = Column(Integer, primary_key=True)
    category = Column(String(40), unique=True, nullable=False)
    colour = Column(String(7), nullable=False)


class TransCategorySchema(ma.ModelSchema):
    class Meta:
        model = TransCategory
    #this causes a recursion error, so we need to exclude categories (its self) so that the transaction and category schemas dont continually refer back to each other and include an infinite list of each other. Here, we've only included the id and name of the category
    transactions = fields.Nested(
        'TransactionSchema', many=True, only=('id', 'description'))



class Transaction(db.Model, BaseModel):
    # database table
    __tablename__ = 'transactions'
    # fields
    date = Column(db.Date, nullable=True)
    amount = Column(db.Float, nullable=False)
    account_id = Column(Integer, ForeignKey('accounts.id'))
    description = Column(String(40), nullable=False)
    # relationships
    account = relationship('Account', backref='transactions')
    categories = relationship(
        'TransCategory', secondary=transactions_to_categories, backref='transactions')


class TransactionSchema(ma.ModelSchema, BaseSchema):
    class Meta:
        model = Transaction
    # include the backref fields
    categories = fields.Nested(
        'TransCategorySchema', many=True, exclude=('transactions',))
    date = fields.DateTime(format='%d/%m/%Y')
    formalDate = fields.Function(lambda obj: obj.date.strftime("%Y-%m-%d"))



# pylint: disable=W0611


class Message(db.Model, BaseModel):
    # database table
    __tablename__ = 'messages'
    # fields
    text = Column(db.Text, nullable=False)
    archived = Column(Boolean, default=False)
    incoming = Column(Boolean)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    # relationships
    owner = relationship('User', backref='messages')


class MessageSchema(ma.ModelSchema, BaseSchema):
    class Meta:
        model = Message

    owner_id = fields.String(required=True)
