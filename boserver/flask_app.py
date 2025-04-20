from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from boserver.rediscacher.redis_cache_core import RedisCacheCore


app = Flask(__name__)
# To allow cookies or authenticated requests, set supports_credentials = True
CORS(app, max_age = 1000, supports_credentials = True)
api = Api(app)

# Cannot write in app_conf_load due to circular import
app.config.from_object("config.Config")
redis_host = app.config["REDIS_HOST"]
redis_pwd = app.config["REDIS_PWD"]
redis_db = app.config["REDIS_DB"]
redis_port = app.config["REDIS_PORT"]
redis_cache_obj = RedisCacheCore(redis_host, redis_port, redis_db, redis_pwd)
