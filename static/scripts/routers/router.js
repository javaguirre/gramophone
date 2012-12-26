var app = app || {};

app.MyRouter = Backbone.Router.extend({
    routes: {
        "!/": "index",
        "!/filter/:type/:query": "filter",
        "!/search/:query": "search",
        "!/artists": "artists",
        "!/albums": "albums"
    },

    index: function() {
        app.appViewObj.setView({view: 'track'});
    },

    filter: function(type, query) {
        app.appViewObj.setView({view: 'track', query: type + "=" + query});
    },

    artists: function() {
        app.appViewObj.setView({view: 'artist'});
    },

    albums: function() {
        app.appViewObj.setView({view: 'album'});
    }
});
