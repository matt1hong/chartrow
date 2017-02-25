import sys

from flask import Flask, render_template, session, redirect, request, url_for, g, jsonify
from flask_restful import reqparse, Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_script import Manager, Server
from flask_oauthlib.client import OAuth

from utils import DecimalEncoder


app = Flask(__name__)
app.config.from_object('config')
app.json_encoder = DecimalEncoder

db = SQLAlchemy(app)

from server import app

oauth = OAuth(app)
def oauth_app():
	twitter = oauth.remote_app('twitter',
		base_url='https://api.twitter.com/1.1/',
		request_token_url='https://api.twitter.com/oauth/request_token',
		access_token_url='https://api.twitter.com/oauth/access_token',
		authorize_url='https://api.twitter.com/oauth/authenticate',
		consumer_key='ZQgQejG6uuceFPx4lnz3d8ttp',
		consumer_secret='YRX7rHhsXZnWEYuhCq0asMQWHINyhs6gH3GmT398tmcnooKTjJ'
	)
	return twitter
twitter = oauth_app()

parser = reqparse.RequestParser()


login_manager = LoginManager()
login_manager.init_app(app)



from api.controllers import *



manager = Manager(app)
manager.add_command("runserver", Server(host='127.0.0.1'))

if __name__ == '__main__':
	manager.run()
