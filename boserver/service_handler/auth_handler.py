from boserver.app_orm import session, TableUser


class AuthHandler:
    def __init__(self):
        self.session = session

    def login(self, payload):
        user_name = payload['user_name'].lower()
        password = payload['password']
        user_rec = self.session.query(TableUser).filter(TableUser.user_name==user_name).first()
        if not user_rec:
            return {'errCode':1, 'msg':'Invalid User Name', 'data_rec':payload}
        if user_rec.password != password:
            return {'errCode':1, 'msg':'Incorrect Password', 'data_rec':payload}

        return {'errCode': 0, 'msg': 'Logged In', 'data_rec': payload}