angular.module('redeaux.pages').

    directive('tplAbout', ['$document', '$animate', 'TweenLite', 'GoogleMapsAPI',

        /**
         * @param $document
         * @param $animate
         * @param TweenLite
         * @param GoogleMapsAPI
         * @returns {{restrict: string, link: Function}}
         */
        function( $document, $animate, TweenLite, GoogleMapsAPI ){

            var ANIMATION_CLASS = 'anim-about';

            /**
             * Directive linker.
             * @param scope
             * @param $element
             * @private
             */
            function _link( scope, $element ){

                // Trigger addClass animations
                $animate.enter($element[0].parentNode, $element[0].parentNode.parentNode).then(function(){
                    scope.$apply(function(){
                        scope.animClass = ANIMATION_CLASS;
                    });
                });

                // Once Google Maps API becomes available, THEN set mapOptions.
                GoogleMapsAPI.available(function( Map ){
                    scope.mapOptions = {
                        center: new Map.LatLng(43.479634, -110.760234),
                        zoom: 14,
                        styles: [{"stylers":[{"hue":"#ffff00"},{"visibility":"on"},{"invert_lightness":true},{"saturation":40},{"lightness":10}]}],
                        disableDefaultUI: true,
                        scrollwheel: false,
                        draggable: false
                    };
                });
            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);