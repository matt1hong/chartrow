from flask import request, jsonify
from application import application


from api.models import *

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

@application.route('/api/links/tags')
def tags():
	tags = Tag.query.all()
	if len(tags) > 0:
		return jsonify(success=True, results=[[tag.tag_group.name, tag.name] for tag in tags])
	return jsonify(error=True), 403
