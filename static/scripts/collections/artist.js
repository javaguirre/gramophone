var app = app || {};

app.ArtistList = app.GenericCol.extend({
    model: app.Artist,
    url: '/artists',

    comparator: function(artist) {
        return artist.get("artist").toLowerCase();
    }
});
