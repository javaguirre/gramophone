-- Schema for gramophone metadata database.

CREATE TABLE tracks (
    path TEXT,
    title TEXT,
    track INTEGER,
    duration INTEGER,
    artist TEXT,
    album TEXT
)
