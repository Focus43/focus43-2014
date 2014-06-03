/**
 * Main application entry
 */
;(function(window, angular, undefined){ 'use strict';

    /**
     * 'focus-43' module declaration.
     */
    angular.module('focus-43', ['ngRoute', 'ngResource']).

        /**
         * Focus-43 module configuration.
         */
        config(['$routeProvider', function( $routeProvider ){

        }]).

        /**
         * App initialization: *post* configuration and angular bootstrapping.
         */
        run(['$rootScope', '$location', '$timeout', function( $rootScope, $location, $timeout ){
//            $timeout(function(){
//                console.log($rootScope.preloadQueue.length);
//            }, 1000);

            $rootScope.$on('PRELOAD_UPDATE', function(event, data){
                console.log('$on\'d event', data);
            });
        }]);

})( window, window.angular );
