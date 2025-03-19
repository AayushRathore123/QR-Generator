from datetime import datetime
from boserver.app_orm import session, TableUser, TableUserDetails, orm_to_dict, orm_to_dict_v2


class AuthHandler:
    def __init__(self):
        self.session = session

    def login(self, payload):
        user_name = payload['user_name']
        password = payload['password']
        user_rec = self.session.query(TableUser).filter(TableUser.user_name==user_name).first()
        if not user_rec:
            return {'errCode': 1, 'msg': 'Invalid User Name'}
        if user_rec.password != password:
            return {'errCode': 1, 'msg': 'Incorrect Password'}

        user_details_rec = self.session.query(TableUserDetails).filter(
            TableUser.id == TableUserDetails.this_user_details2user).first()

        # user_rec.lastlogin_datetime = datetime.now()
        # save()
        return {'errCode': 0, 'msg': 'Successfully Logged In', 'data_rec': orm_to_dict_v2(user_details_rec)}