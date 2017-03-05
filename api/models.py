from application import db
from datetime import datetime

class Link(db.Model):
	__tablename__ = "links"

	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String, unique=True)
	img_src = db.Column(db.String)
	timestamp = db.Column(db.DateTime)
	lead = db.Boolean()

	def __init__(self, url, lead, img_src=""):
		self.url = url
		self.img_src = img_src
		self.lead = lead
		self.timestamp = datetime.now()

	@property
	def serialize(self):
		return {
			'id': self.id,
			'url': self.url,
			'img_src': self.img_src
		}

	def set_image(self, img_src):
		self.img_src=img_src

	def __repr__(self):
		return '<Link %r>' % self.url