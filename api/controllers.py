import sys
import json
from server import app, login_manager
from api.models import *

from flask import render_template, redirect, request, g, jsonify
from flask_login import login_user, logout_user, current_user


@app.route('/')
def index():
	return render_template('index.html')


@login_manager.user_loader
def load_user(userID):
	return User.query.get(int(userID))


@app.before_request
def before_request():
	g.user = current_user

@app.route('/api/login', methods=['GET', 'POST'])
def login():
	pass

@app.route('/api/logout')
def logout():
	logout_user()
	return jsonify(success=True)



