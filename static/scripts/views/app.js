var app = app || {};

app.AppView = Backbone.View.extend({
    el: $('#app'),
    events: {
        'click #add-all-to-playlist': 'addAllToPlaylist',
        'click #hide_playlist': 'hidePlaylist',
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
            var view = new app.TrackView({
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
                this.objects = new app.TrackList({query: options.query});
                break;
            case('album'):
                this.objects = new app.AlbumList();
                break;
            case('artist'):
                this.objects = new app.ArtistList();
                break;
            default:
                this.objects = new app.TrackList({query: query});
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

        if(object instanceof app.Track) {
            view = new app.TrackView({model: object});
        }
        else if(object instanceof app.Artist) {
            view = new app.ArtistView({model: object});
        }
        else if(object instanceof app.Album) {
            view = new app.AlbumView({model: object});
        }
        this.$("#track-list").append(view.render().el);
    },

    addAll: function() {
        this.objects.each(this.addOne);
    },

    addAllToPlaylist: function() {
        app.utils.addTracks(this.objects.models);
    },

    search: function() {
        var letters = $("#searchText").val();
        this.renderList(this.objects.search(letters));
    },

    hidePlaylist: function(ev) {
        ev.preventDefault();
        var tracks_count = $('.jp-playlist ul').children().length;

        if($('.jp-playlist').is(':visible')) {
            $(ev.target).text('Show ' + tracks_count + ' tracks in the playlist');
        }
        else {
            $(ev.target).text('Hide Playlist');
        }
        $('.jp-playlist').slideToggle();
    }
});

