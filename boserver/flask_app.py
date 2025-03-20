from flask import Flask
from flask_restful import Api
from flask_cors import CORS


app = Flask(__name__)
# To allow cookies or authenticated requests, set supports_credentials = True
CORS(app, max_age = 1000, supports_credentials = True)
api = Api(app)
