from .flask_app import api, app
from .app_resource import Login

api.add_resource(Login, '/login')