from dbserver.app_orm import orm_to_dict_v2
from dbserver.json_helper import ReturnJSON
from coreclasses.user import User
from service_handler.qr_handler import QrHandler


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

    @staticmethod
    def remove_user(payload):
        """
            Need to remove rec from user, user_details and qr tables
        """
        user_id = payload["user_id"]
        obj = User(user_id)

        # Inactive rec from user_details table
        obj.update_rec({"status":0})
        # Inactive rec from user table
        obj.get_user_rec(user_id)
        obj.update_rec({"status":0})

        # Inactive rec from qr table
        qr_obj = QrHandler()
        qr_obj.remove_all_qr(payload)

        saved_data = obj.save()
        if saved_data["errCode"]:
            return saved_data
        saved_data.update({"msg": "Successfully removed account"})
        return saved_data
