/* global FastClick */
;(function( window, angular, undefined ){ 'use strict';

    angular.module('redeaux', ['ngRoute', 'ngResource', 'ngAnimate', 'GoogleMap', 'redeaux.common', 'redeaux.pages']).

        config(['$provide', '$routeProvider', '$locationProvider', '$httpProvider',
            function( $provide, $routeProvider, $locationProvider, $httpProvider ){
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
            }
        ]).

        run(['$rootScope', 'NavState', function($rootScope, NavState){
            FastClick.attach(document.body);

            $rootScope.$on('$routeChangeStart', function(){
                NavState.open = false;
            });

            var _transitions = [
                'trnztn-1', 'trnztn-2', 'trnztn-3', 'trnztn-4', 'trnztn-5'
            ];

            $rootScope.$on('$viewContentLoaded', function( newScope ){
                console.log('-- content loaded --');
                $rootScope.transitionClass = _transitions[Math.floor(Math.random() * _transitions.length)];
            });
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