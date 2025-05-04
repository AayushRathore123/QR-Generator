from backend.dbserver.flask_app import app


APP_HOST = app.config["HOST"]
APP_PORT = app.config["PORT"]

DB_USERNAME = app.config["DB_USERNAME"]
DB_PWD = app.config["DB_PWD"]
DB_HOST = app.config["DB_HOST"]
DB_NAME = app.config["DB_NAME"]

CAPTCHA_LENGTH = app.config["CAPTCHA_LENGTH"]
CAPTCHA_IMG_PATH = app.config["CAPTCHA_IMG_PATH"]

EMAIL_TO = app.config["EMAIL_TO"]
EMAIL_PASSWORD = app.config["EMAIL_PASSWORD"]
SMTP_SERVER = app.config["SMTP_SERVER"]
SMTP_PORT = app.config["SMTP_PORT"]
EMAIL_SUBJECT = app.config["EMAIL_SUBJECT"]

SECRET_KEY = app.config["SECRET_KEY"]

OAUTH2_PROVIDERS = app.config["OAUTH2_PROVIDERS"]
OAUTH_GOOGLE_CONF_URL = app.config["OAUTH_GOOGLE_CONF_URL"]