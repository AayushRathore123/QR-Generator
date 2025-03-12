import sqlalchemy as db
from sqlalchemy import Column, Integer, DateTime, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker
from boserver.flask_app import app

app.config.from_object("config.Config")
Base = automap_base()

db_engine = db.create_engine(
    "postgresql://{0}:{1}@{2}/{3}?sslmode=require".format(app.config["DB_USERNAME"], app.config["DB_PWD"],
                                          app.config["DB_HOST"], app.config["DB_NAME"]))

# Session is responsible for managing the interactions with the database, such as adding, querying, and committing changes.
Session = sessionmaker(bind=db_engine)
session = Session()


class TableUser(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    create_datetime = Column(DateTime, onupdate=func.now(), default=func.now())
    lastchange_datetime = Column(DateTime, default=func.now())

# Automatically reflects all columns from the database.
Base.prepare(autoload_with=db_engine)

# Testing DB Connection
# result = session.query(TableUser).all()
# print(TableUser.__table__.columns.keys())
# for r in result:
#     print(r.password)