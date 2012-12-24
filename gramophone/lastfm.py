import urllib2
from urllib import urlencode
import json

LASTFM_URL = 'http://ws.audioscrobbler.com/2.0'
API_KEY = ''


def get_similar_artist(artist):
    """docstring for get_similar_artist"""
    params = {'method': 'artist.getsimilar',
              'artist': artist,
              'api_key': API_KEY,
              'format': 'json'}
    response = urllib2.urlopen('/?'.join([LASTFM_URL, urlencode(params)]))
    response_json = response.read()
    return json.loads(response_json)
