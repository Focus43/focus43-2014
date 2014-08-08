/* global FastClick */

;(function(window, angular, undefined){ 'use strict';

    /**
     * 'focus-43' module declaration.
     */
    angular.module('f43', [
        'ngRoute',
        'ngResource',
        'ngAnimate',
        'f43.common',
        'f43.sections',
        'f43.googlemap'
    ]).

        /**
         * Focus-43 module configuration.
         */
        config(['$provide', '$routeProvider', '$locationProvider', '$httpProvider', function( $provide, $routeProvider, $locationProvider, $httpProvider ){
            // Use html5 location methods
            $locationProvider.html5Mode(true).hashPrefix('!');

            // http config
            $httpProvider.defaults.headers.common['x-angularized'] = true;

            // Dynamic routing for top level pages; so $routeChanges{event}s get issued
            $routeProvider
                .when('/:section', {})
                .when('/:section/:level1', {templateUrl: function( params ){
                    return '/' + params.section;
                }});

            // Provide constants
            $provide.factory('Ajax', function factory(){
                return {
                    toolsBasePath: document.querySelector('meta[name="app-tools"]').getAttribute('content'),
                    toolsHandler: function( _path ){
                        return this.toolsBasePath + _path;
                    }
                };
            });

        }]).

        /**
         * App initialization: *post* configuration and angular bootstrapping.
         */
        run(['$rootScope', 'GoogleMaps', function( $rootScope, GoogleMaps ){
            // Attach FastClick
            FastClick.attach(document.body);

            // Sidebar settings available on the rootscope
            $rootScope.sidebar = {
                open: false
            };

            $rootScope.mapOptions = {
                center: new GoogleMaps.LatLng(43.479634, -110.760234)
            };
        }]);

//        factory('$exceptionHandler', function(){
//            return function(exception, cause){
//                console.log('Caught!', exception);
//            };
//        }).

})( window, window.angular );
