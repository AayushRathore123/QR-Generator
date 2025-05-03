### Functional Requirements:

    1. Users can register for an account.
    2. Users can log in and log out securely.
    3. Users can generate QR codes using: 
        o A link (URL-based QR generation).
        o Wi-Fi credentials (SSID & Password).
    4. New users can generate QR codes without logging in.
    5. Users must log in to save their generated QR codes.
    6. Users can download the generated QR codes.
    7. A user dashboard displays saved QR codes.
    8. Users can save QR codes to their dashboard for future use.


### Non-Functional Requirements:

    1. Authentication using JWT tokens.
    2. Authorization for accessing saved QR codes and user-specific features.


### Technology Stack: 

    1. Frontend: Angular CLI 19.2.1, Node.js 20.11.1 (npm 10.8.0)
    2. Backend: Python 3.11 with Flask
    3. Database: Postgresql


### Backend

1. Install python 3.11
2. python -m venv venv
3. Activate environment
   1. For Windows
         - In cmd.exe - venv\Scripts\activate.bat  
         - In PowerShell - venv\Scripts\Activate.ps1
   2. For Linux and MacOS
         - source venv/bin/activate
4. python setup.py develop
5. pip install -r requirements.txt

`Go inside boserver directory then run these commands`
6. Create config.py file inside boserver directory -
    ```
    class Config(object):
        DEBUG = False
        HOST = 'localhost'
        PORT = 5011
        
        DB_NAME = 'qr_generator'
        DB_USERNAME = 'test'
        DB_HOST = 'localhost'
        DB_PWD = '12345678'
    
        JWT_SECRET_KEY = '1234567812345678'
    
        CAPTCHA_LENGTH = 6
        CAPTCHA_EXPIRY = 300
        CAPTCHA_IMG_PATH = "D:/Projects/QR Generator/captcha_code/"
    
        REDIS_HOST = 'localhost'
        REDIS_PWD = 'redis'
        REDIS_DB = 0
        REDIS_PORT = 6379
   
        # Generate Google app password - https://support.google.com/mail/answer/185833?hl=en
        EMAIL_TO = 'raayush1101@gmail.com'
        EMAIL_PASSWORD = 'aaaa bbbb cccc dddd'
        SMTP_SERVER = 'smtp.gmail.com'
        SMTP_PORT = 587
        EMAIL_SUBJECT = 'QR Generator Query/Feedback'
         
        # Generate using os.urandom(24)
        SECRET_KEY = '__your_screte_key__'   
   
        OAUTH_GOOGLE_CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'
        OAUTH2_PROVIDERS = {
              "google": {
                  "client_id": "__your_client__id",
                  "client_secret": "__your_client_secret__"
              }
        }
    ```
   
   ```
   Inside QR Generator, create folder captcha_code and add folder path in this CAPTCHA_IMG_PATH
   ```
7. To start backend server - python app.py

     
### Frontend

*   nvm install 20.11.1
*   nvm use 20.11.1
*   npm install @angular/cli@19.2.1 (Inside foserver)


  1. Navigate to the frontend folder:
     ```bash
     cd foserver
     ```
  
  2. The `src/environment/` folder is ignored via `.gitignore`. You must create the `environment.ts` file manually.  
     Sample `environment.ts` file:
     ```ts
     export const environment = {
       apiUrl: 'http://localhost:5011/',
       encryptionKey: '',
       encryptionIv: ''
     };
     ```
  
     Save this file at `src/environment/environment.ts`
  
  3. Install Angular dependencies:
     ```bash
     npm install
     ```
  
  4. Start the Angular development server:
     ```bash
     ng serve
     ```


### References:

1. For Git/GitHub – 
   1. https://youtu.be/cn8l5bXhTBM?si=5VbjlfbdbAwmSDUO
   2. https://youtu.be/k5D37W6h56o?si=F57C_thMym5P0Krr
   3. https://youtu.be/fI-2k_XqXLg?si=WRUbZPHsfxcO0l2t


