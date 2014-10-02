/* global FastClick */
;(function( window, angular, undefined ){ 'use strict';

    angular.module('redeaux', [
            'ngRoute',
            'ngResource',
            'ngAnimate',
            'GoogleMap',
            'redeaux.common',
            'redeaux.pages'
        ]).

        /**
         * @description App configuration
         * @param $provide
         * @param $routeProvider
         * @param $locationProvider
         * @param $httpProvider
         * @param GoogleMapsAPIProvider
         */
        config(['$provide', '$routeProvider', '$locationProvider', '$httpProvider', 'GoogleMapsAPIProvider',
            function( $provide, $routeProvider, $locationProvider, $httpProvider, GoogleMapsAPIProvider ){
                // Http config
                $httpProvider.defaults.headers.common['x-angularized'] = true;

                // Enable HTML5 location mode
                $locationProvider.html5Mode(true).hashPrefix('!');

                // Route definitions (purely dynamic)
                $routeProvider.
                    when('/:page*?', {
                        resolve: {
                            precompiled: ['$templateCache', '$q', function( $templateCache, $q ){
                                if( $templateCache.info().size === 0 ){
                                    var defer = $q.defer();
                                    $templateCache.put(window.location.pathname, window['precompiled_view']);
                                    defer.resolve();
                                    return defer.promise;
                                }
                            }]
                        },
                        templateUrl: function(params){
                            return '/' + (params.page || '');
                        }
                    });

                // Applications paths
                $provide.value('ApplicationPaths', {
                    images  : document.querySelector('meta[name="app-images"]').getAttribute('content'),
                    tools   : document.querySelector('meta[name="app-tools"]').getAttribute('content')
                });

                // Provide the breakpoints from Bootstrap as values
                $provide.value('Breakpoints', {
                    xs: 480,
                    sm: 768,
                    md: 992,
                    lg: 1200
                });

                // GoogleMapsAPI config
                GoogleMapsAPIProvider.setup({
                    api_key : 'AIzaSyANFxVJuAgO4-wqXOeQnIfq38x7xmhMZXY',
                    sensor  : true,
                    weather : false
                });
            }
        ]).

        /**
         * @description Run on load
         */
        run(['$window', function( $window ){
            if( angular.isDefined($window['FastClick']) ){
                FastClick.attach(document.body);
            }
        }]);


    /**
     * Bootstrap angular
     */
    angular.element(document).ready(function(){
        // Set target="_self" on all valid link tags to force following if logged into CMS...
        if( angular.element(document.documentElement).hasClass('cms-admin') ){
            angular.element(document.querySelectorAll('a')).each(function( index, el ){
                el.setAttribute('target', '_self');
            });
        }

        // Before angular initializes, store the innerHTML of ng-view before its compiled
        var $page = document.querySelector('section.page-body');
        window['precompiled_view'] = $page.innerHTML;

        // Purge all innerHTML contents
        while($page.firstChild){
            $page.removeChild($page.firstChild);
        }

        // NOW bootstrap angular
        angular.bootstrap(document, ['redeaux']);
    });

})(window, window.angular);