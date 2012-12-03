(function($) {
    var cache = {};
    
    function _render(elt, template, data, callback) {
        var data = data || {},
            callback = callback || function() {},
            html = template(data);
        
        elt.html(html);
        callback();
    }
    
    /**
     * Fetches the Underscore.js template at the given path,
     * processes it with the provided obj, and appends the
     * resulting html to the matched DOM elements.
     *
     * Templates will only be fetched once from the server,
     * after which the preprocessed template will be cached
     * in the DOM.
     */
    $.fn.template = function(path, obj, callback) {
        var self = this;
        
        /*if (cache[path]) {*/
        /*_render(self, cache[path], obj, callback);*/
            /*return self;*/
        /*}*/
        
        $.get(path, function(data) {
            cache[path] = _.template(data);
            _render(self, cache[path], obj, callback);
        });
        
        return self;
    };
})(jQuery);
