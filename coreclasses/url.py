import math
import random
import base62
import uuid
from boserver.app_orm import session, TableUrlShortener
from boserver.flask_app import app
from boserver.json_helper import ReturnJSON


class Url:
    def __init__(self):
        self.session = session
        self.ret_json = ReturnJSON()
        self.base_url = f"http://{app.config['HOST']}:{app.config['PORT']}/shortify/"


    def save(self):
        try:
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            self.ret_json.set_error_msg(1, str(e))
            return self.ret_json
        self.ret_json.set_success_msg("Successfully Saved Data.")
        return self.ret_json

    def get_rec(self, long_url=None, short_url_hash_value=None):
        rec = None
        if long_url:
            rec = self.session.query(TableUrlShortener).filter(TableUrlShortener.long_url == long_url,
                                                           TableUrlShortener.status == 1).first()
        elif short_url_hash_value:
            # short_url = self.base_url + short_url_hash_value
            # rec = self.session.query(TableUrlShortener).filter(TableUrlShortener.short_url == short_url,
            #                                                    TableUrlShortener.status == 1).first()
            rec = self.session.query(TableUrlShortener).filter(
                TableUrlShortener.short_url.endswith(short_url_hash_value), TableUrlShortener.status == 1).first()
        return rec

    @staticmethod
    def base62_encode(numeric_id):
        """
            Used to convert numeric_id into hashed value
        """
        chars = "012345789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        result = ""
        while numeric_id:
            remainder = numeric_id % 62
            result = chars[remainder] + result
            numeric_id //= 62
        return result

    @staticmethod
    def generate_numeric_id(my_uuid):
        """
            Converting uuid to unique numeric_id
            Acc. to base62 concept, mappings are: 0–0, …, 9–9, 10-a, 11-b, …, 35-z, 36-A, …, 61-Z
            But we are doing as 0–0, …, 9–9, 11-A, …, 36-Z, 73-a, 74-b, …, 98-z

            For a-z, we can add +37 But doing +73 ensures better separation and avoids numeric overlap between character
            types. It gives uniqueness and range separation in URL shortening
        """
        numeric_id = 1
        for char in my_uuid:
            ascii_code = ord(char)
            # ascii for digits (0-9) is 48-57 but in range(48,58) is written as it doesn't include 58. Similarly, for others
            if ascii_code in range(48, 58):     # digits 0-9
                numeric_id += ascii_code - 48
            elif ascii_code in range(65, 91):   # A-Z
                numeric_id += ascii_code - 65 + 11
            elif ascii_code in range(97, 123):  # a-z
                numeric_id += ascii_code - 97 + 73

        random_num = math.ceil(random.random() * 100) * 23 * 7
        numeric_id *= random_num
        return numeric_id

    def generate_short_url(self):
        """
            1. Generate uuid and convert uuid to unique numeric_id
            2. Generate short hashValue using base62 conversion
            3. Generate own short url from this hashValue
        """
        my_uuid = uuid.uuid4() # It returns <class 'uuid.UUID'> and 'UUID' object is not iterable, so convert into str
        my_uuid = str(my_uuid)
        numeric_id = self.generate_numeric_id(my_uuid)
        # hashed_value = self.base62_encode(numeric_id)  # manually function
        hashed_value = base62.encode(numeric_id)
        short_url = self.base_url + hashed_value

        return short_url

    def create_rec(self, long_url):
        short_url = self.generate_short_url()
        payload = {"long_url": long_url, "short_url": short_url, "status": 1}

        url_rec = TableUrlShortener(**payload)
        self.session.add(url_rec)
        self.session.flush()
        return url_rec
