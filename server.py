import sys

from flask import Flask, render_template, session, redirect, request, url_for, g, jsonify
from flask_restful import reqparse, Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_script import Manager, Server

from utils import DecimalEncoder

class SQLAlchemyPlus(SQLAlchemy):
	def _execute_for_all_tables(self, app, bind, operation, **kwargs):
		app = self.get_app(app)
		binds = [None] + list(app.config.get('SQLALCHEMY_BINDS') or ())

		for bind in binds:
			tables = self.get_tables_for_bind(bind)
			op = getattr(self.Model.metadata, operation)
			op(bind=self.get_engine(app, bind), tables=tables, **kwargs)

	def reflect(self, bind='__all__', app=None, **kwargs):
		self._execute_for_all_tables(app, bind, 'reflect', **kwargs)


app = Flask(__name__)
app.config.from_object('config')
app.json_encoder = DecimalEncoder

db = SQLAlchemyPlus(app)

parser = reqparse.RequestParser()


login_manager = LoginManager()
login_manager.init_app(app)



from api.controllers import *



manager = Manager(app)
manager.add_command("runserver", Server(host='127.0.0.1'))

if __name__ == '__main__':
	manager.run()
