angular.module('f43.googlemap').

    provider('GoogleMaps', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                if( angular.isDefined($window['google']) ){
                    return $window['google']['maps'];
                }

                return ($log.warn('GoogleMaps unavailable!'), false);
            }
        ];
    });
