(function(){
'use strict'
	app.c.Model = Backbone.Model.extend({
		defaults: {
			'id': -1,
			'url': ''
		},

		url: function() {
			return this.get('url');
		}

	});

}());