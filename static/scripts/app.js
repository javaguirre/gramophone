(function() {
    var TEMPLATE_URL = '';

    var Track = Backbone.Model.extend({
    });

    var TrackList = Backbone.Collection.extend({

        model: Track,
        url: function() {
            var my_url = '/tracks';
            return my_url;
        }
    });

    var TrackView = Backbone.View.extend({
        tagName:  "div",

        initialize: function(options) {
        },

        render: function() {
            var self = this;

            $(self.el).template(TEMPLATE_URL + '/templates/item.html', {tracks: self.model.toJSON().objects}, function() {
                self.setText();
            });

            return this;
        },
        setText: function() {
            //FIXME Provisional
            var text = this.model.get('title');
            var path = this.model.get('path');

            if(!text) {
                var index = path.lastIndexOf('/');
                var last_index = path.lastIndexOf('.');
                path_split = path.substr(index+1, last_index);
                text = path_split;
            }

            this.$('.track').text(text);
            this.$('.track').attr('data-src', path);
        }
    });

    window.TrackApp = Backbone.View.extend({
        events: {
        },

        initialize: function(options) {
            var self = this,
                parentElt = $('#app');

            parentElt.template(TEMPLATE_URL + '/templates/app.html', {}, function() {
                self.el = $('#trackApp');
                self.delegateEvents();

                self.tracks = new TrackList();
                self.tracks.bind('add',   self.addOne, self);
                self.tracks.bind('reset', self.addAll, self);
                self.tracks.bind('all',   self.render, self);

                self.tracks.fetch();
            });
        },

        render: function() {
            var self = this;
            return this;
        },

        addOne: function(track) {
            var view = new TrackView({model: track});
            this.$("#track-list").append(view.render().el);
        },

        addAll: function() {
            this.tracks.each(this.addOne);
        }
    });

    window.MyRouter = Backbone.Router.extend({
        routes: {
            "!/": "index"
        },

        index: function() {
            var view = new TrackApp({});
        },

        extractParams: function(params) {
            var params_object = {};

            if(!params){
                return params_object;
            }

            $.each(params.split('&'), function(index, value){
                if(value){
                    var param = value.split('=');
                    params_object[param[0]] = param[1];
                }
            });

            return params_object;
        }
    });
}());
