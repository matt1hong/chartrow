from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
links = Table('links', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('url', String),
    Column('title', String),
    Column('lead', Boolean),
    Column('timestamp', DateTime),
    Column('real_timestamp', DateTime),
    Column('tag', String),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['links'].columns['real_timestamp'].create()
    post_meta.tables['links'].columns['title'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['links'].columns['real_timestamp'].drop()
    post_meta.tables['links'].columns['title'].drop()
