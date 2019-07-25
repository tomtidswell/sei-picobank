from app import db, ma
from marshmallow import fields
from .base import BaseModel, BaseSchema
from .transaction_category import transactions_to_categories
# pylint: disable=W0611
from .user import User


class Account(db.Model, BaseModel):
    # database table
    __tablename__ = 'accounts'
    # fields
    type = db.Column(db.String(40), nullable=False)
    nickname = db.Column(db.String(40), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    # relationships
    owner = db.relationship('User', backref='accounts')

class AccountSchema(ma.ModelSchema, BaseSchema):
    class Meta:
        model = Account
    owner = fields.Nested('UserSchema', only=('id', 'email'))
    # include the backref fields
    transactions = fields.Nested('TransactionSchema', many=True, exclude=('created_at', 'account'))


class Transaction(db.Model, BaseModel):
    # database table
    __tablename__ = 'transactions'
    # fields
    date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'))
    description = db.Column(db.String(40), nullable=False)
    # relationships
    account = db.relationship('Account', backref='transactions')
    categories = db.relationship('TransCategory', secondary=transactions_to_categories, backref='transactions')

class TransactionSchema(ma.ModelSchema, BaseSchema):

    class Meta:
        model = Transaction
    # include the backref fields
    categories = fields.Nested('TransCategorySchema', many=True, exclude=('transactions',))
    date = fields.DateTime(format='%d/%m/%Y')
