from application import db
from datetime import datetime

class Tag(db.Model):
	__tablename__ = "tags"

	id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String, unique=True)
	links = db.relationship('Link', backref='tag', lazy='dynamic')

	def __init__(self, name):
		self.name = name

	def __repr(self):
		return '<Tag %r>' % self.name

class Link(db.Model):
	__tablename__ = "links"

	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String, unique=True)
	title = db.Column(db.String, unique=True)
	lead = db.Column(db.Boolean)
	timestamp = db.Column(db.DateTime)
	real_timestamp = db.Column(db.DateTime)

	tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'))

	def __init__(self, url, title, lead, date=datetime.now()):
		self.url = url
		self.title = title
		self.lead = lead
		self.timestamp = datetime.now()
		self.real_timestamp = date

	@property
	def serialize(self):
		return {
			'id': self.id,
			'url': self.url,
			'title': self.title,
			'lead': self.lead,
			'tag': self.tag.name,
			'timestamp': self.timestamp,
			'real_timestamp': self.real_timestamp
		}

	def __repr__(self):
		return '<Link %r>' % self.url


