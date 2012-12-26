var app = app || {};

app.TrackList = app.GenericCol.extend({
    model: app.Track,
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

    comparator: function(track) {
        if(track.get('track')) {
            return track.get('track');
        }
    },

    search: function(letters){
        if(letters === '')
            return this;

        var pattern = new RegExp(letters, 'gi');
        return _(this.filter(function(data) {
            return pattern.test(data.get('title')) ||
                   pattern.test(data.get('path'));
        }));
    }
});
