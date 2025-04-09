from boserver.app_orm import orm_to_dict_v2
from coreclasses.qr import Qr


class QrHandler:

    @staticmethod
    def create_qr(payload):
        #Todo - Check if qr already exist or not
        qr_obj = Qr()
        qr_rec = qr_obj.create_rec(payload)
        saved_data = qr_obj.save()
        if saved_data["errCode"]:
            return saved_data
        saved_data.update({"datarec": orm_to_dict_v2(qr_rec)})
        return saved_data

    @staticmethod
    def update_qr(payload):
        qr_obj = Qr(payload['qr_id'])
        qr_update_rec = qr_obj.update_rec(payload)
        saved_data = qr_obj.save()
        if saved_data["errCode"]:
            return saved_data
        saved_data.update({'datarec': orm_to_dict_v2(qr_update_rec)})
        return saved_data

    @staticmethod
    def remove_qr(payload):
        qr_obj = Qr(payload['qr_id'])
        qr_update_rec = qr_obj.update_rec({'status':0})
        saved_data = qr_obj.save()
        if saved_data["errCode"]:
            return saved_data
        saved_data.update({'datarec': orm_to_dict_v2(qr_update_rec)})
        return saved_data

    @staticmethod
    def get_all_qr(payload):
        qr_obj = Qr()
        user_qr_recs = qr_obj.get_all_user_qr(payload['user_id'])
        return {'errCode': 0, 'msg': [orm_to_dict_v2(rec) for rec in user_qr_recs]}
