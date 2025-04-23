from boserver.app_orm import session, TableUser, TableUserDetails
from boserver.json_helper import ReturnJSON
from service_handler.qr_exceptions import RecordNotFound


class User:
    def __init__(self, user_id=None):
        self.session = session
        self.ret_json = ReturnJSON()
        self.dataset_id = user_id
        if self.dataset_id:
            self.dataset_rec = self._get_rec_by_id(self.dataset_id)

    def _get_rec_by_id(self, user_id):
        rec = self.session.query(TableUserDetails).filter(TableUserDetails.this_user_details2user == user_id,
                                                              TableUserDetails.status == 1).first()
        if not rec:
            raise RecordNotFound(self.dataset_id, 'TableUserDetails')
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

    def update_rec(self, payload, skip_fields=[]):
        model_obj = self.dataset_rec
        for k,v in list(payload.items()):
            if k in skip_fields:
                continue
            setattr(model_obj, k, v)
        self.session.flush()
        return model_obj
