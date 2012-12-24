# -*- coding: utf-8 -*-
import os

from hsaudiotag import auto


SUPPORTED_FILETYPES = ['mp3', 'mp4', 'ogg']


def explore_collection(original_path):
    tracks = []

    for (path, dirs, files) in os.walk(u'%s' % original_path):
        for f in files:
            if f.split('.')[-1] in SUPPORTED_FILETYPES:
                abs_path = os.path.join(path, f)
                tags = auto.File(abs_path)
                music_path = abs_path.replace(original_path, '')
                track = (music_path, tags.title, tags.track,
                         tags.duration, tags.artist, tags.album)
                tracks.append(track)

    return tracks
