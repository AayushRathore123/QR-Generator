from .flask_app import api, app
from .app_resource import *

# Test API
api.add_resource(Foo, '/foo')

# AUTH API
api.add_resource(Login, '/login')
api.add_resource(Register, '/register')

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
