/* global FastClick */

;(function(window, angular, undefined){ 'use strict';

    /**
     * 'focus-43' module declaration.
     */
    angular.module('f43', ['ngRoute', 'ngResource', 'f43.common']).

        /**
         * Focus-43 module configuration.
         */
        config(['$routeProvider', '$locationProvider', '$httpProvider', function( $routeProvider, $locationProvider, $httpProvider ){
            // Use html5 location methods
            $locationProvider.html5Mode(true).hashPrefix('!');

            // http config
            $httpProvider.defaults.headers.common['x-angularized'] = true;

            // Dynamic routing for top level pages; so $routeChanges{event}s get issued
            $routeProvider
                .when('/:section', {})
                .when('/experiments/:post', {templateUrl: '/experiments'});

        }]).

        /**
         * App initialization: *post* configuration and angular bootstrapping.
         */
        run(['$rootScope', '$location', '$timeout', function( $rootScope ){
            // Attach FastClick
            FastClick.attach(document.body);
        }]);

})( window, window.angular );
