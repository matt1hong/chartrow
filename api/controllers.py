import sys
import jsonpickle
import json
import urllib
import urllib.request
import urllib.parse
from datetime import datetime
from application import application, twitter, socketio, login_manager
from api.models import *
import requests

from flask import render_template, redirect, request, g, jsonify, session, Response, url_for
from flask_socketio import emit
from flask_login import logout_user, login_user, current_user

from tweepy.streaming import StreamListener
from tweepy import Stream, TweepError, API

from bs4 import BeautifulSoup
from PIL import Image

user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'

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
		# import pprint; pprint.pprint(data.entities)
		# data = json.loads(data)
		to_emit = transform_data(data)
		emit('tweet', to_emit, broadcast=True)
		return True

	def on_error(self, status):
		print(status)


listener = TweetListener()
stream = Stream(twitter, listener)
twitter_api = API(twitter)

@socketio.on('connect')
def stream_tweets():
	try:
		print('Client connected')
		return Response(stream.userstream(), content_type='text/event-stream')
	except TweepError:
		return jsonify(success=True)
	except:
		return jsonify(success=False)


@socketio.on('disconnect')
def disconnect():
	print('Client disconnected')
	return

@login_manager.user_loader
def load_user(id):
	return User.query.get(int(id))

@application.route('/')
def index():
	return render_template('index.html', page='home')

@application.route('/admin')
def admin():
	if not current_user.is_anonymous:
		return render_template('index.html', page='admin')
	url = twitter.get_authorization_url()
	session['request_token'] = twitter.request_token
	return redirect(url)
	

@application.route('/api/login/authorized')
def authorized():
	if not current_user.is_anonymous:
		return render_template('index.html', page='admin')
	verifier = request.args.get('oauth_verifier')
	if verifier is None:
		return jsonify(error=True), 403
	twitter.request_token = session['request_token']
	del session['request_token']
	session['twitter_token'] = twitter.get_access_token(verifier)
	# import pdb;pdb.set_trace()
	username = twitter.get_username()
	if username == 'datavincillc':
		user = User.query.filter_by(name=username).first()
		if not user:
			user = User(name=username)
			db.session.add(user)
			db.session.commit()
		login_user(user, True)
		return render_template('index.html', page='admin')
	return render_template('index.html', page='home')

@application.route('/api/logout')
def logout():
	logout_user()
	return jsonify(success=True)

@application.route('/api/tweets')
def tweets():
	x = request.args.get('type').lower()
	if x=='likes':
		tweets = twitter_api.favorites(count=request.args.get('count'))
	elif x=='recents':
		tweets = twitter_api.home_timeline(count=request.args.get('count'))
	else:
		return jsonify(error=True), 400
	return jsonify(success=True, results=[transform_data(tweet) for tweet in tweets])

@application.route('/api/get_images')
def get_images():
	url = urllib.parse.unquote(request.args.get('link'))
	# opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor())
	header = {'User-Agent': user_agent,'Accept': accept}
	soup = BeautifulSoup(requests.get(url, headers=header).text, "html.parser")
	meta_tags = soup.select('meta[property*="image"],meta[name*="image"]')
	meta_content = [urllib.parse.urljoin(url, link['content']) for link in meta_tags if link.has_attr('content')]
	images = soup.select('img')
	img_links = [urllib.parse.urljoin(url, link['src']) for link in images if link.has_attr('src')]
	return jsonify(results=meta_content+img_links, success=True)


@application.route('/api/links/title')
def fetch_title():
	url = request.args.get('address')
	header = {'User-Agent': user_agent,'Accept': accept}
	soup = BeautifulSoup(requests.get(url, headers=header).text, "html.parser")
	title = soup.select('title')[0].text
	return jsonify(result={"title":title, "name": urllib.parse.urlparse(url).netloc}, success=True)


@application.route('/api/promote', methods=['POST'])
def promote():
	incoming = request.get_json()
	lead = incoming['lead']
	url = incoming['url']
	title = incoming['title']
	tag_query = incoming['tag']
	real_date = datetime.fromtimestamp(incoming['realTimestamp']/1000.0).isoformat()
	if db.session.query(Link).filter_by(url=url).count() < 1:
		tag = Tag.query.filter_by(name=tag_query).first()
		if not tag:
			tag = Tag(tag_query)
		link = Link(url, title, lead, real_date)
		tag.links.append(link)
		db.session.add(link)
		db.session.add(tag)
		db.session.commit()

		crop_size = incoming['cropPixels']
		if len(incoming['imgSrc']) and int(crop_size['width']):
			size_spec = [crop_size['x'], crop_size['y'], crop_size['width'], crop_size['height']]
			size_ratio = crop_size['height']/crop_size['width']
			read_image = urllib.request.urlopen(incoming['imgSrc'])
			im = Image.open(read_image)
			cropped = im.crop(tuple([int(spec) for spec in size_spec]))

			if lead:
				large = cropped.resize((400,int(400*size_ratio)), Image.ANTIALIAS)
				img_src = '%r-400.png' % link.id
				abs_src = '%s_src/images/%s' % (application.static_folder, img_src)
				large.save(abs_src, quality=95)
			
			small = cropped.resize((70,int(70*size_ratio)), Image.ANTIALIAS)
			img_src = '%r.png' % link.id
			abs_src = '%s_src/images/%s' % (application.static_folder, img_src)
			small.save(abs_src, quality=95)
			
			db.session.add(link)
			db.session.commit()

		return jsonify(success=True)
	return jsonify(success=False)

@application.route('/api/tags')
def tags():
	tags = Tag.query.all()
	return jsonify(success=True, results=[tag.name for tag in tags])

@application.route('/api/delete', methods=['POST'])
def delete():
	incoming = request.get_json()
	url = incoming['url']
	query = db.session.query(Link).filter_by(url=url)
	if query.count() > 0:
		query.delete()
		db.session.commit()
		return jsonify(success=True)
	return jsonify(success=False), 403

@application.route('/api/get_links')
def get_links():
	links = Link.query.limit(20).all()
	return jsonify(success=False, results=[link.serialize for link in links])

@application.route('/api/links/tagged')
def tagged_links():
	tag = Tag.query.filter_by(name=request.args.get('tag')).first()
	links = Link.query.filter_by(tag=tag).limit(20).all()
	return jsonify(success=False, results=[link.serialize for link in links])



