from application import application, twitter, socketio, login_manager
from api.models import *

from flask import jsonify, Response, request, url_for, redirect, session
from flask_socketio import emit

from tweepy.streaming import StreamListener
from tweepy import Stream, TweepError, API

def transform_data(data):
	urls = data.entities['urls']
	to_emit = {}
	if len(urls) > 0 and len(urls[0]['expanded_url']) > 0:
		txt = data.text
		spl = txt.split()
		links = [s for s in spl if s.startswith('http')]
		for l in links:
			txt = txt.replace(l, '')

		to_emit = {
			'url': urls[0]['expanded_url'],
			'text': txt,
			'timestamp_ms': data.created_at.timestamp(),
			'user_name': data.user.name,
			'screen_name': data.user.screen_name,
			'tweet': 'https://twitter.com/%s/status/%s'%(data.user.screen_name, data.id_str)
		}
	else:
		pass
	return to_emit


class TweetListener(StreamListener):
	def on_status(self, data):
		to_emit = transform_data(data)
		emit('tweet', to_emit, broadcast=True)
		return True

	def on_error(self, status):
		print(status)

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

listener = TweetListener()
twitter_api = API(twitter)

@socketio.on('connect')
def stream_tweets():
	try:
		print('Client connected')
		with Stream(twitter, listener) as stream: 
			return Response(stream.userstream(), content_type='text/event-stream')
	except TweepError:
		return jsonify(success=True)
	except:
		return jsonify(success=False)


@socketio.on('disconnect')
def disconnect():
	print('Client disconnected')
	return

@application.route('/api/tweets')
def tweets():
	x = request.args.get('type').lower()
	try:
		if x=='likes':
			tweets = twitter_api.favorites(count=request.args.get('count'))
		elif x=='recents':
			tweets = twitter_api.home_timeline(count=request.args.get('count'))
		else:
			return jsonify(error=True), 400
	except:
		return redirect(url_for('logout'))
	return jsonify(success=True, results=[transform_data(tweet) for tweet in tweets])