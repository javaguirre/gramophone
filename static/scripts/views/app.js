var app = app || {};

app.AppView = Backbone.View.extend({
    el: $('#app'),
    events: {
        'click #add-all-to-playlist': 'addAllToPlaylist',
        'click #hide_playlist': 'hidePlaylist',
        'click #clear_playlist': 'clearPlaylist',
        'keyup #searchText': 'search',
        'click #searchAction': 'search',
        'click #go-back': 'goBack',
        'click #update_db': 'updateDb'
    },
    template: _.template($('#template-app').html()),

    initialize: function(options) {
        $('#messages').hide();
        this.parentElt = $('#track-list-app');
    },

    render: function() {
        var self = this;
        return this;
    },

    setView: function(options) {
        switch(options.view) {
            case('album'):
                this.objects = new app.AlbumList({query: options.query});
                break;
            case('artist'):
                this.objects = new app.ArtistList({query: options.query});
                break;
            default:
                this.objects = new app.TrackList({query: options.query});
                break;
        }

        this.objects.bind('add',   this.addOne, this);
        this.objects.bind('reset', this.addAll, this);
        this.objects.bind('all',   this.render, this);
        this.objects.fetch();

        this.parentElt.html('').append(this.template(this.objects));

        if(options.query) {
            var query_list = options.query.split('=');
            $('#query-key').text(query_list[0] + ': ');
            $('#query-value').text(decodeURIComponent(query_list[1]));
        }
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

    addAll: function(objects) {
        $('#track-list').html("");

        if(objects) {
            objects.each(this.addOne);
        }
        else {
            this.objects.each(this.addOne);
        }
    },

    addAllToPlaylist: function() {
        app.utils.addTracks(this.objects.models);
    },

    search: function() {
        var letters = $("#searchText").val();

        //FIXME
        if(this.objects.models.length > 0) {
            if(this.objects.models[0] instanceof app.Track &&
               this.objects.query.indexOf('artist=') == -1 &&
               this.objects.query.indexOf('album=') == -1) {
                var query = this.objects.query = 'text' + '=' + letters;
                this.objects.fetch();
            }
            else {
                this.addAll(this.objects.search(letters));
            }
        }
        else {
            this.addAll(this.objects.search(letters));
        }
    },

    hidePlaylist: function(ev) {
        ev.preventDefault();
        app.utils.hidePlaylist();
    },

    clearPlaylist: function(ev) {
        ev.preventDefault();
        app.playerObj.remove();
    },

    goBack: function(ev) {
        ev.preventDefault();
        window.history.back();
    },

    updateDb: function(ev) {
        ev.preventDefault();
        $.get('/update_db', function(data) {
            $('#message-content').text('Db updated successfully!');
            $('#messages').addClass('alert-success').show();

            $(ev.target).removeAttr('disabled');
        });
    }
});

