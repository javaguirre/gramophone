# FIXME Provisional proof of concept
# this will be a class
import sqlite3


def get_db_conn(dbfile):
    conn = sqlite3.connect(dbfile, check_same_thread=False)

    return conn


def init_db(dbfile):
    conn = get_db_conn(dbfile)
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE tracks (path text, title text,
                   track int, duration int, artist text, album text)""")
    conn.commit()


def create_tracks(dbfile, tracks):
    conn = get_db_conn(dbfile)
    cursor = conn.cursor()
    #cursor.execute("""INSERT INTO tracks (path, title, track, duration,
                       #artist, album) VALUES (?,?,?,?,?,?)""", tracks)
    for track in tracks:
        cursor.execute("""INSERT INTO tracks (path, title, track, duration,
                   artist, album) VALUES (?,?,?,?,?,?)""", track)
    conn.commit()


def update_tracks(dbfile, tracks):
    conn = get_db_conn(dbfile)
    cursor = conn.cursor()

    for track in tracks:
        query_track = cursor.execute('SELECT path FROM tracks WHERE path=?', track[0]).fetchone()
        if not query_track:
            cursor.execute("""INSERT INTO tracks (path, title, track, duration,
                       artist, album) VALUES (?,?,?,?,?,?)""", track)
    conn.commit()


def select_tracks(dbfile, album=None, artist=None):
    conn = get_db_conn(dbfile)
    cursor = conn.cursor()
    query = 'SELECT * FROM tracks'

    if album:
        query = ' '.join([query, "WHERE album='%s'" % album])
    elif artist:
        query = ' '.join([query, "WHERE artist='%s'" % artist])
    if not album and not artist:
        query = ' '.join([query, 'LIMIT 20'])

    tracks = cursor.execute(query).fetchall()

    return tracks


def select_albums(dbfile):
    conn = get_db_conn(dbfile)
    cursor = conn.cursor()
    albums = cursor.execute('SELECT DISTINCT(album) FROM tracks').fetchall()

    return albums


def select_artists(dbfile):
    conn = get_db_conn(dbfile)
    cursor = conn.cursor()
    artists = cursor.execute('SELECT DISTINCT(artist) FROM tracks').fetchall()

    return artists
