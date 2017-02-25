import sys
import jsonpickle
from server import app, login_manager, twitter, socketio
from api.models import *

from flask import render_template, redirect, request, g, jsonify, session, Response
from flask_login import login_user, logout_user, current_user
from flask_socketio import emit

from tweepy.streaming import StreamListener
from tweepy import Stream

class TweetListener(StreamListener):
    def on_data(self, data):
        emit('tweet', data, broadcast=True)
        print(data)
        return True

    def on_error(self, status):
        print(status)

listener = TweetListener()
stream = Stream(twitter, listener)

@socketio.on('connected')
def stream_tweets(message):
    return Response(stream.filter(track=['maher']), content_type='text/event-stream')

# @twitter.tokengetter
# def get_twitter_token(token=None):
#     return ('833666853520150528-dAkmBZ6i1TW6PGuuxUyJSyfEl3yo9Kg','ZCNf0AYdlm28qDHVUM1M7C9Oe8CEc6JZHfgHm7FIUe9Ur')

@app.route('/')
def index():
	return render_template('index.html')

# @app.route('/api/get_tweets')
# def get_tweets():
# 	# home_timeline = twitter.get('statuses/home_timeline.json')
# 	return Response(stream.filter(track=['trump']), content_type='text/event-stream')

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



