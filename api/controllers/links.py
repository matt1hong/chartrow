import sys
import urllib
import urllib.request
import urllib.parse
from datetime import datetime

from flask import render_template, request, jsonify
from application import application, s3_bucket

import requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO

from api.models import *

user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'

def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

@application.route('/api/links/')
def get_links():
	links = Link.query.filter_by(published=True).limit(50).all()
	return jsonify(success=True, results=[link.serialize for link in links])

@application.route('/api/links/all')
def all_links():
	links = Link.query.limit(50).all()
	return jsonify(success=True, results=[link.serialize for link in links])

@application.route('/api/links/tagged')
def tagged_links():
	tlinks = Link.query.filter(Link.tags.any(name=request.args.get('tag')))
	links = tlinks.filter_by(published=True).all()
	if len(links) > 0:
		return jsonify(success=True, results=[link.serialize for link in links])
	else:
		return jsonify(success=True, results=[])
	return jsonify(error=True), 403


@application.route('/api/links/publish_all', methods=['POST'])
def publish_links():
	links = Link.query.filter_by(published=False).all()
	if len(links) > 0:
		for link in links:
			link.published = True
		db.session.commit()
		return jsonify(success=True)
	return jsonify(error=True), 403

@application.route('/api/links/tags')
def tags():
	tags = Tag.query.all()
	if len(tags) > 0:
		return jsonify(success=True, results=[[tag.tag_group.name, tag.name] for tag in tags])
	return jsonify(error=True), 403

def create_tags():
	topic = TagGroup.query.filter_by(name='Topic').first()
	if not topic:
		topic = TagGroup('Topic')
		db.session.add(topic)
	genre = TagGroup.query.filter_by(name='Genre').first()
	if not genre:
		genre = TagGroup('Genre')
		db.session.add(genre)
	theme = TagGroup.query.filter_by(name='Theme').first()
	if not theme:
		theme = TagGroup('Theme')
		db.session.add(theme)
	for x in ['Annotated charts', 'Posters', 'Comic strips', 'Slide shows', 'Movies', 'Articles', 'Trackers']:
		tag = Tag.query.filter_by(name=x)
		if not tag:
			tag = Tag(x)
			db.session.add(tag)
			genre.tags.append(tag)
	for x in ['Trends', 'Outliers', 'Networks', 'Averages', 'Groups']:
		tag = Tag.query.filter_by(name=x)
		if not tag:
			tag = Tag(x)
			db.session.add(tag)
			theme.tags.append(tag)
	db.session.commit()
	return

@application.route('/api/links/delete', methods=['POST'])
def delete():
	incoming = request.get_json()
	url = incoming['url']
	query = db.session.query(Link).filter_by(url=url)
	if query.count() > 0:
		query.delete()
		db.session.commit()
		return jsonify(success=True)
	return jsonify(success=False), 403

@application.route('/api/links/promote', methods=['POST'])
def promote():
	incoming = request.get_json()
	lead = incoming['lead']
	url = incoming['url']
	title = incoming['title']
	tags = incoming['tags']
	crop_size = incoming['cropPixels']
	if len(incoming['imgSrc']) and int(crop_size['width']):
		print([crop_size['x'], crop_size['y'], crop_size['width'], crop_size['height']])
	real_date = datetime.fromtimestamp(incoming['realTimestamp']/1000.0).isoformat()
	if db.session.query(Link).filter_by(url=url).count() < 1:
		link = Link(url, title, lead, real_date)
		db.session.add(link)
		
		for t in tags:
			tag_query = t[1]
			tag = Tag.query.filter_by(name=tag_query).first()
			if not tag and t[0] == 'Topic':
				tag = Tag(tag_query)
				db.session.add(tag)
				tag_group = TagGroup.query.filter_by(name='Topic').first()
				tag_group.tags.append(tag)
			tag.links.append(link)

		crop_size = incoming['cropPixels']
		if len(incoming['imgSrc']) and int(crop_size['width']):

			size_spec = [
				crop_size['x'], 
				crop_size['y'], 
				crop_size['width']+crop_size['x'], 
				crop_size['height']+crop_size['y']
			]
			size_ratio = crop_size['height']/crop_size['width']
			read_image = urllib.request.urlopen(incoming['imgSrc']).read()
			im = Image.open(BytesIO(read_image))

			cropped = im.crop(tuple([int(spec) for spec in size_spec]))
			if lead:
				large = cropped.resize((400,int(400*size_ratio)), Image.ANTIALIAS)
				large_src = '%r-400.png' % link.id
				# abs_src = '%s_src/images/%s' % (application.static_folder, large_src)
				large_file = BytesIO()
				large.save(large_file, 'png', quality=95)
				large_key = s3_bucket.new_key(large_src)
				large_key.set_contents_from_string(large_file.getvalue())
			small = cropped.resize((70,int(70*size_ratio)), Image.ANTIALIAS)
			small_src = '%r.png' % link.id
			# abs_src = '%s_src/images/%s' % (application.static_folder, small_src)
			small_file = BytesIO()
			small.save(small_file, 'png', quality=95)
			small_key = s3_bucket.new_key(small_src)
			small_key.set_contents_from_string(small_file.getvalue())
			
			db.session.add(link)
			db.session.commit()

		return jsonify(success=True)
	return jsonify(success=False)


@application.route('/api/links/external/page_title')
def fetch_title():
	url = request.args.get('address')
	header = {'User-Agent': user_agent,'Accept': accept}
	soup = BeautifulSoup(requests.get(url, headers=header).text, "html.parser")
	title = soup.select('title')[0].text
	return jsonify(result={"title":title, "name": urllib.parse.urlparse(url).netloc}, success=True)



@application.route('/api/links/external/images')
def get_images():
	url = urllib.parse.unquote(request.args.get('link'))
	# opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor())
	header = {'User-Agent': user_agent,'Accept': accept}
	soup = BeautifulSoup(requests.get(url, headers=header).text, "html.parser")
	meta_tags = soup.select('meta[property*="image"],meta[name*="image"]')
	meta_content = [
		urllib.parse.urljoin(url, link['content']) 
			for link in meta_tags 
			if link.has_attr('content') and not is_number(link['content'])
	]
	images = soup.select('img')
	img_links = [urllib.parse.urljoin(url, link['src']) for link in images if link.has_attr('src') and 'gif' not in link['src'].lower()]

	return jsonify(results=list(set(meta_content+img_links)), success=True)



