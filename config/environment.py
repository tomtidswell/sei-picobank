import os

# use the os to get the env variable, and if it isnt there, use the string
db_uri = os.getenv('DATABASE_URI', 'postgres://localhost:5432/picobank')
secret = os.getenv('SECRET', 'this is a secret, shush!')
