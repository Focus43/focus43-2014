/* global Modernizr */
/* global TimelineLite */
/* global TimelineMax */
/* global TweenLite */
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
     * @description Wrap TimelineLite library for dependency injection
     * @param $window
     * @param $log
     * @returns TimelineLite | false
     */
    provider('TimelineLite', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                return $window['TimelineLite'] || ($log.warn('TimelineLite unavailable!'), false);
            }
        ];
    }).


    /**
     * @description Wrap TimelineMax library for dependency injection
     * @param $window
     * @param $log
     * @returns TimelineMax | false
     */
    provider('TimelineMax', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                return $window['TimelineMax'] || ($log.warn('TimelineMax unavailable!'), false);
            }
        ];
    }).

    /**
     * @description Wrap TweenLite library for dependency injection
     * @param $window
     * @param $log
     * @returns TweenLite | false
     */
    provider('TweenLite', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                return $window['TweenLite'] || ($log.warn('TweenLite unavailable!'), false);
            }
        ];
    });