import sys

from flask import Flask, render_template, session, redirect, request, url_for, g, jsonify
from flask_restful import reqparse, Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_script import Manager, Server
from flask_oauthlib.client import OAuth
from flask_socketio import SocketIO

from utils import DecimalEncoder

from tweepy import OAuthHandler



#Variables that contains the user credentials to access Twitter API 
consumer_key = 'ZQgQejG6uuceFPx4lnz3d8ttp'
consumer_secret = 'YRX7rHhsXZnWEYuhCq0asMQWHINyhs6gH3GmT398tmcnooKTjJ'


twitter = OAuthHandler(consumer_key, consumer_secret)



application = Flask(__name__)
application.config.from_object('config')
application.json_encoder = DecimalEncoder

socketio = SocketIO(application)
db = SQLAlchemy(application)
login_manager = LoginManager(application)


parser = reqparse.RequestParser()




from api.controllers import *


if __name__ == '__main__':
	socketio.run(application, host='0.0.0.0', debug=application.config['DEBUG'])
