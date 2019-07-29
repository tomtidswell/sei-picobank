from app import app
from controllers import auth, accounts, users, messages

app.register_blueprint(users.api, url_prefix='/api')
app.register_blueprint(auth.api, url_prefix='/api')
app.register_blueprint(accounts.api, url_prefix='/api')
app.register_blueprint(messages.api, url_prefix='/api')
