var app = app || {};

app.TrackView = Backbone.View.extend({
    events: {
        'click .add-track-to-playlist': 'addToPlaylist'
    },
    tagName:  'div',
    className: 'row-fluid',
    template: _.template($('#template-track').html()),

    initialize: function(options) {},

    render: function() {
        var self = this;

        this.el.innerHTML = self.template({ track: self.model.toJSON() });

        return this;
    },

    addToPlaylist: function() {
        app.utils.addTrack(this.model);
    }
});
