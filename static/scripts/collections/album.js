var app = app || {};

app.AlbumList = app.GenericCol.extend({
    model: app.Album,
    url: function() {
        if(this.query) {
            return '/albums?' + this.query;
        }
        return '/albums';
    },

    initialize: function(options) {
        this.query = '';
        if (options.query) {
            this.query = options.query;
        }
    },

    comparator: function(album) {
        if(album.get('album')) {
            return album.get('album').toLowerCase();
        }
    },

    search: function(letters){
        if(letters === "")
            return this;

        var pattern = new RegExp(letters, 'gi');
        return _(this.filter(function(data) {
            return pattern.test(data.get('album'));
        }));
    }
});
