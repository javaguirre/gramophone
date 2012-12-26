var app = app || {};

app.ArtistView = Backbone.View.extend({
    events: {
        'click .go-to-tracks': 'goToTracks',
        'click .artist-link': 'goToAlbums',
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
        var tracks = new app.TrackList({query: "artist=" + encodeURIComponent(this.model.get('artist'))});
        tracks.fetch({
            success: function(data) {
               app.utils.addTracks(data.models);
            }
        });
    },

    goToTracks: function() {
        app.routerObj.navigate('!/filter/artist/' + encodeURIComponent(this.model.get('artist')), true);
    },

    goToAlbums: function() {
        app.routerObj.navigate('!/filter_album/artist/' + encodeURIComponent(this.model.get('artist')), true);
    }
});
