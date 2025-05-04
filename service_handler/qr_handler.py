from boserver.app_orm import orm_to_dict_v2, TableQrCodes, session, orm_to_dict_selected
from coreclasses.qr import Qr


class QrHandler:
    def __init__(self):
        self.session = session

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
        qr_id = payload.pop('qr_id')
        qr_obj = Qr(qr_id)
        qr_update_rec = qr_obj.update_rec(payload)
        saved_data = qr_obj.save()
        if saved_data["errCode"]:
            return saved_data
        saved_data.update({'datarec': orm_to_dict_v2(qr_update_rec)})
        return saved_data

    @staticmethod
    def remove_qr(payload):
        qr_id = payload.pop('qr_id')
        qr_obj = Qr(qr_id)
        qr_update_rec = qr_obj.update_rec({'status':0})
        saved_data = qr_obj.save()
        # if saved_data["errCode"]:
        #     return saved_data
        # saved_data.update({'datarec': orm_to_dict_v2(qr_update_rec)})
        return saved_data

    def get_all_qr(self, user_id):
        cols_to_get = ["name", "description", "data", "type", "create_datetime"]
        table_cols = [getattr(TableQrCodes, cols) for cols in cols_to_get]
        user_qr_recs = self.session.query(*table_cols).filter(TableQrCodes.this_qr2user == user_id,
                                                              TableQrCodes.status == 1).all()

        return {'errCode': 0, 'data': orm_to_dict_selected(user_qr_recs, table_cols), 'msg': "Data fetched Successfully"}

    def remove_all_qr(self, payload):
        user_id = payload["user_id"]
        qr_recs = self.session.query(TableQrCodes.id).filter(TableQrCodes.this_qr2user == user_id,
                                                              TableQrCodes.status == 1).all()
        bulk_update_data = [{"id": rec.id, "status": 0} for rec in qr_recs]
        self.session.bulk_update_mappings(TableQrCodes, bulk_update_data)
        # qr_obj = Qr()
        # saved_data = qr_obj.save()
        # if saved_data["errCode"]:
        #     return saved_data
        # saved_data.update({"msg": "Successfully removed all Qr"})
        # return  saved_data
