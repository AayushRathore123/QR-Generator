import base64
import shutil
import string
import random
import uuid
from pathlib import Path
import os
from dbserver.app_config_load import CAPTCHA_LENGTH
from dbserver.flask_app import redis_cache_obj
from dbserver.json_helper import ReturnJSON
from PIL import Image, ImageDraw, ImageFont
from dbserver.rediscacher.redis_cache_statics import CAPTCHA_CACHING_KEY_IDENT


class CaptchaHandler:
    def __init__(self):
        self.ret_json = ReturnJSON()
        self.captcha_img_path = Path.cwd().parent / 'captcha_image'

    def clear_all_captcha_and_generate_directory(self):
        if os.path.exists(self.captcha_img_path):
            try:
                shutil.rmtree(self.captcha_img_path)
            except OSError as e:
                self.ret_json.set_error_msg(1, str(e))
        os.makedirs(self.captcha_img_path, exist_ok=True)

    @staticmethod
    def generate_captcha_code():
        captcha_chars = string.ascii_letters + string.digits
        captcha_code = ''.join(random.choice(captcha_chars) for _ in range(CAPTCHA_LENGTH))
        return captcha_code

    def generate_captcha_img(self, captcha_code):
        img = Image.new(mode="RGB", size=(300,200), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        try:
            font = ImageFont.truetype('arial.ttf', 70)
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
        captcha_img_path = self.captcha_img_path / f"{captcha_uuid}.png"
        img.save(captcha_img_path)
        return captcha_uuid, captcha_img_path

    @staticmethod
    def get_captcha_img_uri(img_path):
        with open(img_path, 'rb') as img_file:
            encoded_str = base64.b64encode(img_file.read()).decode('utf-8')
        image_data_uri =  f"data:image/png;base64,{encoded_str}"
        return image_data_uri

    def get_captcha_code(self):
        self.clear_all_captcha_and_generate_directory()
        captcha_code = self.generate_captcha_code()
        captcha_uuid, captcha_img = self.generate_captcha_img(captcha_code)
        ident = CAPTCHA_CACHING_KEY_IDENT + captcha_uuid
        redis_cache_obj.set_cache_data(ident, captcha_code)
        image_data_uri = self.get_captcha_img_uri(captcha_img)
        self.ret_json.set_success_msg("Captcha generated Successfully")
        self.ret_json.update({"datarec": {"captcha_img": image_data_uri, "captcha_id":captcha_uuid }})
        return self.ret_json

    def validate_captcha_code(self, payload):
        input_captcha = payload["input_captcha"]
        captcha_id = payload["captcha_id"]

        ident = CAPTCHA_CACHING_KEY_IDENT + captcha_id
        captcha_code = redis_cache_obj.get_cache_data(ident)

        if not captcha_code:
            self.ret_json.set_error_msg(1, "CAPTCHA not found or expired")
        elif input_captcha == captcha_code:
            self.ret_json.set_success_msg("Captcha verification passed")
        else:
            self.ret_json.set_error_msg(1, "Captcha verification failed")

        return self.ret_json


if __name__ == '__main__':
    obj = CaptchaHandler()
    print(obj.get_captcha_code())