from boserver.app_orm import orm_to_dict_v2
from boserver.json_helper import ReturnJSON
from coreclasses.user import User


class UserHandler:
    def __init__(self):
        self.ret_json = ReturnJSON()

    @staticmethod
    def get_user_details(user_id):
        obj = User(user_id)
        user_rec = obj.dataset_rec
        if user_rec:
            user_rec = orm_to_dict_v2(user_rec)
        return {"errCode":0, "msg": user_rec}

    @staticmethod
    def update_user_details(payload):
        user_id = payload.pop('user_id')
        obj = User(user_id)
        user_update_rec = obj.update_rec(payload)
        saved_data = obj.save()
        if saved_data["errCode"]:
            return saved_data
        saved_data.update({"datarec":orm_to_dict_v2(user_update_rec)})
        return saved_data
