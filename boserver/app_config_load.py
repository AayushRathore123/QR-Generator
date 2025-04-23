from boserver.flask_app import app


APP_HOST = app.config["HOST"]
APP_PORT = app.config["PORT"]

DB_USERNAME = app.config["DB_USERNAME"]
DB_PWD = app.config["DB_PWD"]
DB_HOST = app.config["DB_HOST"]
DB_NAME = app.config["DB_NAME"]

CAPTCHA_LENGTH = app.config["CAPTCHA_LENGTH"]
CAPTCHA_IMG_PATH = app.config["CAPTCHA_IMG_PATH"]

