from flask import make_response
from flask_jwt_extended import create_access_token
from boserver.resource_decorator import *
from service_handler.service_handler_imports import *


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
        data = obj.get_user_details(user_data["id"])
        auth_ret = {"msg": "Login Successfully", "errCode": 0, "access_token": access_token, "data_rec": data}
        resp = make_response(json.dumps(auth_ret))
        resp.headers.extend({"token": access_token})
        return resp


class Register(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = AuthHandler()
        return obj.register(payload)


class CreateQr(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = QrHandler()
        return obj.create_qr(payload)


class UpdateQr(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = QrHandler()
        return obj.update_qr(payload)


class RemoveQr(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = QrHandler()
        return obj.remove_qr(payload)


class GetAllQr(Resource):

    @staticmethod
    def get():
        # payload = request.args
        user_id = request.args["user_id"]
        obj = QrHandler()
        return obj.get_all_qr(user_id)


class CreateShortUrl(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = UrlHandler()
        return obj.create_short_url(payload)


class RedirectShortUrl(Resource):

    # Cannot use request.args["hash_value"] here as it is used when parameters are passed via the query string Ex: GET /endpoint?user_id=123
    # Whereas here parameters are passed as part of the route. Ex: GET /endpoint/hash_value OR GET /endpoint/SFNk
    @staticmethod
    def get(hash_value):
        obj = UrlHandler()
        return obj.redirect_to_long_url(hash_value)


class GetCaptchaCode(Resource):
    @staticmethod
    def get():
        obj = CaptchaHandler()
        return obj.get_captcha_code()


class ValidateCaptchaCode(Resource):

    @staticmethod
    def post():
        payload = request.get_json()
        obj = CaptchaHandler()
        return obj.validate_captcha_code(payload)
