var app = app || {};

app.Track = Backbone.Model.extend({
    initialize: function() {
        this.set({ time: Math.floor(this.get('duration') / 60) +
                         ':' + this.get('duration') % 60 });
    }
});
