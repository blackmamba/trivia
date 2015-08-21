/*global Backbone*/
'use strict'

var app = window.app = new Marionette.Application({
    regions: {
        header: '#header',
        content: '#content'
    }
});
//hide constrctors here
app.c = {};
//add initializer
app.addInitializer(function() {
    app.controller = new app.c.Controller({
        app: app
    });
    app.router = new app.c.Router({
        controller: app.controller,
        app: app
    });

    Backbone.history.start();

});


//prefetch collection data
// App.collection = new Collection();
