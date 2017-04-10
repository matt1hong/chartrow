from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
tags = Table('tags', pre_meta,
    Column('id', INTEGER, primary_key=True, nullable=False),
    Column('name', VARCHAR),
)

link = Table('link', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('url', String, nullable=False),
    Column('title', String, nullable=False),
    Column('lead', Boolean),
    Column('date', DateTime),
    Column('real_date', DateTime, nullable=False),
    Column('tag_id', Integer),
)

tag = Table('tag', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('name', String, nullable=False),
)

user = Table('user', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('name', String, nullable=False),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['tags'].drop()
    post_meta.tables['link'].create()
    post_meta.tables['tag'].create()
    post_meta.tables['user'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    pre_meta.tables['tags'].create()
    post_meta.tables['link'].drop()
    post_meta.tables['tag'].drop()
    post_meta.tables['user'].drop()
