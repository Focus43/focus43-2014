/* global Modernizr */
/* global TimelineLite */
/* global TimelineMax */
/* global TweenLite */
/* global TweenMax */
angular.module('redeaux.common').

    /**
     * @description Wrap Modernizr library for dependency injection
     * @param $window
     * @param $log
     * @returns Modernizr | false
     */
    provider('Modernizr', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                return $window['Modernizr'] || ($log.warn('Modernizr unavailable!'), false);
            }
        ];
    }).

    /**
     * @description Wrap Timeline{Lite|Max} library for dependency injection. Make the provider
     * just a generic Timeline name so we can easily swap max or lite if need be.
     * @param $window
     * @param $log
     * @returns {TimelineMax|TimelineLite|boolean}
     */
    provider('Timeline', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                return ($window['TimelineMax'] || $window['TimelineLite']) || ($log.warn('GS TimeLine Library unavailable!'), false);
            }
        ];
    }).

    /**
     * @description Wrap Tween library for dependency injection.
     * @param $window
     * @param $log
     * @returns {TweenMax|TweenLite|boolean}
     */
    provider('Tween', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                return ($window['TweenMax'] || $window['TweenLite']) || ($log.warn('GS Tween Library unavailable!'), false);
            }
        ];
    });