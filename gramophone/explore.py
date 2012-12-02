import os

from hsaudiotag import auto


def explore_collection(path):
    tracks = []

    for (path, dirs, files) in os.walk(path):
        for f in files:
            track = []
            abs_path = os.path.join(path, f)
            tags = auto.File(abs_path)
            track.append(abs_path)
            track.append(tags.title)
            track.append(tags.track)
            track.append(tags.duration)
            track.append(tags.artist)
            track.append(tags.album)
            tracks.append(track)

    return tracks
