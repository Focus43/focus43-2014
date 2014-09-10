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
            // Http config
            $httpProvider.defaults.headers.common['x-angularized'] = true;

            // On starting/ending ajax calls; adjust 'working' model to true/false on rootscope
            $httpProvider.interceptors.push(['$rootScope', function( $rootScope ){
                return {
                    request: function( _config ){
                        $rootScope.working = true;
                        return _config;
                    },
                    response: function( _response ){
                        $rootScope.working = false;
                        return _response;
                    }
                };
            }]);

            // Provide constants
            $provide.factory('AppPaths', function factory(){
                return {
                    toolsBasePath: document.querySelector('meta[name="app-tools"]').getAttribute('content'),
                    toolsHandler: function( _path ){
                        return this.toolsBasePath + _path;
                    }
                };
            });

            var _resolvable  = {
                initialTemplate: ['$templateCache', '$q', function( $templateCache, $q ){
                    if( $templateCache.info().size === 0 ){
                        var _defer = $q.defer();
                        $templateCache.put(window.location.pathname, window._precompiledView);
                        _defer.resolve();
                        return _defer.promise;
                    }
                }]
            };

            // If cms-admin class is present on <html>, don't initialize any angular routing
            if( angular.element(document.documentElement).hasClass('cms-admin') ){
                return;
            }

            // Enable HTML5 location mode
            $locationProvider.html5Mode(true).hashPrefix('!');

            // Dynamic routing for top level pages; so $routeChanges{event}s get issued
            $routeProvider.
                when('/:section', {
                    resolve: _resolvable,
                    templateUrl: function( params ){
                        console.log('STATIC PAGE');
                        return '/' + params.section;
                    }
                }).
                when('/:section/:dynamic*?', {
                    resolve: _resolvable,
                    templateUrl: function( params ){
                        console.log('DYNAMIC PAGE');
                        return '/' + params.section + '/' + params.dynamic;
                    }
                }).
                otherwise({
                    templateUrl: '/',
                    resolve: _resolvable
                });
        }]).

        /**
         * App initialization: *post* configuration and angular bootstrapping.
         * @todo: trigger enter animation on ng-view so the immediately cached template
         * gets animated in properly (eg. setTimeout(function(){$route.reload();},500) ?)
         */
        run(['$rootScope', '$route', '$animate', '$templateCache', 'ViewHelper', function( $rootScope, $route, $animate, $templateCache, ViewHelper ){
            //setTimeout(function(){ $route.reload(); }, 500);

            // Attach FastClick
            FastClick.attach(document.body);

            // Set the class on ng-view to the "page-{route}"
            //var isFirstRun = true;
            $rootScope.$on('$viewContentLoaded', function(){
                $rootScope.pageClass = 'page-' + ($route.current.params.section || 'home');

//                if( isFirstRun ){
//                    isFirstRun = false;
//                    ViewHelper.viewChanged().resolve();
//                }else{
//                    ViewHelper.viewChanged();
//                }

//                setTimeout(function(){
//                    $rootScope.$apply(function(){
//                        console.log('applied late');
//                        $rootScope.pageClass = 'page-' + ($route.current.params.section || 'home');
//                    });
//                }, 500);

            });
        }]);


    /**
     * Manually bootstrap angular
     */
    angular.element(document).ready(function(){
        // Before angular is initialized; store the precompiled innerHTML of the ng-view
        var pageElement = document.querySelector('#content-l2 > .page');
        window._precompiledView = pageElement.innerHTML;
        // Remove all elements within pageElement
        while (pageElement.firstChild) {
            pageElement.removeChild(pageElement.firstChild);
        }
        // *Now* bootstrap angular
        angular.bootstrap(document, ['f43']);
    });

})( window, window.angular );
