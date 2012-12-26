var app = app || {};

app.AlbumList = app.GenericCol.extend({
    model: app.Album,
    url: '/albums',

    comparator: function(album) {
        return album.get("album").toLowerCase();
    }
});
