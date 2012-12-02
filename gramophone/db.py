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


def update_tracks(dbfile, tracks):
    conn = get_db_conn(dbfile)
    cursor = conn.cursor()
    cursor.executemany("""INSERT INTO tracks (path, title, track, duration,
                       artist, album) VALUES (?,?,?,?,?,?)""", tracks)
    conn.commit()


def select_tracks(dbfile):
    conn = get_db_conn(dbfile)
    cursor = conn.cursor()
    tracks = cursor.execute('SELECT * FROM tracks LIMIT 20').fetchall()

    return tracks
