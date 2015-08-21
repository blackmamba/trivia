(function() {
'use strict';
    var Controller = Marionette.Controller.extend({

        initialize: function(options) {
            this.app = window.app;
            //initialize 
            //all the regional views here
            //attach events
        },

        home: function() {

            console.log('home view called');
        }

    });

    app.c.Controller = Controller;
}());
