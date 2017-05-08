
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

@application.route('/admin')
def admin():
	if not current_user.is_anonymous and session.get('twitter_token'):
		return render_template('index.html', page='admin', debug=application.config['DEBUG'])
	return redirect(url_for('oauth'))
	
@application.route('/oauth')
def oauth():
	twitter = OAuthHandler(application.config['TWITTER_KEY'], application.config['TWITTER_SECRET'])
	try:
		url = twitter.get_authorization_url()
		session['request_token'] = twitter.request_token 
	except:
		print('Request token error')
		url = url_for('index')
	return redirect(url)



