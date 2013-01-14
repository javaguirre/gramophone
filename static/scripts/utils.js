var app = app || {};

app.utils = {
    checkTrackFormat: function(path) {
        if(path.indexOf('.mp3', path.length - 4) !== -1) {
            return 'mp3';
        } else if(path.indexOf('.ogg', path.length -4) !== -1) {
            return 'oga';
        }
    },

    addTrack: function(track) {
        var format = this.checkTrackFormat(track.get('path'));
        var track_obj = {title: track.get('title') || track.get('path'),
                         artist: track.get('artist'),
                         album: track.get('album'),
                         /*poster: '/static/img/poster.jpg'*/
                         duration: track.get('duration')};
        track_obj[format] = '/static/music' + track.get('path');
        app.playerObj.add(track_obj);
    },

    addTracks: function(tracks) {
        var self = this;
        _.each(tracks, function(track) {
            self.addTrack(track);
        });
    },

    initPlayer: function() {
        var self = this;
        var myPlaylist = new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1"
        }, [], {
            playlistOptions: {
                enableRemoveControls: true
                },
                swfPath: "/static/scripts/vendor",
                supplied: "oga, mp3",
                solution: "flash, html",
                ended: function() {
                    self.scrobble();
                },
                play: function() {
                    self.hidePlaylist(true);
                }
        });

        return myPlaylist;
    },

    hidePlaylist: function(hide) {
        var playlist_tracks = $('.jp-playlist ul').children();
        var tracks_count = playlist_tracks.length;

        if($('.jp-playlist').is(':visible')) {
            $('#hide_playlist').html(tracks_count + ' <i class="icon-list-alt"></i>');
        }
        else {
            $('#hide_playlist').html('<i class="icon-list-alt"></i>');
        }
        if(hide) {
            playlist_tracks.filter('.jp-playlist-current').show();
            playlist_tracks.not('.jp-playlist-current').hide();
        }
        else {
            playlist_tracks.not('.jp-playlist-current').slideToggle();
        }
    },

    scrobble: function(track) {
    }
};
