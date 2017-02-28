from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
links = Table('links', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('url', String(length=255)),
    Column('timestamp', DateTime),
    Column('x', Integer),
    Column('y', Integer),
    Column('w', Integer),
    Column('h', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['links'].columns['h'].create()
    post_meta.tables['links'].columns['w'].create()
    post_meta.tables['links'].columns['x'].create()
    post_meta.tables['links'].columns['y'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['links'].columns['h'].drop()
    post_meta.tables['links'].columns['w'].drop()
    post_meta.tables['links'].columns['x'].drop()
    post_meta.tables['links'].columns['y'].drop()
