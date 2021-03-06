from application import application, twitter, socketio, login_manager
from api.models import *

from flask import jsonify, Response, request, url_for, redirect, session, stream_with_context
from flask_socketio import emit

from tweepy.streaming import StreamListener
from tweepy import Stream, TweepError, API
import socket

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
			'id': data.id_str,
			'url': urls[0]['expanded_url'],
			'title': txt,
			'timestamp_ms': data.created_at.timestamp(),
			'user_name': data.user.name,
			'screen_name': data.user.screen_name,
			'tweet': 'https://twitter.com/%s/status/%s'%(data.user.screen_name, data.id_str)
		}
	else:
		pass
	return to_emit



class TweetListener(StreamListener):
	def __init__(self, sid):
		StreamListener.__init__(self)
		self.sid = sid

	def on_status(self, data):
		to_emit = transform_data(data)
		with application.test_request_context('/'):
			try:
				socketio.emit('tweet', to_emit, broadcast=True)
			except socket.timeout:
				print("Socket timed out. Disconnecting...")
				socketio.server.disconnect(self.sid) 
				return False
		return True

	def on_error(self, status):
		if status == 401:
			print('SocketIO disconnected') 
			socketio.server.disconnect(self.sid) 
		socketio.emit('error', status, broadcast=True)


twitter_api = API(twitter)
streams = []

@socketio.on('connect')
def stream_tweets():
	listener = TweetListener(request.sid)
	stream = Stream(twitter, listener)
	streams.append(stream)
	try:
		print('Client connected') 
		stream.userstream(async=True)
	except TweepError:
		return jsonify(success=True)
	except:
		print('TweepError on stream_tweets')
		return jsonify(success=False)


@socketio.on('disconnect')
def disconnect():
	for stream in streams:
		stream.disconnect()
		del stream
	print('Client disconnected')
	return

@application.route('/api/tweets/unlike', methods=['POST'])
def unlike():
	incoming = request.get_json()
	i = incoming['id']
	try:
		twitter_api.destroy_favorite(int(i))
		return jsonify(success=True)
	except:
		return jsonify(error=True)

@application.route('/api/tweets/tweet', methods=['POST'])
def tweet():
	incoming = request.get_json()
	tweet = incoming['tweet']
	try:
		tweet_text = '%s %s' % (tweet['title'].strip(), tweet['url'].strip())
		print(tweet_text)
		twitter_api.update_status(tweet_text)
		return jsonify(success=True)
	except:
		return jsonify(error=True)

@application.route('/api/tweets')
def tweets():
	x = request.args.get('type').lower()
	try:
		if x=='likes':
			tweets = twitter_api.favorites(page=request.args.get('page'))
		elif x=='recents':
			tweets = twitter_api.home_timeline(page=request.args.get('page'))
		else:
			return jsonify(error=True), 400
	except:
		return redirect(url_for('logout'))
	return jsonify(success=True, results=[transform_data(tweet) for tweet in tweets])