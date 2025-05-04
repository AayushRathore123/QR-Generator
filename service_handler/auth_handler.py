from datetime import datetime
from flask import url_for
from boserver.app_orm import session, TableUser, TableUserDetails, orm_to_dict_v2
from boserver.flask_app import oauth
from boserver.json_helper import ReturnJSON
from boserver.app_config_load import OAUTH2_PROVIDERS, OAUTH_GOOGLE_CONF_URL


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
        user_rec = self.session.query(TableUser).filter(TableUser.user_name == user_name, TableUser.status == 1).first()
        if not user_rec:
            return {'errCode': 1, 'msg': 'Invalid User Name'}
        if user_rec.password != password:
            return {'errCode': 1, 'msg': 'Incorrect Password'}

        user_rec.lastlogin_datetime = datetime.now()
        self.save()
        return {'errCode': 0, 'msg': 'Successfully Login', 'datarec': orm_to_dict_v2(user_rec)}

    def register(self, payload):
        user_name = payload['user_name']
        user_rec = self.session.query(TableUser).filter(TableUser.user_name == user_name, TableUser.status == 1).first()
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
        save_data.update({"datarec": orm_to_dict_v2(user_details_rec)})
        return save_data

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

        oauth.register(
            name='google',  # giving name this provider as 'google'
            client_id=OAUTH2_PROVIDERS["google"]["client_id"],
            client_secret=OAUTH2_PROVIDERS["google"]["client_secret"],
            server_metadata_url=OAUTH_GOOGLE_CONF_URL,
            client_kwargs={
                'scope': 'openid email profile'
            }
        )
        redirect_uri = url_for('oauth2callback', _external=True)
        return oauth.google.authorize_redirect(redirect_uri)

    @staticmethod
    def oauth_callback():
        """
            After user logins with Google and Google redirects back to app (to redirect_uri i.e. oauth_callback),
            Flask server receives a code (authorization code) in the URL.
        """
        # authorize_access_token() calls Google Token API which exchanges authorization code and receives an
        # access_token, id_token, and user info, As we passed 'scope': 'openid email profile' only
        token = oauth.google.authorize_access_token()
        user = token['userinfo']
        return {"google user": user}
