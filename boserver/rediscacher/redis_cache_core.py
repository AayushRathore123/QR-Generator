import redis


class RedisCacheCore:
    def __init__(self, redis_host, redis_port, redis_db, redis_pwd):
        self.redis_obj = redis.StrictRedis(host=redis_host, port=redis_port, db=redis_db, password=redis_pwd)

    def get_cache_data(self, ident):
        """
            Redis stores everything as bytes/strings. So, When retrieving it, we always get a bytes object,
            which need to decode('utf-8') in case of string datatype or eval() in case of int or dict datatype
        """
        try:
            cache_data = self.redis_obj.get(ident)
            if not cache_data:
                return None

            # To handle datatype like dict, int, etc
            try:
                return eval(cache_data)
            except:
                pass

            # To handle string datatype
            try:
                return cache_data.decode('utf-8')
            except:
                raise Exception(f"Unable to decode or evaluates cache data for {ident}")
        except Exception as e:
            print(f"Exception getting cache data for {ident}")
            print(str(e))

    def set_cache_data(self, ident, cache_data):
        self.redis_obj.set(ident, str(cache_data))

    def delete_cache_data(self, ident):
        self.redis_obj.delete(ident)
