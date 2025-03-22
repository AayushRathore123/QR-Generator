from .flask_app import api, app
from .app_resource import Login, Register

api.add_resource(Login, '/login')
api.add_resource(Register, '/register')
