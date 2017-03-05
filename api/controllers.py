import sys
import jsonpickle
import urllib
import urllib.request
import urllib.parse
from application import app, twitter, socketio
from api.models import *

from flask import render_template, redirect, request, g, jsonify, session, Response
from flask_socketio import emit

from tweepy.streaming import StreamListener
from tweepy import Stream, TweepError

from bs4 import BeautifulSoup
from PIL import Image

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


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/api/get_images')
def get_images():
	url = urllib.parse.unquote(request.args.get('link'))
	r = urllib.request.build_opener(urllib.request.HTTPCookieProcessor()).open(url).read()
	soup = BeautifulSoup(r, "html.parser")
	meta_tags = soup.select('meta[property*="image"],meta[name*="image"]')
	meta_content = [urllib.parse.urljoin(url, link['content']) for link in meta_tags]
	images = soup.select('img')
	img_links = [urllib.parse.urljoin(url, link['src']) for link in images]
	return jsonify(results=meta_content+img_links, success=True)


@app.route('/api/promote', methods=['POST'])
def promote():
	incoming = request.get_json()
	lead = incoming['lead']

	url = incoming['url']
	if db.session.query(Link).filter_by(url=url).count() < 1:
		link = Link(url, lead)
		db.session.add(link)
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
				img_src = '%r-400.jpeg' % link.id
				abs_src = '%s_src/images/%s' % (app.static_folder, img_src)
				large.save(abs_src, quality=95)
			
			small = cropped.resize((70,int(70*size_ratio)), Image.ANTIALIAS)
			img_src = '%r.jpeg' % link.id
			abs_src = '%s_src/images/%s' % (app.static_folder, img_src)
			small.save(abs_src, quality=95)
			
			link.set_image(img_src)
			db.session.add(link)
			db.session.commit()

		return jsonify(success=True)
	return jsonify(success=False)

@app.route('/api/delete', methods=['POST'])
def delete():
	incoming = request.get_json()
	url = incoming['url']
	query = db.session.query(Link).filter_by(url=url)
	if query.count() > 0:
		query.delete()
		db.session.commit()
		return jsonify(success=True)
	return jsonify(success=False), 403

@app.route('/api/get_links')
def get_links():
	links = Link.query.limit(20).all()
	return jsonify(success=False, results=[link.serialize for link in links])

@app.route('/api/login', methods=['GET', 'POST'])
def login():
	pass

@app.route('/api/logout')
def logout():
	logout_user()
	return jsonify(success=True)



