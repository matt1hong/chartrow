
from application import application
from api.models import *

from flask import render_template, redirect, session, url_for
from flask_login import current_user
import tweepy


from api.controllers.auth import *
from api.controllers.links import *
from api.controllers.tweets import *


@application.route('/')
def index():
	return render_template('index.html', page='home')

@application.route('/admin')
def admin():
	if not current_user.is_anonymous and session.get('twitter_token'):
		return render_template('index.html', page='admin')
	return redirect(url_for('oauth'))
	
@application.route('/oauth')
def oauth():
	try:
		url = twitter.get_authorization_url()
		session['request_token'] = twitter.request_token 
	except:
		print('Request token error')
		url = url_for('index')
	return redirect(url)



