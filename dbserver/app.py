from dbserver.app_config_load import APP_HOST, APP_PORT
from dbserver.app_routes import app
# Why not from dbserver.flask_app import app ???

# Method 1 - To make API Calls
@app.route("/")
def hello_world():
    return "<p>Welcome to QR Generator!</p>"


if __name__ == '__main__':
    print("Starting Application")
    app.run(debug=True, host= APP_HOST, port= APP_PORT)
