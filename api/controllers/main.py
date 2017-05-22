
from application import application
from api.models import *

from flask import render_template, redirect, session, url_for
from flask_login import current_user
from tweepy import OAuthHandler

from api.controllers.auth import *
from api.controllers.links import *
from api.controllers.tweets import *


@application.route('/')
def index():
	return render_template('index.html', page='home', debug=application.config['DEBUG'])

@application.route('/staging')
def staging():
	return render_template('index.html', page='staging', debug=application.config['DEBUG'])


