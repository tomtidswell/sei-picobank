import os
from app import app
from controllers import auth, accounts, users, messages

app.register_blueprint(users.api, url_prefix='/api')
app.register_blueprint(auth.api, url_prefix='/api')
app.register_blueprint(accounts.api, url_prefix='/api')
app.register_blueprint(messages.api, url_prefix='/api')

# define our fallback routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if os.path.isfile('dist/' + path):
        return app.send_static_file(path)
    return app.send_static_file('index.html')