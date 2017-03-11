from application import db
from datetime import datetime

class Link(db.Model):
	__tablename__ = "links"

	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String, unique=True)
	lead = db.Column(db.Boolean)
	timestamp = db.Column(db.DateTime)
	tag = db.Column(db.String)

	def __init__(self, url, lead, date, tag):
		self.url = url
		self.lead = lead
		self.timestamp = datetime.now()
		self.date_published = date
		self.tag = tag

	@property
	def serialize(self):
		return {
			'id': self.id,
			'url': self.url,
			'lead': self.lead,
			'tag': self.tag
		}

	def __repr__(self):
		return '<Link %r>' % self.url


class Tag(db.Model):
	__tablename__ = "tags"

	id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String, unique=True)

	def __init__(self, name):
		self.name = name

	def __repr(self):
		return '<Tag %r>' % self.name