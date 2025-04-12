from boserver.app_orm import orm_to_dict_v2
from coreclasses.url import Url


class UrlHandler:

    @staticmethod
    def create_short_url(payload):
        long_url = payload['url']
        url_obj = Url()

        # Check if already exist in DB
        rec = url_obj.get_rec(long_url)
        if rec:
            return {'errCode': 0, 'msg': orm_to_dict_v2(rec)}

        rec = url_obj.create_rec(long_url)
        saved_data = url_obj.save()
        if saved_data["errCode"]:
            return saved_data
        saved_data.update({"datarec": orm_to_dict_v2(rec)})
        return saved_data