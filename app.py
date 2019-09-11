import os
from flask import Flask #this is the equivalent of express
from config.environment import db_uri
from config.extensions import bcrypt, db, ma, socketio, emit
from controllers import auth, accounts, users, messages
# pylint: disable=C0413, W0611


def create_app():
    app = Flask(__name__, static_folder='dist')
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    #speeds up the running of the app by removing modification tracking
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    register_extensions(app)
    register_blueprints(app)
    register_sockets(app)
    return app


def register_extensions(app):
    """Register Flask extensions."""
    async_mode = None
    bcrypt.init_app(app)
    db.init_app(app)
    ma.init_app(app)
    socketio.init_app(app, async_mode=async_mode)
    return None


def register_blueprints(app):
    """Register Flask blueprints."""
    # add a ping route
    @app.route('/api/ping', methods=['GET'])
    def ping():
        print('there was a ping')
        socketio.emit('ping event', {'data': 42}, namespace='/test')
        return '', 200

    app.register_blueprint(users.blueprint, url_prefix='/api')
    app.register_blueprint(auth.blueprint, url_prefix='/api')
    app.register_blueprint(accounts.blueprint, url_prefix='/api')
    app.register_blueprint(messages.blueprint, url_prefix='/api')

    @app.route('/', defaults={'path': ''})  # homepage
    @app.route('/<path:path>')  # any other path
    def catch_all(path):
        print('Request path: ', path)
        if os.path.isfile('dist/' + path):  # if path is a file, send it back
            return app.send_static_file(path)
        # otherwise send back the index.html file
        return app.send_static_file('index.html')
    return None


def register_sockets(app):
    """Register socket.io events"""

    # Handles the default namespace
    @socketio.on_error()       
    def error_handler(e):
        print('Error: ', e)

    @socketio.on('connect', namespace='/test')
    def test_connect():
        print('Client connected')
        # emit('my response', {'data': 'Connected'})

    @socketio.on('disconnect', namespace='/test')
    def test_disconnect():
        print('Client disconnected')

    @socketio.on('incoming message', namespace='')
    def test_msg_in(args):
        print('we just got a message', args)
        emit('successfully saved', {
             'result': 'saved in server',
             'message': args
        })
    return None 


new_app = create_app()


if __name__ == '__main__':
    socketio.run(new_app)
