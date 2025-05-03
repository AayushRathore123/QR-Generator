from boserver.app_orm import orm_to_dict_v2
from boserver.json_helper import ReturnJSON
from coreclasses.user import User


class UserHandler:
    def __init__(self):
        self.ret_json = ReturnJSON()

    def get_user_details(self, user_id):
        obj = User(user_id)
        user_rec = obj.dataset_rec
        if user_rec:
            user_rec = orm_to_dict_v2(user_rec)
            self.ret_json.update({"datarec":user_rec})
        self.ret_json.update({"msg": "Successfully fetched data"})
        return self.ret_json

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

    def update_password(self, payload):
        user_id = payload.pop("user_id")
        obj = User()
        user_rec = obj.get_user_rec(user_id)
        if user_rec.password != payload.pop("old_password"):
            self.ret_json.set_error_msg(1, "Old password is not correct")
            return self.ret_json
        payload["password"] = payload.pop("new_password")
        obj.update_rec(payload)
        saved_data = obj.save()
        if saved_data["errCode"]:
            return saved_data
        saved_data.update({"msg": "Successfully updated password"})
        return saved_data