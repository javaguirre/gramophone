//FIXME Provisional until we got namespacing
var utils = {
    addTrack: function(track) {
        //TODO Check if its ogg or mp3
        Gramophone.player.add({title: track.get('title') || track.get('path'),
                               artist: track.get('artist'),
                               album: track.get('album'),
                               duration: track.get('duration'),
                               mp3: '/static/music' + track.get('path')});
    },

    addTracks: function(tracks) {
        _.each(tracks, function(track) {
            utils.addTrack(track);
        });
    },

    initPlayer: function() {
        var myPlaylist = new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1"
        }, [], {
            playlistOptions: {
                enableRemoveControls: true
                },
                swfPath: "/static/scripts/vendor",
                supplied: "oga, mp3"
        });

        return myPlaylist;
    }
};

var Gramophone = {
    init: function() {
        Gramophone.appView = new AppView({});
        Gramophone.router = new MyRouter();
        Gramophone.player = utils.initPlayer();
        Backbone.history.start();
    }
};

(function() {
    var Artist = Backbone.Model.extend({});
    var Album = Backbone.Model.extend({});
    var Track = Backbone.Model.extend({});

    var GenericCol = Backbone.Collection.extend({
        parse: function(resp, xhr) {
            return resp.objects;
        }
    });

    var ArtistList = GenericCol.extend({
        model: Artist,
        url: '/artists',

        comparator: function(artist) {
            return artist.get("artist").toLowerCase();
        }
    });

    var AlbumList = GenericCol.extend({
        model: Album,
        url: '/albums',

        comparator: function(artist) {
            return artist.get("album").toLowerCase();
        }
    });

    var TrackList = GenericCol.extend({
        model: Track,
        url: function() {
            if(this.query) {
                return '/tracks?' + this.query;
            }
            return '/tracks';
        },

        initialize: function(options) {
            this.query = '';
            if (options.query) {
                this.query = options.query;
            }
        },

        search: function(letters){
            if(letters === "")
                return this;

            var pattern = new RegExp(letters,"gi");
            return _(this.filter(function(data) {
                return pattern.test(data.get("title")) ||
                       pattern.test(data.get('path'));
            }));
        }
    });

    var AlbumView = Backbone.View.extend({
        events: {
            'click .go-to-tracks': 'goToTracks',
            'click .add-album-to-playlist': 'addToPlaylist'
        },
        tagName:  "li",
        template: _.template($('#template-album').html()),

        initialize: function(options) {
        },

        render: function() {
            var self = this;
            this.el.innerHTML = self.template({ album: self.model.toJSON() });

            return this;
        },

        addToPlaylist: function() {
            var tracks = new TrackList({query: "album=" + encodeURIComponent(this.model.get('album'))});
            tracks.fetch({
                success: function(data) {
                    utils.addTracks(data.models);
                }
            });
        },

        goToTracks: function() {
            Gramophone.router.navigate('!/filter/album/' + encodeURIComponent(this.model.get('album')), true);
        }
    });

    var ArtistView = Backbone.View.extend({
        events: {
            'click .go-to-tracks': 'goToTracks',
            'click .add-artist-to-playlist': 'addToPlaylist'
        },
        tagName:  "li",
        template: _.template($('#template-artist').html()),

        initialize: function(options) {},

        render: function() {
            var self = this;

            this.el.innerHTML = self.template({ artist: self.model.toJSON() });

            return this;
        },

        addToPlaylist: function() {
            var tracks = new TrackList({query: "artist=" + encodeURIComponent(this.model.get('artist'))});
            tracks.fetch({
                success: function(data) {
                    utils.addTracks(data.models);
                }
            });
        },

        goToTracks: function() {
            Gramophone.router.navigate('!/filter/artist/' + encodeURIComponent(this.model.get('artist')), true);
        }
    });

    var TrackView = Backbone.View.extend({
        events: {
            'click .add-track-to-playlist': 'addToPlaylist'
        },
        tagName:  "li",
        template: _.template($('#template-track').html()),

        initialize: function(options) {},

        render: function() {
            var self = this;

            this.el.innerHTML = self.template({ track: self.model.toJSON() });

            return this;
        },

        addToPlaylist: function() {
            utils.addTrack(this.model);
        }
    });

    window.AppView = Backbone.View.extend({
        el: $('#app'),
        events: {
            'click #add-all-to-playlist': 'addAllToPlaylist',
            'click #searchTask' : 'search'
        },
        template: _.template($('#template-app').html()),

        initialize: function(options) {
            this.parentElt = $('#track-list-app');
        },

        render: function() {
            var self = this;
            return this;
        },

        renderList : function(tracks){
            $('#track-list').html("");

            tracks.each(function(track){
                var view = new TrackView({
                    model: track,
                    objects: this.objects
                });
                $("#track-list").append(view.render().el);
            });

            return this;
        },

        setView: function(options) {
            switch(options.view) {
                case('track'):
                    this.objects = new TrackList({query: options.query});
                    break;
                case('album'):
                    this.objects = new AlbumList();
                    break;
                case('artist'):
                    this.objects = new ArtistList();
                    break;
                default:
                    this.objects = new TrackList({query: query});
                    break;
            }

            this.objects.bind('add',   this.addOne, this);
            this.objects.bind('reset', this.addAll, this);
            this.objects.bind('all',   this.render, this);
            this.objects.fetch();

            this.parentElt.html('').append(this.template(this.objects));
        },

        addOne: function(object) {
            var view;

            if(object instanceof Track) {
                view = new TrackView({model: object});
            }
            else if(object instanceof Artist) {
                view = new ArtistView({model: object});
            }
            else if(object instanceof Album) {
                view = new AlbumView({model: object});
            }
            this.$("#track-list").append(view.render().el);
        },

        addAll: function() {
            this.objects.each(this.addOne);
        },

        addAllToPlaylist: function() {
            utils.addTracks(this.objects.models);
        },

        search: function(e) {
            var letters = $("#searchText").val();
            this.renderList(this.objects.search(letters));
        }
    });

    window.MyRouter = Backbone.Router.extend({
        routes: {
            "!/": "index",
            "!/filter/:type/:query": "filter",
            "!/search/:query": "search",
            "!/artists": "artists",
            "!/albums": "albums"
        },

        index: function() {
            Gramophone.appView.setView({view: 'track'});
        },

        filter: function(type, query) {
            Gramophone.appView.setView({view: 'track', query: type + "=" + query});
        },

        artists: function() {
            Gramophone.appView.setView({view: 'artist'});
        },

        albums: function() {
            Gramophone.appView.setView({view: 'album'});
        }
    });
}());
