
from application import application, login_manager, twitter, socketio
from api.models import *

from flask import render_template, jsonify, session, request, redirect, url_for
from flask_login import logout_user, login_user, current_user
from flask_socketio import disconnect

from datetime import datetime

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
		date_now = datetime.now()
		user.last_seen = date_now
		db.session.commit()
		login_user(user, True)
		return redirect(url_for('admin'))
	return redirect(url_for('index'))

@application.route('/api/auth/logout') 
def logout():
	logout_user()
	return jsonify(success=True)

@application.route('/api/auth/last_seen', methods=['GET', 'POST'])
def last_seen():
	if request.method == 'GET':
		last_seen = current_user.last_seen.isoformat()
		return jsonify(success=True, result=last_seen)
	elif request.method == 'POST':
		date_now = datetime.now()
		current_user.last_seen = date_now
		db.session.commit()
		return jsonify(success=True, result=date_now)
	return jsonify(error=True), 403

