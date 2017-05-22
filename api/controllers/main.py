
from application import application
from api.models import *

from flask import render_template, redirect, session, url_for

from api.controllers.links import *


@application.route('/')
def index():
	return render_template('index.html', page='home', debug=application.config['DEBUG'], title='Chartrow')

@application.route('/staging')
def staging():
	return render_template('index.html', page='staging', debug=application.config['DEBUG'], title='Chartrow')


