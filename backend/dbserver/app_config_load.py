# from dbserver.flask_app import app
import os
from dotenv import load_dotenv
load_dotenv()

"""
IGNORE, Used only when using config.py

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

OAUTH2_GOOGLE_PROVIDERS_CLIENT_ID = app.config["OAUTH2_GOOGLE_PROVIDERS_CLIENT_ID"]
OAUTH2_GOOGLE_PROVIDERS_CLIENT_SECRET = app.config["OAUTH2_GOOGLE_PROVIDERS_CLIENT_SECRET"]
OAUTH_GOOGLE_CONF_URL = app.config["OAUTH_GOOGLE_CONF_URL"]
"""
# Note: os.getenv() always returns strings
APP_HOST = os.environ.get("APP_HOST", "0.0.0.0")
APP_PORT = int(os.environ.get("APP_PORT", 5011))

DB_USERNAME = os.getenv("DB_USERNAME")
DB_PWD = os.getenv("DB_PWD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

CAPTCHA_LENGTH = int(os.getenv("CAPTCHA_LENGTH"))
CAPTCHA_IMG_PATH = os.getenv("CAPTCHA_IMG_PATH")

EMAIL_TO = os.getenv("EMAIL_TO")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
EMAIL_SUBJECT = os.getenv("EMAIL_SUBJECT")

SECRET_KEY = os.getenv("SECRET_KEY")

OAUTH2_GOOGLE_PROVIDERS_CLIENT_ID = os.getenv("OAUTH2_GOOGLE_PROVIDERS_CLIENT_ID")
OAUTH2_GOOGLE_PROVIDERS_CLIENT_SECRET = os.getenv("OAUTH2_GOOGLE_PROVIDERS_CLIENT_SECRET")
OAUTH_GOOGLE_CONF_URL = os.getenv("OAUTH_GOOGLE_CONF_URL")

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PWD = os.getenv("REDIS_PWD")
REDIS_DB = os.getenv("REDIS_DB")
REDIS_PORT = os.getenv("REDIS_PORT")