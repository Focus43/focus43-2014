/**
 * Just in keeping with the "angular way" for DI, wrap any libraries that bind as
 * globals to 'window' and make injectable.
 */
angular.module('focus-43').

    /**
     * Modernizr
     */
    factory('Modernizr', ['$window', function( $window ){
        return $window['Modernizr'] || {};
    }]).

    /**
     * Greensock's TweenLite
     */
    factory('TweenLite', ['$window', function( $window ){
        return $window['TweenLite'] || {};
    }]).

    /**
     * Greensock's TimelineLite
     */
    factory('TimelineLite', ['$window', function( $window ){
        return $window['TimelineLite'] || {};
    }]);