var app = app || {};

app.AlbumView = Backbone.View.extend({
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
        var tracks = new app.TrackList({query: "album=" + encodeURIComponent(this.model.get('album'))});
        tracks.fetch({
            success: function(data) {
                app.utils.addTracks(data.models);
            }
        });
    },

    goToTracks: function() {
        app.routerObj.navigate('!/filter/album/' + encodeURIComponent(this.model.get('album')), true);
    }
});
