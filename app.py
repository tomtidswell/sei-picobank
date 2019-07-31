from flask import Flask #this is the equivalent of express
from flask_sqlalchemy import SQLAlchemy #this is the equivalent of mongoose
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from config.environment import db_uri

app = Flask(__name__, static_folder='dist')
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #speeds up the running of the app by removing modification tracking

db = SQLAlchemy(app) #so db is now SQLAlchemy, invoking the flask app
ma = Marshmallow(app)
bcrypt = Bcrypt(app)

# pylint: disable=C0413, W0611
from config import router
