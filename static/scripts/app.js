(function() {
    window.MyRouter = Backbone.Router.extend({
        routes: {
            "!/": "index"
        },

        index: function() {
            console.log("this is the index!");
        }
    });
}());
