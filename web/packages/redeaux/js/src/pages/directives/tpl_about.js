angular.module('redeaux.pages').

    directive('tplAbout', ['$document', '$animate', 'TweenLite', 'GoogleMapsAPI', 'ApplicationPaths', 'Breakpoints',

        /**
         * @param $document
         * @param $animate
         * @param TweenLite
         * @param GoogleMapsAPI
         * @returns {{restrict: string, link: Function}}
         */
        function( $document, $animate, TweenLite, GoogleMapsAPI, ApplicationPaths, Breakpoints ){

            var ANIMATION_CLASS     = 'anim-about',
                INSTAGRAM_INCLUDE   = ApplicationPaths.tools + 'instagram/client';


            /**
             * @param injectedURI
             * @returns {string}
             * @private
             */
            function _getInstagramInclude( injectedURI ){
                return injectedURI + '?count=' + ((window.innerWidth <= Breakpoints.lg) ? 9 : 16);
            }


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
                        zoom: 15,
                        styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]}],
                        disableDefaultUI: true,
                        scrollwheel: false
                    };
                });

                // Immediately set instagram value on scope
                scope._instagram = _getInstagramInclude(INSTAGRAM_INCLUDE);

                // On window resize event callback, to adjust instagram include
                function onWindowResize(){
                    scope.$apply(function(){
                        scope._instagram = _getInstagramInclude(INSTAGRAM_INCLUDE);
                    });
                }

                // Bind to window resize event
                angular.element(window).on('resize', onWindowResize);

                // On nav to different page, destroy window resize watcher
                scope.$on('$destroy', function(){
                    angular.element(window).off('resize', onWindowResize);
                });
            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);