2. For SSH – 
   1. Issue - https://stackoverflow.com/questions/29297154/github-invalid-username-or-password
   2. To add SSH Key - https://www.youtube.com/watch?v=xkhUH9Fx2z8
   3. https://www.youtube.com/watch?v=z7jVOenqFYk
   4. https://www.youtube.com/watch?v=lRMAJwMQ0Vc
    

3. JWT (Json Web Token)
    1. https://www.sitepoint.com/using-json-web-tokens-node-js/
    2. https://www.geeksforgeeks.org/how-does-the-token-based-authentication-work/sa
    3. https://www.geeksforgeeks.org/difference-between-local-storage-session-storage-and-cookies/
    4. https://stackoverflow.com/questions/27067251/where-to-store-jwt-in-browser-how-to-protect-against-csrf
    5. https://portswigger.net/web-security/csrf
    6. https://www.descope.com/blog/post/developer-guide-jwt-storage#common-jwt-storage-methods


4. URL Shortner
    1. https://kitrakiar73.medium.com/url-shortner-how-to-build-one-f458fecf038f


4. To generate Captcha
    1. https://medium.com/@nomannayeem/cracking-the-captcha-code-your-complete-guide-to-understanding-and-implementing-captcha-technology-cf606367e8af
    2. https://medium.com/@varun.tyagi83/a-guide-to-building-a-captcha-verification-system-in-python-1a5c62922674


6. To Setup Redis
    1. https://youtu.be/DLKzd3bvgt8?si=el1tsVM-V61a976G
    2. To connect redis with flask https://medium.com/@fahadnujaimalsaedi/using-flask-and-redis-to-optimize-web-application-performance-34a8ae750097
    3. Open file redis.windows-service.conf on path C:\Program Files\Redis and uncomment the line - 
        Change # requirepass foobared --> requirepass __your_redis_password__
    4. redis-server --service-stop
    5. redis-server --service-start
    6. redis-cli    --> auth __your_redis_password__    --> keys *

 
7. To send mail for contact 
   1. https://www.geeksforgeeks.org/send-mail-gmail-account-using-python/
   2. https://www.freecodecamp.org/news/send-emails-in-python-using-mailtrap-smtp-and-the-email-api/
   3. Use of Mailtrap and Google App password (https://support.google.com/mail/answer/185833?hl=en)
   4. Mimetext, Mimebase, MimeMultipart - https://stackoverflow.com/questions/38825943/mimemultipart-mimetext-mimebase-and-payloads-for-sending-email-with-file-atta


8. OAuth Intro and Implementation
   1. https://youtu.be/ZDuRmhLSLOY?si=H5CXEFra8PbNdP0y
   2. https://medium.com/google-cloud/understanding-oauth2-and-building-a-basic-authorization-server-of-your-own-a-beginners-guide-cf7451a16f66
   3. Code - https://www.geeksforgeeks.org/oauth-authentication-with-flask-connect-to-google-twitter-and-facebook/
   4. To Setup in Google cloud console - https://youtube.com/shorts/WABhO9KsOpU?si=pW-R7SMcw46sSrDl



Setup & Flow of Email Sending
1. At payload, getting email, name and msg
2. Add your email and app generated password by Gmail on Config.py file
3. At SMTP server, login with email and password 
4. Send email to the user you want to send

Flow of URL Shortener
1. At payload - long_url
2. If url exist in DB, then fetch and return it
3. Generate uuid and convert uuid to unique numeric_id i.e. of 128-bit (32 hex digits). 
4. Generate short hashValue using base62 conversion, store that hash_value corresponding to long url
5. Return short url
6. 2nd API called - When user click on short_url then api called which retrieve long_url and redirect it

Flow of Captcha Generation
1. Add captcha details in config file
2. Generate captcha code with random char 
3. Using generated captcha code, create image and store that uuid with captcha code in redis 
4. Return uuid and captcha image in response
5. 2nd API called - When user input captcha and submit then using uuid retrieve captcha code and check inputted and store captcha code

OAuth setup & FLow
1. Create client id & client secret key and add it to config file 
2. Register the Oauth provider 
3. Function - it sends the user to Google Login Page, after user logs in, Google will send back user to app(to 2nd API /oauth2callback) with an authorization code
4. Further this /oauth2callback api exchange code with token.