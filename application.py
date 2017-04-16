import sys

from flask import Flask, render_template, session, redirect, request, url_for, g, jsonify
from flask_restful import reqparse, Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_script import Manager, Server
from flask_oauthlib.client import OAuth
from flask_socketio import SocketIO

from utils import DecimalEncoder
from config import DevConfig
from tweepy import OAuthHandler




application = Flask(__name__)
application.config.from_object(DevConfig)
application.json_encoder = DecimalEncoder

twitter = OAuthHandler(application.config['TWITTER_KEY'], application.config['TWITTER_SECRET'])
socketio = SocketIO(application)
db = SQLAlchemy(application)
login_manager = LoginManager(application)


parser = reqparse.RequestParser()




from api.controllers.main import *


if __name__ == '__main__':
	socketio.run(application, host='0.0.0.0', debug=application.config['DEBUG'])
