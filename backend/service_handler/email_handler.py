import smtplib
from email.mime.text import MIMEText
from backend.dbserver.json_helper import ReturnJSON
from backend.dbserver.app_config_load import EMAIL_TO, EMAIL_PASSWORD, SMTP_PORT, SMTP_SERVER, EMAIL_SUBJECT
from backend.service_handler.qr_exceptions import LoginMailError


class EmailHandler:
    def __init__(self):
        self.ret_json = ReturnJSON()

    @staticmethod
    def login():
        try:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT) # connect SMTP server on given port and create connection obj
            # Above basic TCP connection is created, It does NOT yet encrypt the connection
            server.starttls() # Upgrades the current insecure connection to a secure (encrypted) TLS/SSL connection.
            server.ehlo() # Client and server handshake to confirm capabilities after encryption
            server.login(EMAIL_TO, EMAIL_PASSWORD)
            return server
        except Exception as e:
            raise LoginMailError(str(e))

    @staticmethod
    def set_data(payload):
        """
            MIMEText - If you just want to send plain text or HTML email body (no attachments).
            MIMEMultipart - Use it when your email has attachments, multiple body formats, or images inside emails.
            MIMEBase - Use it when you want to attach files like PDFs, images, docs, etc
        """
        text = f"{payload['message']}\n\nRegards,\n{payload['name']}\n{payload['email']}"
        msg = MIMEText(text)
        msg["Subject"] = EMAIL_SUBJECT
        msg["To"] = EMAIL_TO
        msg["From"] = EMAIL_TO
        return msg

    def send_email(self, payload):
        server = None
        try:
            server = self.login()
            print("Email login Successfully")
            msg = self.set_data(payload)
            server.sendmail(EMAIL_TO, EMAIL_TO, msg.as_string())
            print("Email sent Successfully")
            self.ret_json.set_success_msg("Email Sent Successfully")
        except LoginMailError as e:
            self.ret_json.set_error_msg(1, str(e))
        except Exception as e:
            self.ret_json.set_error_msg(1, str(e))
        finally:
            if server is not None:
                server.quit()

        return self.ret_json