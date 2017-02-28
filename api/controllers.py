import sys
import jsonpickle
import urllib
from server import app, twitter, socketio
from api.models import *

from flask import render_template, redirect, request, g, jsonify, session, Response
from flask_socketio import emit

from tweepy.streaming import StreamListener
from tweepy import Stream, TweepError

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
	try:
		return Response(stream.filter(track=['fivethirtyeight']), content_type='text/event-stream')
	except TweepError:
		return jsonify(success=True)
	except:
		return jsonify(success=False)

# @socketio.on('disconnect')
# def stop_streaming():
# 	stream.disconnect()


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/api/get_images')
def get_images():
	url = urllib.parse.unquote(request.args.get('link'))
	r = urllib.request.urlopen(url).read()
	soup = BeautifulSoup(r, "html.parser")
	links = soup.findAll('img')
	return jsonify(results=[urllib.parse.urljoin(url, link['src']) for link in links], success=True)

@app.route('/api/promote', methods=['POST'])
def promote():
	url = request.args['url']
	if db.session.query(Link).filter(Link.url == url).count() < 1:
		link = Link(url)
		db.session.add(link)
		db.session.commit()
		return jsonify(success=True)
	return jsonify(success=False)

@app.route('/api/login', methods=['GET', 'POST'])
def login():
	pass

@app.route('/api/logout')
def logout():
	logout_user()
	return jsonify(success=True)



