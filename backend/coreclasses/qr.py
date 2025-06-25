from dbserver.app_orm import session, TableQrCodes
from dbserver.json_helper import ReturnJSON
from service_handler.qr_exceptions import RecordNotFound


class Qr:
    def __init__(self, rec_id=0):
        self.session = session
        self.ret_json = ReturnJSON()
        self.dataset_id = rec_id
        if self.dataset_id:
            self.dataset_rec = self._get_rec_by_id()

    def _get_rec_by_id(self):
        rec = self.session.query(TableQrCodes).filter(TableQrCodes.id == self.dataset_id).first()
        if not rec:
            raise RecordNotFound(self.dataset_id, 'TableQrCodes')
        return rec

    def save(self):
        try:
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            self.ret_json.set_error_msg(1, str(e))
            return self.ret_json
        self.ret_json.set_success_msg("Successfully Saved Data.")
        return self.ret_json

    def create_rec(self, payload):
        qr_rec = TableQrCodes(**payload)
        self.session.add(qr_rec)
        self.session.flush()
        return qr_rec

    def update_rec(self, payload, skip_fields=[]):
        model_obj = self.dataset_rec
        for k, v in list(payload.items()):
            if k in skip_fields:
                continue
            setattr(model_obj, k, v)
        self.session.flush()
        return model_obj
