var app = app || {};

app.MyRouter = Backbone.Router.extend({
    routes: {
        "!/": "index",
        "!/filter/:type/:query": "filter",
        "!/filter_album/:type/:query": "filterAlbum",
        "!/filter_artist/:type/:query": "filterArtist",
        "!/search/:query": "search",
        "!/artists": "artists",
        "!/albums": "albums"
    },

    index: function() {
        app.utils.selectedMenu('track');
        app.appViewObj.setView({view: 'track'});
    },

    artists: function() {
        app.utils.selectedMenu('artist');
        app.appViewObj.setView({view: 'artist'});
    },

    albums: function() {
        app.utils.selectedMenu('album');
        app.appViewObj.setView({view: 'album'});
    },

    filter: function(type, query) {
        app.utils.selectedMenu('track');
        app.appViewObj.setView({view: 'track', query: type + "=" + query});
    },

    filterAlbum: function(type, query) {
        app.utils.selectedMenu('album');
        app.appViewObj.setView({view: 'album', query: type + "=" + query});
    },

    filterArtist: function(type, query) {
        app.utils.selectedMenu('artist');
        app.appViewObj.setView({view: 'artist', query: type + "=" + query});
    }
});
