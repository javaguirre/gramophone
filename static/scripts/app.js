(function() {
    var TEMPLATE_URL = '';
    var template_track;
    var template_album;
    var template_artist;

    //FIXME Provisional
    $.get(TEMPLATE_URL + '/templates/item.html', function(data) {
        template_track = data;
    });
    $.get(TEMPLATE_URL + '/templates/album.html', function(data) {
        template_album = data;
    });
    $.get(TEMPLATE_URL + '/templates/artist.html', function(data) {
        template_artist = data;
    });

    var Artist = Backbone.Model.extend({});
    var Album = Backbone.Model.extend({});
    var Track = Backbone.Model.extend({});

    var ArtistList = Backbone.Collection.extend({
        model: Artist,
        url: '/artists',

        comparator: function(artist) {
            return artist.get("artist").toLowerCase();
        }
    });

    var AlbumList = Backbone.Collection.extend({
        model: Album,
        url: '/albums',

        comparator: function(artist) {
            return artist.get("album").toLowerCase();
        }
    });

    var TrackList = Backbone.Collection.extend({
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
        }
    });

    var AlbumView = Backbone.View.extend({
        events: {
            'click .add-album-to-playlist': 'addToPlaylist',
            'click .go-to-tracks': 'goToTracks'
        },
        tagName:  "li",

        initialize: function(options) {
        },

        render: function() {
            var self = this;

            var compiled_template = _.template(template_album);
            this.el.innerHTML = compiled_template({ album: self.model.toJSON() });

            return this;
        },

        addToPlaylist: function() {
            //TODO
        },

        goToTracks: function() {
            window.router.navigate('!/filter/album/' + encodeURIComponent(this.model.get('album')), true);
        }
    });

    var ArtistView = Backbone.View.extend({
        events: {
            'click .add-artist-to-playlist': 'addToPlaylist',
            'click .go-to-tracks': 'goToTracks'
        },
        tagName:  "li",

        initialize: function(options) {},

        render: function() {
            var self = this;

            var compiled_template = _.template(template_artist);
            this.el.innerHTML = compiled_template({ artist: self.model.toJSON() });

            return this;
        },

        addToPlaylist: function() {
            //TODO
        },

        goToTracks: function() {
            window.router.navigate('!/filter/artist/' + encodeURIComponent(this.model.get('artist')), true);
        }
    });

    var TrackView = Backbone.View.extend({
        events: {
            'click .add-to-playlist': 'addToPlaylist'
        },
        tagName:  "li",

        initialize: function(options) {
            $('#track-list li').draggable({
                appendTo: 'body',
                helper: 'clone'
            });
            $('.wrapper ol').droppable({
                drop: function(event, ui) {
                    $('<li>').text('hello').appendTo(this);
                }
            });
        },

        render: function() {
            var self = this;

            var compiled_template = _.template(template_track);
            this.el.innerHTML = compiled_template({ track: self.model.toJSON() });

            return this;
        },

        addToPlaylist: function() {
            var track_title = this.$('.track').text();
            var track_path = this.$('.track').attr('data-src');
            var trackToAdd = $('<li>');
            var link_track = $('<a>').attr('data-src', track_path).text(track_title);

            trackToAdd.append(link_track);
            trackToAdd.appendTo($('#wrapper ol'));
        }
    });

    window.TrackApp = Backbone.View.extend({
        el: $('#trackApp'),
        events: {
        },

        initialize: function(options) {
            var self = this,
                parentElt = $('#app');

            parentElt.template(TEMPLATE_URL + '/templates/app.html', {}, function() {
                self.delegateEvents();
                var query = options.query || '';

                if(!options.view) {
                    self.objects = new TrackList({query: query});
                }
                else {
                    switch(options.view) {
                        case('album'):
                            self.objects = new AlbumList();
                            break;
                        case('artist'):
                            self.objects = new ArtistList();
                            break;
                        default:
                            self.objects = new TrackList({query: query});
                            break;
                    }

                }

                self.objects.bind('add',   self.addOne, self);
                self.objects.bind('reset', self.addAll, self);
                self.objects.bind('all',   self.render, self);
                self.objects.fetch();
            });
        },

        render: function() {
            var self = this;
            return this;
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
        }
    });

    window.MyRouter = Backbone.Router.extend({
        routes: {
            "!/": "index",
            "!/filter/:type/:query": "filter",
            "!/artists": "artists",
            "!/albums": "albums"
        },

        index: function() {
            var view = new TrackApp({});
        },

        filter: function(type, query) {
            var view = new TrackApp({query: type + "=" + query});
        },

        artists: function() {
            var view = new TrackApp({view: 'artist'});
        },

        albums: function() {
            var view = new TrackApp({view: 'album'});
        },

        extractParams: function(params) {
            var params_object = {};

            if(!params){
                return params_object;
            }

            $.each(params.split('&'), function(index, value){
                if(value){
                    var param = value.split('=');
                    params_object[param[0]] = param[1];
                }
            });

            return params_object;
        }
    });
}());