from flask import make_response
from flask_jwt_extended import create_access_token
from boserver.resource_decorator import *
from boserver.service_handler.auth_handler import AuthHandler

# Method 2 - To make API Calls
class Foo(Resource):

    @staticmethod
    def post():
        return {"msg":"inside foo post "}


''' 
In Login class, the Resource parameter is used to provide a structured way to handle HTTP methods such as GET, POST, 
PUT, DELETE. Resource is a base class that Flask-RESTful extend.
'''
class Login(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = AuthHandler()
        user_resp = obj.login(payload)
        if user_resp.get('errCode')!=0:
            return user_resp
        user_data = user_resp['data_rec']
        access_token = create_access_token(identity=json.dumps({"user_name": user_data["user_name"],
                                                     "user_id":user_data["id"]}))
        # access_token = create_access_token(identity={"user_name": user_data["user_name"],"user_id":user_data["id"]})
        auth_ret = {"msg": "Login Successful", "errCode": 0, "access_token": access_token }
        resp = make_response(json.dumps(auth_ret))
        resp.headers.extend({"token": access_token})
        return resp

class Register(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = AuthHandler()
        return obj.register(payload)
