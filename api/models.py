from application import db
from datetime import datetime

class Link(db.Model):
	__tablename__ = "links"

	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String, unique=True)
	img_loc = db.Column(db.String, unique=True)
	timestamp = db.Column(db.DateTime)
	lead = db.Boolean()

	def __init__(self, url, lead, img_loc=""):
		self.url = url
		self.img_loc = img_loc
		self.lead = lead
		self.timestamp = datetime.now()

	@property
	def serialize(self):
		return {
			'id': self.id,
			'url': self.url,
			'img_loc': self.img_loc
		}

	def __repr__(self):
		return '<Link %r>' % self.url