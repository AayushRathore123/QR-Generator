from .flask_app import api, app
from .app_resource import *

# Test API
api.add_resource(Foo, '/foo')

# AUTH API
api.add_resource(Login, '/login')
api.add_resource(LoginOAuth, '/oauth/login')
api.add_resource(OAuth2Callback, '/oauth2callback')
api.add_resource(Register, '/register')

# USER CRUD API
api.add_resource(GetUserDetails, '/user_details/get')
api.add_resource(UpdateUserDetails, '/user_details/update')
api.add_resource(UpdateUserPassword, '/user/update/password')

# QR CRUD API
api.add_resource(CreateQr, '/qr_code/create')
api.add_resource(UpdateQr, '/qr_code/update')
api.add_resource(RemoveQr, '/qr_code/remove')
api.add_resource(GetAllQr, '/qr_code/get_all')

# URL Shortener API
api.add_resource(CreateShortUrl, '/url_shortener/create')
api.add_resource(RedirectShortUrl, '/shortify/<string:hash_value>')

# Captcha API
api.add_resource(GetCaptchaCode, '/captcha_code/get')
api.add_resource(ValidateCaptchaCode, '/captcha_code/validate')

api.add_resource(ContactUs, '/contact_us')