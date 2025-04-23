from datetime import datetime
from boserver.app_orm import session, TableUser, TableUserDetails, orm_to_dict, orm_to_dict_v2
from boserver.json_helper import ReturnJSON


class AuthHandler:
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
        self.ret_json.set_success_msg("Successfully Saved Data.")
        return self.ret_json

    def login(self, payload):
        user_name = payload['user_name']
        password = payload['password']
        user_rec = self.session.query(TableUser).filter(TableUser.user_name==user_name).first()
        if not user_rec:
            return {'errCode': 1, 'msg': 'Invalid User Name'}
        if user_rec.password != password:
            return {'errCode': 1, 'msg': 'Incorrect Password'}

        user_rec.lastlogin_datetime = datetime.now()
        self.save()
        return {'errCode': 0, 'msg': 'Successfully Login', 'datarec': orm_to_dict_v2(user_rec)}

    def register(self, payload):
        user_name = payload['user_name']
        user_rec = self.session.query(TableUser).filter(TableUser.user_name==user_name, TableUser.status==1).first()
        if user_rec:
            return {'errCode': 1, 'msg': 'Username already exist'}
        user_payload = {'user_name': payload.pop('user_name'), 'password': payload.pop('password')}

        user_rec = TableUser(**user_payload)
        self.session.add(user_rec)
        self.session.flush()

        payload['this_user_details2user'] = user_rec.id
        user_details_rec = TableUserDetails(**payload)
        self.session.add(user_details_rec)

        save_data = self.save()
        save_data.update({"datarec":orm_to_dict_v2(user_details_rec)})
        return save_data
