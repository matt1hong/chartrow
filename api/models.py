from application import db
from datetime import datetime
from flask_login import UserMixin

class Tag(db.Model):

	id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String, unique=True, nullable=False)
	links = db.relationship('Link', backref='tag', lazy='dynamic')

	def __init__(self, name):
		self.name = name.capitalize()

	def __repr(self):
		return '<Tag %r>' % self.name

class Link(db.Model):

	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String, unique=True, nullable=False)
	title = db.Column(db.String, unique=True, nullable=False)
	lead = db.Column(db.Boolean)
	date = db.Column(db.DateTime)
	real_date = db.Column(db.DateTime, nullable=False)

	tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'))

	def __init__(self, url, title, lead, real_date=datetime.now().isoformat()):
		self.url = url
		self.title = title.capitalize()
		self.lead = lead
		self.date = datetime.now().isoformat()
		self.real_date = real_date

	@property
	def serialize(self):
		return {
			'id': self.id,
			'url': self.url,
			'title': self.title,
			'lead': self.lead,
			'tag': self.tag.name,
			'date': self.date,
			'real_date': self.real_date
		}

	def __repr__(self):
		return '<Link %r>' % self.url

class User(UserMixin, db.Model):

	id = db.Column(db.Integer, primary_key = True)
	name = db.Column(db.String, unique=True, nullable=False)

	def __repr__(self):
		return '<User %r>' % self.name


