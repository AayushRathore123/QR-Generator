from backend.dbserver.app import app

# This file serves as the WSGI entry point for uWSGI or other WSGI servers.
# While the app can be run directly from app.py, i.e. (uwsgi --http localhost:5011 --wsgi-file app.py --callable app)
# but instead of app.py we are running wsgi.py i.e. (uwsgi --http localhost:5011 --wsgi-file wsgi.py --callable app)
# to provides a cleaner and more portable structure, especially useful for deployment and scalability.
