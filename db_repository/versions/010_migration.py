from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
tag_group = Table('tag_group', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('name', String, nullable=False),
)

tagged = Table('tagged', post_meta,
    Column('tag_id', Integer),
    Column('link_id', Integer),
)

tag = Table('tag', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('name', String, nullable=False),
    Column('group_id', Integer),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['tag_group'].create()
    post_meta.tables['tagged'].create()
    post_meta.tables['tag'].columns['group_id'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['tag_group'].drop()
    post_meta.tables['tagged'].drop()
    post_meta.tables['tag'].columns['group_id'].drop()
