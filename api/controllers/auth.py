
from application import application, login_manager, twitter, socketio
from api.models import *

from flask import render_template, jsonify, session, request, redirect, url_for
from flask_login import logout_user, login_user, current_user
from flask_socketio import disconnect

@login_manager.user_loader
def load_user(id):
	return User.query.get(int(id))

@application.route('/api/auth/authorized')
def authorized():
	verifier = request.args.get('oauth_verifier')
	if verifier is None:
		return jsonify(error=True), 403
	twitter.request_token = session['request_token']
	del session['request_token']
	session['twitter_token'] = twitter.get_access_token(verifier)
	username = twitter.get_username()
	if username == 'datavincillc' or username == 'madeon_young':
		user = User.query.filter_by(name=username).first()
		if not user:
			user = User(name=username)
			db.session.add(user)
			db.session.commit()
		login_user(user, True)
		return redirect(url_for('admin'))
	return redirect(url_for('index'))

@application.route('/api/auth/logout') 
def logout():
	logout_user()
	return jsonify(success=True)
