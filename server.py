# -*- coding: utf-8 -*-
import os

from flask import Flask, render_template

import db
import explore


app = Flask(__name__)


app.config['PROJECT_ROOT'] = os.path.dirname(os.path.abspath(__file__))
app.config['MUSIC_PATH'] = os.environ.get('MUSIC_PATH', os.path.dirname('static/music/'))
app.config['DATABASE'] = os.path.join(app.config.get('PROJECT_ROOT'), 'gramo.db')


app.register_blueprint(db.blueprint)


### VIEWS ###

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/update_db/')
def update_db():
    tracks = explore.explore_collection(app.config['MUSIC_PATH'])

    DBFILE = app.config['DATABASE']
    if not os.path.isfile(DBFILE) or os.path.getsize(DBFILE) == 0:
        db.init_db()
        db.create_tracks(tracks)
        return 'created db and tracks'
    else:
        db.update_tracks(tracks)
        return 'updated tracks'


@app.route('/tracks/')
def tracks(album=None, artist=None):
    tracks = db.select_tracks(album, artist)
    track_list = []

    for track in tracks:
        track_list.append({
            'path': track[0],
            'title': track[1],
            'track': track[2],
            'duration': track[3],
            'artist': track[4],
            'album': track[5]
        })

    return track_list


@app.route('/artists/')
def artists():
    tracks = db.select_artists()
    artist_list = []

    for track in tracks:
        if track[0]:
            artist_list.append({
                'artist': track[0],
            })

    return artist_list


@app.route('/albums/')
def albums():
    tracks = db.select_albums()
    album_list = []

    for track in tracks:
        if track[0]:
            album_list.append({
                'album': track[0],
            })

    return album_list


### SERVER SETUP ###

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = True
    app.run(host='0.0.0.0', port=port, debug=debug)