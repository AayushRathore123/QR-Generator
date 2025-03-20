from flask import request
from flask_restful import Resource
from boserver.service_handler.auth_handler import AuthHandler


# Method 2 - To make API Calls
class Login(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = AuthHandler()
        return obj.login(payload)
