import redis

class RedisCacheCore:
    def __init__(self, redis_host, redis_port, redis_db, redis_pwd):
        self.redis_obj = redis.StrictRedis(host=redis_host, port=redis_port, db=redis_db, password=redis_pwd)

    def get_cache_data(self, ident):
        cache_data = None
        try:
            cache_data = self.redis_obj.get(ident)
            if cache_data:
                cache_data = cache_data.decode("utf-8")
            print(type(cache_data))
            # cache_data = eval(cache_data) if cache_data else None
        except Exception as e:
            print(f"Exception getting cache data for {ident}")
            print(e)
        return cache_data

    def set_cache_data(self, ident, cache_data):
        self.redis_obj.set(ident, str(cache_data))
        print(type(self.redis_obj[ident]))

    def delete_cache_data(self, ident):
        self.redis_obj.delete(ident)
