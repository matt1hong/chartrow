import decimal
import flask.json
from flask_sqlalchemy import SQLAlchemy

class DecimalEncoder(flask.json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            # Convert decimal instances to strings.
            return str(obj)
        return super(DecimalEncoder, self).default(obj)



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