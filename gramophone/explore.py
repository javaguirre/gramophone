import os

from hsaudiotag import auto


def explore_collection(path):
    tracks = []

    for (path, dirs, files) in os.walk(path):
        for f in files:
            if f.split('.')[-1] == 'mp3':
                abs_path = os.path.join(path, f)
                tags = auto.File(abs_path)
                track = (abs_path, tags.title, tags.track,
                         tags.duration, tags.artist, tags.album)
                tracks.append(track)

    return tracks
