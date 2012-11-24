import cherrypy
from jinja2 import Environment, FileSystemLoader

env = Environment(loader=FileSystemLoader('templates'))


class Root(object):
    @cherrypy.expose
    def index(self):
        tmpl = env.get_template('index.html')
        return tmpl.render()

config = {'/':
            {
            'tools.staticdir.root': '/home/javaguirre/Proyectos/python/gramophone',
            'tools.staticdir.on': True,
            'tools.staticdir.dir': 'static'
            }
         }

cherrypy.quickstart(Root(), '/', config=config)
