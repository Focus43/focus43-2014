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
                var headEl = document.querySelector('head');

                // Http config
                $httpProvider.defaults.headers.common['x-angularized'] = true;

                // AJAX request interceptor to show loading icon
                $httpProvider.interceptors.push(['$rootScope', function( $rootScope ){
                    return {
                        request: function( _default ){
                            $rootScope.bodyClasses.loading = true;
                            return _default;
                        },
                        response: function( _default ){
                            $rootScope.bodyClasses.loading = false;
                            return _default;
                        }
                    };
                }]);

                // Enable HTML5 location mode
                $locationProvider.html5Mode(true).hashPrefix('!');

                // Route definitions (purely dynamic)
                $routeProvider.
//                    when('/work/:project?', {templateUrl: '/work', resolve:{
//                        /**
//                         * Return a promise; resolves or rejects based on
//                         * whether its the top level 'work' page or a child
//                         * page. If promise gets rejected, it prevents angular
//                         * firing events that trigger page animations.
//                         */
//                        project: ['$route', '$q', function($route, $q){
//                            var defer = $q.defer();
//                            if( angular.isDefined($route.current.params.project) ){
//                                defer.reject();
//                            }else{
//                                defer.resolve();
//                            }
//                            return defer.promise;
//                        }]
//                    }}).
                    when('/:page*?', {
                        resolve: {
                            precompiled: ['$templateCache', '$location', '$q', function( $templateCache, $location, $q ){
                                if( $templateCache.info().size === 0 ){
                                    var defer = $q.defer();
                                    $templateCache.put($location.path(), window['PRE_COMPILED_VIEW']);
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
            if( angular.isDefined($window['FastClick']) ){
                FastClick.attach(document.body);
            }

            $rootScope.bodyClasses = {
                'loading'   : false
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
        var $page = document.querySelector('section.page-body');
        window['PRE_COMPILED_VIEW'] = $page.innerHTML;

        // Purge all innerHTML contents. ALWAYS leave this here because angular can
        // rush ahead and compile the contents once, lose the reference, then when it
        // gets recreated from the template cache, everything can be bound again!
        while($page.firstChild){ $page.removeChild($page.firstChild); }

        // NOW bootstrap angular
        angular.bootstrap(document, ['redeaux']);
    });

})(window, window.angular);