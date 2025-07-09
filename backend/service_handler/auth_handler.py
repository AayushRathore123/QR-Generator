import json
from datetime import datetime
from flask import url_for, redirect
from flask_jwt_extended import create_access_token
from dbserver.app_orm import session, TableUser, TableUserDetails, orm_to_dict_v2
from dbserver.flask_app import oauth
from dbserver.json_helper import ReturnJSON
from dbserver.app_config_load import (OAUTH2_GOOGLE_PROVIDERS_CLIENT_ID, OAUTH2_GOOGLE_PROVIDERS_CLIENT_SECRET,
                                      OAUTH_GOOGLE_CONF_URL, FRONTEND_OAUTH_CALLBACK_URL)


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

    @staticmethod
    def create_token(user_data):
        try:
            access_token = create_access_token(
                identity=json.dumps({"user_name": user_data["user_name"], "user_id": user_data["id"]}))
            # Why make_response
            auth_ret = {"errCode": 0, "msg": "Login Successfully", "access_token": access_token,
                        "user_name": user_data["user_name"], "user_id": user_data["id"]}
            # resp = make_response(json.dumps(auth_ret))
            # resp.headers.extend({"token": access_token})
            # auth_ret.extend({"token": access_token})
            return auth_ret
        except Exception as e:
            return {'errCode': 1, 'msg': str(e)}

    def login(self, payload):
        user_name = payload['user_name']
        password = payload.get('password')
        auth_provider = payload.get('auth_provider')
        user_rec = self.session.query(TableUser).filter(TableUser.user_name == user_name, TableUser.status == 1).first()
        if not user_rec:
            return {'errCode': 2, 'msg': 'Invalid User Name'}
        if not user_rec.password and auth_provider != 'google':
            return {'errCode': 1,
                    'msg': 'Password not found. This account may have been created using Google OAuth and does not support password login.'}
        if password and user_rec.password != password:
            return {'errCode': 1, 'msg': 'Incorrect Password'}

        user_rec.lastlogin_datetime = datetime.now()
        saved_data = self.save()
        if saved_data["errCode"]:
            return saved_data
        return self.create_token(orm_to_dict_v2(user_rec))

    def register(self, payload):
        user_name = payload['user_name']
        user_rec = self.session.query(TableUser).filter(TableUser.user_name == user_name, TableUser.status == 1).first()
        if user_rec:
            return {'errCode': 1, 'msg': 'Username already exist'}
        user_payload = {'user_name': payload.pop('user_name'), 'password': payload.pop('password', None),
                        'auth_provider': payload.pop('auth_provider', None)}

        user_rec = TableUser(**user_payload)
        self.session.add(user_rec)
        self.session.flush()

        payload['this_user_details2user'] = user_rec.id
        user_details_rec = TableUserDetails(**payload)
        self.session.add(user_details_rec)

        saved_data = self.save()
        if saved_data["errCode"]:
            return saved_data
        # saved_data.update({"datarec": orm_to_dict_v2(user_details_rec)})
        return self.create_token(orm_to_dict_v2(user_rec))

    @staticmethod
    def oauth_login():
        """
            oauth.register() - Registering the Google as provider in the app and tell Flask-OAuth where to talk to
            Google, what client id, secret to use, etc.

            url_for() - Used for url generation, _external=True makes the full url
            like http://localhost:5011/oauth2callback instead of just /oauth2callback.

            oauth.google.authorize_redirect() - this sends the user to Google Login Page, after user logs in, Google
            will send back user to app(to api /oauth2callback) with an authorization code, and further
            this /oauth2callback api exchange code with token.

            client_kwargs={'scope': 'openid email profile'} - Asking permission from Google to access specific user data.
            Google gives you who the user is (identity = openid), email address and profile info like name and photo.
        """

        try:
            oauth.register(
                name='google',  # giving name this provider as 'google'
                client_id=OAUTH2_GOOGLE_PROVIDERS_CLIENT_ID,
                client_secret=OAUTH2_GOOGLE_PROVIDERS_CLIENT_SECRET,
                server_metadata_url=OAUTH_GOOGLE_CONF_URL,
                client_kwargs={
                    'scope': 'openid email profile'
                }
            )
            redirect_uri = url_for('oauth2callback', _external=True)
            return oauth.google.authorize_redirect(redirect_uri)
        except Exception as e:
            return {"errCode": 1, "msg": str(e)}

    def oauth_callback(self):
        """
            After user logins with Google and Google redirects back to app (to redirect_uri i.e. oauth_callback),
            Flask server receives a code (authorization code) in the URL.
        """
        # authorize_access_token() calls Google Token API which exchanges authorization code and receives an
        # access_token, id_token, and user info, As we passed 'scope': 'openid email profile' only
        try:
            token = oauth.google.authorize_access_token()
            user = token['userinfo']
            auth_result = self.handle_google_login_or_register(user)
            return auth_result
        except Exception as e:
            return {"errCode": 1, "msg": str(e)}


    def handle_google_login_or_register(self, user):
        login_resp = self.login({"user_name": user["email"], "auth_provider": "google"})
        if login_resp["errCode"] == 2:
            register_resp = self.register(
                {"user_name": user["email"], "auth_provider": "google", "first_name": user["given_name"],
                 "last_name": user["family_name"]})
            if register_resp['errCode'] != 0:
                return register_resp
            return redirect(
                f"{FRONTEND_OAUTH_CALLBACK_URL}?token={register_resp['access_token']}&userId={register_resp['user_id']}&username={register_resp['user_name']}")

        if login_resp['errCode']!=0:
            return login_resp
        return redirect(
            f"{FRONTEND_OAUTH_CALLBACK_URL}?token={login_resp['access_token']}&userId={login_resp['user_id']}&username={login_resp['user_name']}")
