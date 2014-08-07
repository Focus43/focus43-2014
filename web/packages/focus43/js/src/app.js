/* global FastClick */

;(function(window, angular, undefined){ 'use strict';

    /**
     * 'focus-43' module declaration.
     */
    angular.module('f43', ['ngRoute', 'ngResource', 'ngAnimate', 'f43.common']).

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
                .when('/:section/:level1', {templateUrl: function( params ){
                    return '/' + params.section;
                }});

        }]).

        /**
         * App initialization: *post* configuration and angular bootstrapping.
         */
        run(['$rootScope', '$location', '$timeout', function( $rootScope ){
            // Attach FastClick
            FastClick.attach(document.body);

            // Sidebar settings available on the rootscope
            $rootScope.sidebar = {
                open: false
            };
        }]).

        animation('.sidebar-open', ['TweenLite', 'Modernizr', function(TweenLite, Modernizr){

            //console.log(alert(JSON.stringify(Modernizr)));

            return {

            };

//            return {
//                enter: function(element, done){
//                    console.log('entered');
//                },
//                leave: function(element, done){
//                    console.log('left');
//                },
//                beforeAddClass: function(element, className, done){
//                    //TweenLite.to('#content', 0.5, {x:-(document.body.clientWidth)});
//                    console.log('prior');
//                    done();
//                },
//                addClass: function(element, className, done){
//                    console.log('class added');
//                },
//                beforeRemoveClass: function(element, className, done){
//                    //TweenLite.to('#content',0.25,{x:0});
//                }
//            };
        }]);

//        animation('.custom-view', ['TweenLite', function(TweenLite){
//            return {
//                enter: function(element, done){
//                    TweenLite.to(element, 0.58, {x:0, ease:Power2.easeOut, onComplete: done});
//                },
//                leave: function(element, done){
//                    TweenLite.to(element, 0.58, {x:-(document.body.clientWidth), ease:Power2.easeOut, onComplete: done});
//                }
//            };
//        }]);

})( window, window.angular );
