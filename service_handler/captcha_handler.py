import string
import random
import uuid
from boserver.app_config_load import CAPTCHA_IMG_PATH, CAPTCHA_LENGTH
from boserver.flask_app import redis_cache_obj
from boserver.json_helper import ReturnJSON
from PIL import Image, ImageDraw, ImageFont
from boserver.rediscacher.redis_cache_statics import CAPTCHA_CACHING_KEY_IDENT


class CaptchaHandler:
    def __init__(self):
        self.ret_json = ReturnJSON()

    @staticmethod
    def generate_captcha_code():
        captcha_chars = string.ascii_letters + string.digits
        captcha_code = ''.join(random.choice(captcha_chars) for _ in range(CAPTCHA_LENGTH))
        return captcha_code

    @staticmethod
    def generate_captcha_img(captcha_code):
        img = Image.new(mode="RGB", size=(300,200), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        try:
            font = ImageFont.truetype('arial.ttf', 36)
        except IOError:
            font = ImageFont.load_default()
            print("Default font used; arial.ttf not found.")

        # Get the text bounding box
        bbox = draw.textbbox((0,0), captcha_code, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x = (img.width - text_width) / 2
        y = (img.height - text_height) / 2

        # It will write captcha_code in black text on image
        draw.text((x, y), captcha_code, fill=(0, 0, 0), font=font)

        captcha_uuid = str(uuid.uuid4())
        captcha_img_path = CAPTCHA_IMG_PATH + captcha_uuid + ".png"
        img.save(captcha_img_path)
        return captcha_uuid, captcha_img_path

    def get_captcha_code(self):
        captcha_code = self.generate_captcha_code()
        captcha_uuid, captcha_img = self.generate_captcha_img(captcha_code)
        ident = CAPTCHA_CACHING_KEY_IDENT + captcha_uuid
        redis_cache_obj.set_cache_data(ident, captcha_code)

        return {"errCode":0, "msg": "Captcha generated Successfully",
                "datarec": {"captcha_img": captcha_img, "captcha_id":captcha_uuid }}

    @staticmethod
    def validate_captcha_code(payload):
        input_captcha = payload["input_captcha"]
        captcha_id = payload["captcha_id"]

        ident = CAPTCHA_CACHING_KEY_IDENT + captcha_id
        captcha_code = redis_cache_obj.get_cache_data(ident)
        if not input_captcha:
            return {'errCode':1, "msg": "CAPTCHA not found or expired"}
        if input_captcha == captcha_code:
            return {"msg": "CAPTCHA verification passed"}

        return {"msg": "CAPTCHA verification failed"}

if __name__ == '__main__':
    obj = CaptchaHandler()
    print(obj.get_captcha_code())