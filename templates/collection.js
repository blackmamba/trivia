 (function() {
     'use strict'
     app.c.Collection = Backbone.Collection.extend({
         model: Model,

         initialize: function(models, options) {
             if (options) {
                 this.url = options.url || '';
                 this.parse = options.parse || this.parse;
             }
             this.listenTo(this, 'change:url', this.handle);
         }

     });

 }());
