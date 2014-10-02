/* global Power2 */
angular.module('redeaux.pages').

    /**
     * @description Template handler
     * @param $document
     * @param $animate
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('tplContact', ['$document', '$animate',
        function( $document, $animate ){

            var ANIMATION_CLASS = 'anim-contact';

            /**
             * Directive linker.
             * @param scope
             * @param $element
             * @private
             * @todo: figure out why video doesn't autoplay. It will if the $animate.enter stuff is
             * removed though.
             */
            function _link( scope, $element ){
                // Trigger addClass animations
                $animate.enter($element[0].parentNode, $element[0].parentNode.parentNode).then(function(){
                    scope.$apply(function(){
                        scope.animClass = ANIMATION_CLASS;
                    });
                });

                // Trigger video play
                $element[0].querySelector('video').play();

                // Toggle .form-sent class if responsive is valid
                scope.$watch('response', function( _response ){
                    if( angular.isObject(_response) && _response.ok === true ){
                        $animate.addClass($element[0].querySelector('.form-body'), 'form-sent');
                    }
                });
            }

            return {
                restrict: 'A',
                link: _link,
                scope: true,
                controller: ['$scope', '$http', 'GoogleMapsAPI', 'ApplicationPaths',
                    function( $scope, $http, GoogleMapsAPI, ApplicationPaths ){
                        // Form status
                        $scope.processing = false;
                        // For $watch to work, have to initialize this to null first
                        $scope._gmap = null;

                        $scope.isValid = function(){
                            return $scope.contactForm.$invalid;
                        };

                        $scope.submit = function(){
                            $scope.processing = true;
                            // POST the form data
                            $http.post(ApplicationPaths.tools + 'contact', $scope.form_data)
                                .success(function( response ){
                                    $scope.processing = false;
                                    $scope.response   = response;
                                });
                        };

                        // When the map instance becomes available (from being initialized below)
                        $scope.$watch('_gmap', function( mapInstance ){
                            if( angular.isObject(mapInstance) && mapInstance !== null ){
                                GoogleMapsAPI.available(function( MapsAPI ){
                                    var marker = new MapsAPI.Marker({
                                        position: new MapsAPI.LatLng(43.478589,-110.760121),
                                        map: mapInstance,
                                        title: 'Focus43',
                                        icon: ApplicationPaths.images + 'logo_marker.png'
                                    });

                                    var infowindow = new MapsAPI.InfoWindow({
                                        content: '<div class="map-info-window"><h1>Focus43 World Headquarters</h1><p>(Otherwise known as... our only headquarters.)</p><h3>Swing by and have a beer with us.</h3></div>',
                                        maxWidth: 400
                                    });

                                    infowindow.open(mapInstance, marker);

                                    // Recenter
                                    mapInstance.panBy(0, -150);
                                });
                            }
                        });

                        // Once Google Maps API becomes available, THEN set mapOptions.
                        GoogleMapsAPI.available(function( MapsAPI ){
                            $scope.mapOptions = {
                                center: new MapsAPI.LatLng(43.479634, -110.760234),
                                zoom: 15,
                                styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#7dcdcd"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]}],
                                disableDefaultUI: true,
                                scrollwheel: false
                            };
                        });
                    }
                ]
            };
        }
    ]).


    /**
     * @description Animation handler
     * @todo: figure out why video autoplay doesn't work with animations set here
     * @returns {{addClass: Function}}
     */
    animation('.anim-contact', [function(){
        return {
            addClass: function(el, className, done){
                console.log('contact_view_ready');
                //el[0].querySelector('video').play();
                done();
            }
        };
    }]).


    /**
     * @description Animation handler for form submission
     * @param TimelineHelper
     * @returns {{addClass: Function}}
     */
    animation('.form-sent', ['TimelineHelper',
        function( TimelineHelper ){
            return {
                addClass: function( $element, className, done ){
                    var _rows = $element[0].querySelectorAll('.row');
                    // Create a new timeline and run it right away
                    TimelineHelper.suicidal(done)
                        .set($element, {overflow:'hidden'})
                        .staggerTo(_rows, 0.25, {y:-500, opacity:0, scale:0.8, ease:Power2.easeOut}, 0.15)
                        .to($element, 0.35, {height:0, ease:Power2.easeOut});
                }
            };
        }
    ]);