import os

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
        db.update_tracks(DBFILE, tracks)


cherrypy.quickstart(Root(), '/', config=config)
