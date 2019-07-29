from app import db, ma
from marshmallow import validates_schema, ValidationError, fields
from .base import BaseModel, BaseSchema
# pylint: disable=W0611
from .user import User

class Message(db.Model, BaseModel):
    # database table
    __tablename__ = 'messages'
    # fields
    text = db.Column(db.Text, nullable=False)
    archived = db.Column(db.Boolean, default=False)
    incoming = db.Column(db.Boolean)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # relationships
    owner = db.relationship('User', backref='messages')


class MessageSchema(ma.ModelSchema, BaseSchema):
    class Meta:
        model = Message

    owner_id = fields.String(required=True)
