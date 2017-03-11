from application import db
from datetime import datetime

class Link(db.Model):
	__tablename__ = "links"

	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String, unique=True)
	title = db.Column(db.String, unique=True)
	lead = db.Column(db.Boolean)
	timestamp = db.Column(db.DateTime)
	real_timestamp = db.Column(db.DateTime)
	tag = db.Column(db.String)

	def __init__(self, url, title, lead, tag, date=datetime.now()):
		self.url = url
		self.title = title
		self.lead = lead
		self.tag = tag
		self.timestamp = datetime.now()
		self.real_timestamp = date

	@property
	def serialize(self):
		return {
			'id': self.id,
			'url': self.url,
			'title': self.title,
			'lead': self.lead,
			'tag': self.tag,
			'timestamp': self.timestamp,
			'real_timestamp': self.real_timestamp
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