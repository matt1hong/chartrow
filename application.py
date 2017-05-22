import sys
import os

from flask_restful import reqparse
from flask_sqlalchemy import SQLAlchemy
from flask import Flask

from utils import DecimalEncoder
from config import DevConfig, ProdConfig
from tweepy import OAuthHandler
import boto



application = Flask(__name__)
application.json_encoder = DecimalEncoder
if os.environ['FLASK_DEBUG']=='1':
	application.config.from_object(DevConfig)
elif os.environ['FLASK_DEBUG']=='0':
	application.config.from_object(ProdConfig)

db = SQLAlchemy(application)


conn = boto.connect_s3(application.config['AWS_ACCESS_KEY_ID'], application.config['AWS_SECRET_ACCESS_KEY'])
s3_bucket = conn.get_bucket(application.config['S3_BUCKET'])

from api.controllers.main import *


if __name__ == '__main__':
	application.run(debug=application.config['DEBUG'])
