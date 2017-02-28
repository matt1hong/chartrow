from server import db

class Link(db.Model):
	__tablename__ = "links"

	id = db.Column(db.Integer, primary_key=True)
	url = db.Column(db.String(255), unique=True)
	timestamp = db.Column(db.DateTime)
	events = db.relationship('Event', backref='hyperlink', lazy='dynamic')

	def __init__(self, url):
		self.url = url

	def __repr__(self):
		return '<Link %r>' % self.url


class Event(db.Model):
	__tablename__ = "events"

	id = db.Column(db.Integer, primary_key=True)
	event_type = db.Column(db.String(255))
	timestamp = db.Column(db.DateTime)
	link = db.Column(db.Integer, db.ForeignKey('links.id'))

	def __init__(self, event_type):
		self.event_type = event_type

	def __repr__(self):
		return '<Event %r>' % self.type