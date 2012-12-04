# FIXME Provisional proof of concept
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


def select_tracks(dbfile):
    conn = get_db_conn(dbfile)
    cursor = conn.cursor()
    tracks = cursor.execute('SELECT * FROM tracks LIMIT 20').fetchall()

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
