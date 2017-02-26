import sys
import jsonpickle
import urllib
from server import app, login_manager, twitter, socketio
from api.models import *

from flask import render_template, redirect, request, g, jsonify, session, Response
from flask_login import login_user, logout_user, current_user
from flask_socketio import emit

from tweepy.streaming import StreamListener
from tweepy import Stream

from bs4 import BeautifulSoup

class TweetListener(StreamListener):
    def on_data(self, data):
        emit('tweet', data, broadcast=True)
        return True

    def on_error(self, status):
        print(status)

listener = TweetListener()
stream = Stream(twitter, listener)

@socketio.on('connected')
def stream_tweets(message):
    return Response(stream.filter(track=['maher']), content_type='text/event-stream')

@app.route('/')
def index():
	return render_template('index.html')

@login_manager.user_loader
def load_user(userID):
	return User.query.get(int(userID))


@app.before_request
def before_request():
	g.user = current_user


@app.route('/api/get_images')
def get_images():
	url = request.args.get('link')
	r = urllib.request.urlopen(url).read()
	soup = BeautifulSoup(r)
	links = soup.findAll('img')
	return jsonify(results=[link['src'] for link in links], success=True)

@app.route('/api/login', methods=['GET', 'POST'])
def login():
	pass

@app.route('/api/logout')
def logout():
	logout_user()
	return jsonify(success=True)



