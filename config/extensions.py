from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy  # this is the equivalent of mongoose
from flask_marshmallow import Marshmallow
from flask_socketio import SocketIO, emit

bcrypt = Bcrypt()
db = SQLAlchemy()
ma = Marshmallow()
socketio = SocketIO()


