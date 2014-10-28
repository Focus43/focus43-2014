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
         * @todo: implement error message displaying instead of just hiding the loading animation
         */
        config(['$provide', '$routeProvider', '$locationProvider', '$httpProvider', 'GoogleMapsAPIProvider',
            function( $provide, $routeProvider, $locationProvider, $httpProvider, GoogleMapsAPIProvider ){
                // Http config
                $httpProvider.defaults.headers.common['x-angularized'] = true;

                // AJAX request interceptor to show loading icon
//                $httpProvider.interceptors.push(['$rootScope', function( $rootScope ){
//                    return {
//                        request: function( _passthrough ){
//                            $rootScope.bodyClasses.loading = true;
//                            return _passthrough;
//                        },
//                        response: function( _passthrough ){
//                            $rootScope.bodyClasses.loading = false;
//                            return _passthrough;
//                        },
//                        requestError: function( _passthrough ){
//                            $rootScope.bodyClasses.loading = false;
//                            return _passthrough;
//                        },
//                        responseError: function( _passthrough ){
//                            $rootScope.bodyClasses.loading = false;
//                            return _passthrough;
//                        }
//                    };
//                }]);

                // Enable HTML5 location mode
                $locationProvider.html5Mode(true).hashPrefix('!');

                // Route definitions (purely dynamic)
                $routeProvider.when('/:page*?', {
                    resolve: {
                        precompiled: ['$templateCache', '$location', '$q', function( $templateCache, $location, $q ){
                            if( $templateCache.info().size === 0 ){
                                var defer = $q.defer();
                                $templateCache.put($location.path() + '?xcache=1', window['PRE_COMPILED_VIEW']);
                                defer.resolve();
                                return defer.promise;
                            }
                        }]
                    },
                    templateUrl: function(params){
                        return '/' + (params.page || '') + '?xcache=1';
                    }
                });

                var headEl = document.querySelector('head');

                // Applications paths
                $provide.value('ApplicationPaths', {
                    images  : headEl.getAttribute('data-image-path'),
                    tools   : headEl.getAttribute('data-tools-path')
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
                    api_key : headEl.getAttribute('data-gmap-api'),
                    sensor  : true,
                    weather : false
                });
            }
        ]).

        /**
         * @description Run on load
         */
        run(['$window', '$rootScope', function( $window, $rootScope ){
            // Initialize FastClick right out of the gate
            if( angular.isDefined($window['FastClick']) ){
                FastClick.attach(document.body);
            }

            // List of available body classes
            $rootScope.bodyClasses = {
                //'loading'   : false,
                'fixed-max' : false
            };
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
        var $page = document.querySelector('main.page-body');
        window['PRE_COMPILED_VIEW'] = $page.innerHTML;

        // Purge all innerHTML contents. ALWAYS leave this here because angular can
        // rush ahead and compile the contents once, lose the reference, then when it
        // gets recreated from the template cache, everything can be bound again!
        while($page.firstChild){ $page.removeChild($page.firstChild); }

        // NOW bootstrap angular
        angular.bootstrap(document, ['redeaux']);
    });

})(window, window.angular);