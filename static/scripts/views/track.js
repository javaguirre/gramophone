var app = app || {};

app.TrackView = Backbone.View.extend({
    events: {
        'click .add-track-to-playlist': 'addToPlaylist',
        'click .filter-by-album': 'goToAlbum',
        'click .filter-by-artist': 'goToArtist'
    },
    tagName:  'div',
    className: 'row-fluid music-item',
    template: _.template($('#template-track').html()),

    initialize: function(options) {},

    render: function() {
        var self = this;

        this.el.innerHTML = self.template({ track: self.model.toJSON() });

        return this;
    },

    addToPlaylist: function(ev) {
        ev.preventDefault();
        app.utils.addTrack(this.model);
    },

    goToAlbum: function(ev) {
        ev.preventDefault();
        app.routerObj.navigate('!/filter/album/' + encodeURIComponent(this.model.get('album')), true);
    },

    goToArtist: function(ev) {
        ev.preventDefault();
        app.routerObj.navigate('!/filter_album/artist/' + encodeURIComponent(this.model.get('artist')), true);
    }
});
