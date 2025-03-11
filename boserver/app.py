from flask_app import app


app.config.from_object("config.Config")

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


if __name__ == '__main__':
    print("Starting Application")
    app.run(debug=True, host= app.config["HOST"], port= app.config["PORT"])