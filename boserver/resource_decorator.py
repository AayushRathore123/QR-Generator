from datetime import timedelta
from functools import wraps
import flask
from flask import request
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
# from flask_restful import Resource as FlaskResource
import flask_restful as restful
from jwt import ExpiredSignatureError, DecodeError, InvalidTokenError, InvalidIssuerError, InvalidAudienceError
import json

from boserver.app_routes import app


TOKEN_NOT_PRESENT = ['/login', '/register', '/foo', '/shortify']
app.config.from_object("config.Config")
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=36000)

jwt = JWTManager(app)

def get_user_data_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if request.path in TOKEN_NOT_PRESENT or request.path.startswith('/shortify'):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                return {"errCode":90, "msg": "Some Internal Error", "operror":str(e)}

        @jwt_required()
        def get_user_info_func():
            # _user_data = get_jwt_identity()
            _user_data = json.loads(get_jwt_identity())
            return _user_data

        try:
            flask.g.u_dict = get_user_info_func()
            return  func(*args, **kwargs)
        except (ExpiredSignatureError, DecodeError, InvalidTokenError, InvalidIssuerError, InvalidAudienceError) as e:
            return {"errCode": 96, "msg": "Session Expired, please login again", "operror": str(e)}
        except Exception as e:
            return {"errCode":90, "msg": "Some Internal Error", "operror":str(e)}
    return wrapper

class Resource(restful.Resource):
    method_decorators = [get_user_data_decorator]
