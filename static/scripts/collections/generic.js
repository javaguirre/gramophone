var app = app || {};

app.GenericCol = Backbone.Collection.extend({
    parse: function(resp, xhr) {
        return resp.objects;
    }
});
