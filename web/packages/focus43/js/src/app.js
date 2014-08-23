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

            // Http config
            $httpProvider.defaults.headers.common['x-angularized'] = true;

            // Dynamic routing for top level pages; so $routeChanges{event}s get issued
            $routeProvider
                .when('/:section', {templateUrl: function( params ){
                    return '/' + params.section;
                }}).
                otherwise({templateUrl: '/home'});

            // Provide constants
            $provide.factory('Ajax', function factory(){
                return {
                    toolsBasePath: document.querySelector('meta[name="app-tools"]').getAttribute('content'),
                    toolsHandler: function( _path ){
                        return this.toolsBasePath + _path;
                    }
                };
            });

            $provide.constant('SIDEBAR_ANIMATE_TIME', 150);
        }]).

        /**
         * App initialization: *post* configuration and angular bootstrapping.
         */
        run(['$rootScope', 'GoogleMaps', '$route', function( $rootScope, GoogleMaps, $route ){
            // Attach FastClick
            FastClick.attach(document.body);

//            $rootScope.mapOptions = {
//                center: new GoogleMaps.LatLng(43.479634, -110.760234)
//            };

            // Set the class on ng-view to the "view-{route}"
            $rootScope.$on('$viewContentLoaded', function(){
                $rootScope.pageClass = 'page-' + ($route.current.params.section || 'home');
            });
        }]);

})( window, window.angular );
