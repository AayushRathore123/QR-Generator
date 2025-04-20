from boserver.flask_app import app

app.config.from_object("config.Config")

CAPTCHA_LENGTH = app.config["CAPTCHA_LENGTH"]
CAPTCHA_IMG_PATH = app.config["CAPTCHA_IMG_PATH"]

