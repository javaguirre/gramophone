(function() {
    var TEMPLATE_URL = '';
    var template_track;
    $.get(TEMPLATE_URL + '/templates/item.html', function(data) {
        template_track = data;
    });

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
        events: {
            'click .add-to-playlist': 'addToPlaylist'
        },
        tagName:  "li",

        initialize: function(options) {
            $('#track-list li').draggable({
                appendTo: 'body',
                helper: 'clone'
            });
            $('.wrapper ol').droppable({
                drop: function(event, ui) {
                    console.log("Drop!");
                    $('<li>').text('hello').appendTo(this);
                }
            });

        },

        render: function() {
            var self = this;

            var compiled_template = _.template(template_track);
            this.el.innerHTML = compiled_template({ track: self.model.toJSON() });

            return this;
        },

        addToPlaylist: function() {
            var track_title = this.$('.track').text();
            var track_path = this.$('.track').attr('data-src');
            var trackToAdd = $('<li>');
            var link_track = $('<a>').attr('data-src', track_path).text(track_title);

            trackToAdd.append(link_track);
            trackToAdd.appendTo($('#wrapper ol'));
        }
    });

    window.TrackApp = Backbone.View.extend({
        el: $('#trackApp'),
        events: {
        },

        initialize: function(options) {
            var self = this,
                parentElt = $('#app');

            parentElt.template(TEMPLATE_URL + '/templates/app.html', {}, function() {
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
