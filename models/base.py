from datetime import datetime
from app import db
from marshmallow import fields

# this is a helper file which enriches the main classes with additional capability to keep the main code readable

class BaseModel:
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

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
