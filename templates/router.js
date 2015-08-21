
/***
 * AppRouter.js
 *
 */

(function() {

'use strict'
    var Router = Marionette.AppRouter.extend({
        controller: app.controller,
        appRoutes: {
            '': 'home'
            
            // 'create':'create'
            // ':module/filter?(*params)': 'showFilteredView',

            // // ex. assets/create, assets/edit/123
            // // ex. assets/create?type=image
            // ':module(/:view)(/:extra)': 'showModuleView'
        }
    });

    return app.c.Router = Router;
}());
