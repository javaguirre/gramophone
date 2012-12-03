# -*- coding: utf-8 -*-
import os
import json

import cherrypy
from jinja2 import Environment, FileSystemLoader

import db
import explore


DBFILE = 'gramo.db'
MUSIC_PATH = '/home/javaguirre/Musica'
env = Environment(loader=FileSystemLoader('templates'))
config = {'/':
            {
            'tools.staticdir.root': '/home/javaguirre/Proyectos/python/gramophone',
            'tools.staticdir.on': True,
            'tools.staticdir.dir': 'static',
            'music_collection': '/home/javaguirre/Musica',
            'dbfile': 'gramophone.db'
            }
         }


class Root(object):
    @cherrypy.expose
    def index(self):
        tmpl = env.get_template('index.html')
        tracks = db.select_tracks(DBFILE)

        return tmpl.render()

    @cherrypy.expose
    def update_db(self):
        tracks = explore.explore_collection(MUSIC_PATH)

        if not os.path.isfile(DBFILE) or os.path.getsize(DBFILE == 0):
            db.init_db(DBFILE)
            db.create_tracks(DBFILE, tracks)
        else:
            db.update_tracks(DBFILE, tracks)

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def tracks(self):
        tracks = db.select_tracks(DBFILE)
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


cherrypy.quickstart(Root(), '/', config=config)
