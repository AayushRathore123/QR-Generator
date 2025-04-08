from http.client import responses

from boserver.app_orm import *
from boserver.json_helper import ReturnJSON


class QrHandler:
    def __init__(self):
        self.session = session
        self.ret_json = ReturnJSON()

    def save(self):
        try:
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            self.ret_json.set_error_msg(1, str(e))
            return self.ret_json
        self.ret_json.set_success_msg('Successfully Saved Data.')
        return self.ret_json

    def update(self, payload, model_obj):
        for k, v in list(payload.items()):
            setattr(model_obj, k, v)
        self.session.flush()
        return model_obj

    def create_qr(self, payload):
        #Todo - Check if qr already exist or not, user already exist or not... etc
        qr_rec = TableQrCodes(**payload)
        self.session.add(qr_rec)
        self.session.flush()

        save_data = self.save()
        save_data.update({"datarec": orm_to_dict_v2(qr_rec)})
        return save_data

    def update_qr(self, payload):
        qr_id = payload.pop('qr_id')
        # todo - instead of doing this, create a core class and write this below line in class __init__
        qr_rec = self.session.query(TableQrCodes).filter(TableQrCodes.id == qr_id).first()
        qr_update_rec = self.update(payload, qr_rec)
        save_data = self.save()

        # todo -  need to fetch again data from db? or just use qr_update_rec. test it
        save_data.update({'datarec': orm_to_dict_v2(qr_update_rec)})
        return save_data

    def remove_qr(self, payload):
        qr_id = payload.get('qr_id')
        payload['status'] = 0
        qr_rec = self.session.query(TableQrCodes).filter(TableQrCodes.id == qr_id).first()
        self.update(payload, qr_rec)
        save_data = self.save()

        return save_data

    def get_all_qr(self, payload):
        user_id = payload.pop('user_id')
        user_qr_recs = self.session.query(TableQrCodes).filter(TableQrCodes.this_qr2user == user_id,
                                                               TableQrCodes.status == 1).all()
        response = self.ret_json
        response.set_success_msg('Successfully fetched data')
        response.update({'data': [orm_to_dict_v2(rec) for rec in user_qr_recs]})
        return response