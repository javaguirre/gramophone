# -*- coding: utf-8 -*-
from contextlib import closing
from collections import namedtuple

from flask import Blueprint, g, current_app
import sqlite3


# A blueprint is similar to an app object, see http://flask.pocoo.org/docs/blueprints/
blueprint = Blueprint('db', __name__)


def namedtuple_factory(cursor, row):
    """Namedtuple factory to be used with sqlite3."""
    fields = [col[0] for col in cursor.description]
    Row = namedtuple('Row', fields)
    return Row(*row)


def connect_db():
    """Connect to the database and return connection object."""
    con = sqlite3.connect(current_app.config['DATABASE'])
    con.row_factory = namedtuple_factory
    con.execute('PRAGMA foreign_keys = true')
    con.execute('PRAGMA encoding = "UTF-8"')
    return con


def init_db():
    """Initialize database with schema from `schema.sql`."""
    with closing(connect_db()) as db:
        with blueprint.open_resource('schema.sql') as f:
            db.cursor().executescript(f.read())
        db.commit()


@blueprint.before_app_request
def before_request():
    """Run the following code before each request."""
    g.db = connect_db()


@blueprint.teardown_app_request
def teardown_request(exception):
    """Run the following code before after each request has ended."""
    if hasattr(g, 'db'):
        g.db.close()


def create_tracks(tracks):
    cur = g.db.cursor()
    for track in tracks:
        cur.execute("""INSERT INTO tracks (path, title, track, duration,
                artist, album) VALUES (?,?,?,?,?,?)""", track)
    g.db.commit()


def update_tracks(tracks):
    cur = g.db.cursor()
    for track in tracks:
        query_track = cur.execute('SELECT path FROM tracks WHERE path=?', [track[0]]).fetchone()
        if not query_track:
            cur.execute("""INSERT INTO tracks (path, title, track, duration,
                       artist, album) VALUES (?,?,?,?,?,?)""", track)
    g.db.commit()


def select_tracks(album=None, artist=None):
    query = 'SELECT * FROM tracks'

    # TODO don't do string replacement!!!
    if album:
        query = ' '.join([query, "WHERE album='%s'" % album])
    elif artist:
        query = ' '.join([query, "WHERE artist='%s'" % artist])
    if not album and not artist:
        query = ' '.join([query, 'LIMIT 20'])

    return g.db.execute(query).fetchall()


def select_albums():
    return g.db.execute('SELECT DISTINCT(album) FROM tracks').fetchall()


def select_artists():
    return g.db.execute('SELECT DISTINCT(artist) FROM tracks').fetchall()
