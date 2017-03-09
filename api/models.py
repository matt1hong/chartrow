from application import db
from datetime import datetime

class Link(db.Model):
	__tablename__ = "links"

	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String, unique=True)
	lead = db.Boolean()
	timestamp = db.Column(db.DateTime)

	def __init__(self, url, lead, img_src=""):
		self.url = url
		self.lead = lead
		self.timestamp = datetime.now()

	@property
	def serialize(self):
		return {
			'id': self.id,
			'url': self.url
		}

	def __repr__(self):
		return '<Link %r>' % self.url