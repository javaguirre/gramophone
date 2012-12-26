var app = app || {};

$(function() {
    app.appViewObj = new app.AppView({});
    app.routerObj = new app.MyRouter();
    app.playerObj = app.utils.initPlayer();
    Backbone.history.start();
});
