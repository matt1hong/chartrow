from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
events = Table('events', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('event_type', VARCHAR(length=255)),
    Column('timestamp', TIMESTAMP),
    Column('link', INTEGER),
)

links = Table('links', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('url', VARCHAR(length=255)),
    Column('timestamp', TIMESTAMP),
    Column('h', INTEGER),
    Column('w', INTEGER),
    Column('x', INTEGER),
    Column('y', INTEGER),
    Column('img_src', VARCHAR),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['events'].drop()
    pre_meta.tables['links'].columns['h'].drop()
    pre_meta.tables['links'].columns['w'].drop()
    pre_meta.tables['links'].columns['x'].drop()
    pre_meta.tables['links'].columns['y'].drop()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['events'].create()
    pre_meta.tables['links'].columns['h'].create()
    pre_meta.tables['links'].columns['w'].create()
    pre_meta.tables['links'].columns['x'].create()
    pre_meta.tables['links'].columns['y'].create()
