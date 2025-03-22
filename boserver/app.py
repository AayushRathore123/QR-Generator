from boserver.app_routes import app

app.config.from_object("config.Config")

# Method 1 - To make API Calls
@app.route("/")
def hello_world():
    return "<p>Welcome to QR Generator!</p>"


if __name__ == '__main__':
    print("Starting Application")
    app.run(debug=True, host= app.config["HOST"], port= app.config["PORT"])
