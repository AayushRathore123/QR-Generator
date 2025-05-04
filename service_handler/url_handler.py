from dbserver.app_orm import orm_to_dict_v2
from coreclasses.url import Url
from flask import redirect


class UrlHandler:

    @staticmethod
    def create_short_url(payload):
        long_url = payload['url']
        url_obj = Url()

        # Check if already exist in DB
        rec = url_obj.get_rec(long_url=long_url)
        if rec:
            return {"errCode": 0, "msg": "Successfully fetched data", "datarec": orm_to_dict_v2(rec)}

        rec = url_obj.create_rec(long_url)
        saved_data = url_obj.save()
        if saved_data["errCode"]:
            return saved_data
        saved_data.update({"datarec": orm_to_dict_v2(rec)})
        return saved_data

    @staticmethod
    def redirect_to_long_url(hash_value):
        url_obj = Url()
        rec = url_obj.get_rec(short_url_hash_value=hash_value)
        if rec:
            return redirect(rec.long_url)
            # return {'errCode': 0, 'msg': 'Redirected to original URL Done', 'datarec': orm_to_dict_v2(rec)}
        return {'errCode': 1, 'msg': f'Record not found for hash value: {hash_value}'}
