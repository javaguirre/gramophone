var app = app || {};

app.ArtistList = app.GenericCol.extend({
    model: app.Artist,
    url: function() {
        if(this.query) {
            return '/artists?' + this.query;
        }
        return '/artists';
    },

    initialize: function(options) {
        this.query = '';
        if (options.query) {
            this.query = options.query;
        }
    },

    comparator: function(artist) {
        if(artist.get('artist')) {
            return artist.get('artist').toLowerCase();
        }
    },

    search: function(letters){
        if(letters === "")
            return this;

        var pattern = new RegExp(letters, 'gi');
        return _(this.filter(function(data) {
            return pattern.test(data.get('artist'));
        }));
    }
});
