import sys
import os

from flask import Flask, render_template, session, redirect, request, url_for, g, jsonify
from flask_restful import reqparse, Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_script import Manager, Server
from flask_oauthlib.client import OAuth
from flask_socketio import SocketIO

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

	
conn = boto.connect_s3(application.config['AWS_ACCESS_KEY_ID'], application.config['AWS_SECRET_ACCESS_KEY'])
twitter = OAuthHandler(application.config['TWITTER_KEY'], application.config['TWITTER_SECRET'])
socketio = SocketIO(application)
db = SQLAlchemy(application)
login_manager = LoginManager(application)
s3_bucket = conn.get_bucket(application.config['S3_BUCKET'])


parser = reqparse.RequestParser()




from api.controllers.main import *


if __name__ == '__main__':
	socketio.run(application, host='0.0.0.0', debug=application.config['DEBUG'])
