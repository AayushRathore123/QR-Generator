from flask import request
from flask_restful import Resource
from boserver.service_handler.auth_handler import AuthHandler


''' 
In Login class, the Resource parameter is used to provide a structured way to handle HTTP methods such as GET, POST, 
PUT, DELETE. Resource is a base class that Flask-RESTful extend.
'''
# Method 2 - To make API Calls
class Login(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = AuthHandler()
        return obj.login(payload)


class Register(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = AuthHandler()
        return obj.register(payload)
