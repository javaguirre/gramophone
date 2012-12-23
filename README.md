Gramophone
==========

Gramophone is a simple music server built with Python and Flask. Its goal is to
provide means to easily serve music on your server to the browser or to
applications supporting HTTP streaming.

It currently supports mp3, mp4 and ogg vorbis audio files.


Goals
-----

* Self-hosted
* Minimal yet usable
* HTML5 based playback directly in the browser (with Flash fallback)
* Filetype support: At least mp3 and ogg vorbis, if possible also flac
* UI to create and manipulate the current playlist on the fly
* Streamable playlists in m3u8 and xspf format
* Support for authentication
* last.fm scrobble integration


Setup
-----

    virtualenv venv
    . venv/bin/activate
    pip install -r requirements.txt
    python server.py

Visit `http://localhost:5000/update_db` to initialize or update the database.
