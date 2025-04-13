from datetime import date, time
from decimal import Decimal
from sqlalchemy import Column, Integer, DateTime, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker
from boserver.flask_app import app
import sqlalchemy as db


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
    status = Column(Integer, default=1)
    create_datetime = Column(DateTime, default=func.now())
    lastchange_datetime = Column(DateTime, onupdate=func.now(), default=func.now())


class TableUserDetails(Base):
    __tablename__ = 'user_details'
    id = Column(Integer, primary_key=True)
    status = Column(Integer, default=1)
    create_datetime = Column(DateTime, default=func.now())
    lastchange_datetime = Column(DateTime, onupdate=func.now(), default=func.now())


class TableQrCodes(Base):
    __tablename__ = 'qr_codes'
    id = Column(Integer, primary_key=True)
    status = Column(Integer, default=1)
    create_datetime = Column(DateTime, default=func.now())
    lastchange_datetime = Column(DateTime, onupdate=func.now(), default=func.now())


class TableUrlShortener(Base):
    __tablename__ = 'url_shortener'
    id = Column(Integer, primary_key=True)
    create_datetime = Column(DateTime, default=func.now())


# Automatically reflects all columns from the database.
Base.prepare(autoload_with=db_engine)

# Testing DB Connection
# result = session.query(TableUser).all()
# print(TableUser.__table__.columns.keys())
# for res in result:
#     print(res.password)


def orm_to_dict(obj):
    return {col.name: getattr(obj, col.name) for col in obj.__table__.columns}

def orm_to_dict_v2(obj, date_format=None, round_decimal=True):
    data = {}
    for col in obj.__table__.columns:
        value = getattr(obj, col.name)  # Get the column value once to avoid redundant lookups

        if isinstance(value, date):
            data[col.name] = value.strftime(date_format) if date_format else str(value)
        elif isinstance(value, time):
            data[col.name] = str(value)
        elif isinstance(value, Decimal):
            data[col.name] = round(float(value)) if round_decimal else float(value)
        else:
            data[col.name] = value

    return data
