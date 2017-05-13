#!/Users/Matt/.virtualenvs/chartrow/bin/python
from migrate.versioning import api
from application import db, application
import os.path
db.create_all()
if not os.path.exists(application.config['SQLALCHEMY_MIGRATE_REPO']):
    api.create(application.config['SQLALCHEMY_MIGRATE_REPO'], 'database repository')
    api.version_control(application.config['SQLALCHEMY_DATABASE_URI'], application.config['SQLALCHEMY_MIGRATE_REPO'])
else:
    api.version_control(application.config['SQLALCHEMY_DATABASE_URI'], application.config['SQLALCHEMY_MIGRATE_REPO'], api.version(application.config['SQLALCHEMY_MIGRATE_REPO']))
