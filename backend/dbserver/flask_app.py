from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from dbserver.app_config_load import REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PWD, SECRET_KEY
from dbserver.rediscacher.redis_cache_core import RedisCacheCore


app = Flask(__name__)
# To allow cookies or authenticated requests, set supports_credentials = True
CORS(app, max_age = 1000, supports_credentials = True)
api = Api(app)
"""
When using config.py, cannot write in app_conf_load due to circular import
app.config.from_object("config.Config")
redis_host = app.config["REDIS_HOST"]
redis_pwd = app.config["REDIS_PWD"]
redis_db = app.config["REDIS_DB"]
redis_port = app.config["REDIS_PORT"]
"""
app.config["SECRET_KEY"] = SECRET_KEY
redis_cache_obj = RedisCacheCore(REDIS_HOST, REDIS_PORT, REDIS_DB, REDIS_PWD)

oauth = OAuth(app)
