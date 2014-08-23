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
            // Use html5 location methods
            $locationProvider.html5Mode(true).hashPrefix('!');

            // Http config
            $httpProvider.defaults.headers.common['x-angularized'] = true;

            // Dynamic routing for top level pages; so $routeChanges{event}s get issued
            $routeProvider
                .when('/:section', {templateUrl: function( params ){
                    return '/' + params.section;
                }}).
                otherwise({templateUrl: '/home'});

            // Provide constants
            $provide.factory('Ajax', function factory(){
                return {
                    toolsBasePath: document.querySelector('meta[name="app-tools"]').getAttribute('content'),
                    toolsHandler: function( _path ){
                        return this.toolsBasePath + _path;
                    }
                };
            });

            $provide.constant('SIDEBAR_ANIMATE_TIME', 150);
        }]).

        /**
         * App initialization: *post* configuration and angular bootstrapping.
         */
        run(['$rootScope', 'GoogleMaps', '$route', function( $rootScope, GoogleMaps, $route ){
            // Attach FastClick
            FastClick.attach(document.body);

//            $rootScope.mapOptions = {
//                center: new GoogleMaps.LatLng(43.479634, -110.760234)
//            };

            // Set the class on ng-view to the "view-{route}"
            $rootScope.$on('$viewContentLoaded', function(){
                $rootScope.pageClass = 'page-' + ($route.current.params.section || 'home');
            });
        }]);

})( window, window.angular );

angular.module('f43.common', []);

angular.module('f43.googlemap', []);

angular.module('f43.sections', []);
angular.module('f43.common')

    .directive('animator', ['$window', 'TweenLite', function factory( $window, TweenLite ){

        var pageCount = document.querySelectorAll('nav li').length,
            $layers   = document.querySelectorAll('#parallax .layer'),
            winW      = document.body.clientWidth;

        function updateLayers( _index ){
            var _percent = (_index === 0) ? 0 : (_index+1)/pageCount,
                _moveX   = winW * _percent;
            TweenLite.set($layers, {x:-(_moveX)});
        }

        function _link( scope ){
            // If window gets resized, reset the winW
            angular.element($window).on('resize', function(){
                winW = document.body.clientWidth;
                updateLayers(scope.parallaxIndex);
            });

            // Watch for changes to the parallaxIndex
            scope.$watch('parallaxIndex', function( _index ){
                if( angular.isDefined(_index) ){
                    updateLayers(_index);
                }
            });
        }

        return {
            restrict: 'A',
            link: _link,
            controller: ['$scope', function( $scope ){
                this.parallaxTo = function( _index ){
                    $scope.parallaxIndex = _index;
                };
            }]
        };
    }]);
angular.module('f43.common').

    /**
     * @sets $rootScope.sidebar
     */
    directive('nav', ['$rootScope', function factory( $rootScope ){

        function _link( scope, $element, attrs, AnimatorController ){

            // Elements
            var $trigger    = angular.element($element[0].querySelector('.trigger')),
                $listItems  = angular.element($element[0].querySelectorAll('li')),
                $track      = angular.element(document.querySelector('#content-l2'));

            // Click handler on the nav
            $trigger.on('click', function(){
                scope.$apply(function(){
                    scope.status.open = !scope.status.open;
                });
            });

            scope.$watch('status.open', function( status ){
                // Set sidebar status on the rootScope
                $rootScope.sidebar = status;

                // If sidebar is open, bind a one-time click listener on the track when its masked
                if( status === true ){
                    $track.one('click', function(){
                        scope.$apply(function(){
                            scope.status.open = false;
                        });
                    });
                }
            });

            // Route change (handles setting current route to active and closing sidebar)
            scope.$on('$routeChangeStart', function( event, current ){
                var href    = current && angular.isDefined(current.params.section) ? '/' + current.params.section : '/',
                    element = $element[0].querySelector('[href="'+href+'"]'),
                    index   = Array.prototype.indexOf.call($listItems, element.parentNode); //_active ? Array.prototype.indexOf.call($listItems, _active.parentNode) : 0;
                $listItems.removeClass('active').eq(index).addClass('active');
                AnimatorController.parallaxTo(index);
                scope.status.open = false;
            });
        }

        return {
            restrict: 'E',
            link: _link,
            scope: true,
            require: '^animator',
            controller: ['$scope', function( $scope ){
                // Initialize scope (nav) status as open = false
                $scope.status = {
                    open: false
                };

                // Publicly accessible methods on the controller
                this.toggle = function(){
                    $scope.$apply(function(){
                        $scope.status.open = !$scope.status.open;
                    });
                };
            }]
        };
    }]);
/* global TimelineLite */

angular.module('f43.common').

    /**
     * Wrap Modernizr library for dependency injection
     */
    provider('Modernizr', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                return $window['Modernizr'] || ($log.warn('Modernizr unavailable!'), false);
            }
        ];
    }).

    /**
     * Wrap TimelineLite library for dependency injection
     */
    provider('TimelineLite', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                return $window['TimelineLite'] || ($log.warn('TimelineLite unavailable!'), false);
            }
        ];
    }).

    provider('TimelineMax', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                return $window['TimelineMax'] || ($log.warn('TimelineMax unavailable!'), false);
            }
        ];
    }).

    /**
     * Wrap TweenLite library for dependency injection
     */
    provider('TweenLite', function(){
        this.$get = ['$window', '$log',
            function( $window, $log ){
                return $window['TweenLite'] || ($log.warn('TweenLite unavailable!'), false);
            }
        ];
    });
angular.module('f43.common').

    factory('TimelineHelpers', ['TimelineLite', function factory( TimelineLite ){
        return {
            // Return a random integer between min-max
            randomInt: function(min, max){
                return Math.floor(Math.random() * (max-min+1)+min);
            },

            // Automatically sets up the onComplete function to kill the instance
            // after its done running, *and* optionally takes a done callback from
            // angulars animation functions
            suicidal: function( done ){
                return new TimelineLite({
                    onComplete: function(){
                        this.kill();
                        if( angular.isFunction(done) ){ done(); }
                    }
                });
            }
        };
    }]);
angular.module('f43.googlemap').

    directive('googlemap', ['GoogleMaps', function( GoogleMaps ){

        // If GoogleMaps not available, don't initialize the directive
        if( ! GoogleMaps ){ return {}; }

        var _defaults = {
            zoom: 12,
            mapTypeId: GoogleMaps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            styles:
            // Snazzy
            // [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#333739"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2ecc71"}]},{"featureType":"poi","stylers":[{"color":"#2ecc71"},{"lightness":-7}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-28}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"visibility":"on"},{"lightness":-15}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-18}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-34}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#333739"},{"weight":0.8}]},{"featureType":"poi.park","stylers":[{"color":"#2ecc71"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#333739"},{"weight":0.3},{"lightness":10}]}]
            // Cobalt
            [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}]
        };

        return {
            restrict: 'A',
            scope: {
                mapOptions: '=googlemap',
                mapInstance: '=?'
            },
            replace: true,
            template: '<div></div>',
            link: function( scope, $element, attrs ){
                scope.mapInstance = new GoogleMaps.Map(
                    $element[0],
                    angular.extend(_defaults, (scope.mapOptions || {}))
                );

                // Enable weather layer on the map?
                if( angular.isDefined(attrs.weather) ){
                    var weatherLayer = new GoogleMaps.weather.WeatherLayer({
                        temperatureUnits: GoogleMaps.weather.TemperatureUnit.FAHRENHEIT
                    });
                    weatherLayer.setMap(scope.mapInstance);
                }

                // Enable cloud layer?
                if( angular.isDefined(attrs.clouds) ){
                    var cloudLayer = new GoogleMaps.weather.CloudLayer();
                    cloudLayer.setMap(scope.mapInstance);
                }

            }
        };
    }]);
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

/* global Power2 */

angular.module('f43.sections').

    directive('sectionAbout', [function(){

        function _link( scope, $element ){

        }

        return {
            restrict: 'A',
            scope: true,
            link: _link
        };
    }]).

    /**
     * Animation handler for the page entering/leaving
     */
    animation('.page-about', ['TweenLite', function( TweenLite ){
        return {
            enter: function($element, done){
                TweenLite.fromTo($element, 0.5, {scale:0.8, opacity:0}, {scale:1, opacity:1, onComplete:done});
            },
            leave: function($element, done){
                TweenLite.to($element, 0.5, {scale:0.8, opacity:0, onComplete:done});
            }
        };
    }]);
/* global Power2 */

angular.module('f43.sections').

    /**
     * Handler specifically for contact section.
     */
    directive('sectionContact', ['$animate', function factory( $animate ){

        function _linker( scope, $element, attrs ){
            scope.$watch('response', function( _response ){
                if( angular.isObject(_response) && _response.ok === true ){
                    $animate.addClass($element[0].querySelector('.form-body'), 'form-sent');
                }
            });
        }

        /**
         * Scope properties: contactForm, form_data, processing, response {ok:'',msg:''}
         */
        return {
            restrict: 'A',
            scope:    true,
            link:     _linker,
            controller: ['$scope', '$http', 'Ajax', function( $scope, $http, Ajax ){
                $scope.processing = false;

                $scope.isValid = function(){
                    return $scope.contactForm.$invalid;
                };

                $scope.submit = function(){
                    $scope.processing = true;
                    // POST the form data
                    $http.post(Ajax.toolsHandler('contact'), $scope.form_data)
                        .success(function( response ){
                            $scope.processing = false;
                            $scope.response   = response;
                        });
                };
            }]
        };
    }]).

    /**
     * Animation handler for the page entering/leaving
     */
    animation('.page-contact', ['SIDEBAR_ANIMATE_TIME', 'TimelineHelpers', function( SIDEBAR_ANIMATE_TIME, TimelineHelpers ){
        return {
            enter: function($element, done){
                setTimeout(function(){
                    var _rows = $element[0].querySelectorAll('.row');
                    TimelineHelpers.suicidal(done)
                        .set($element, {visibility:'visible'})
                        .set(_rows, {y:'100%', opacity:0})
                        .staggerTo(_rows, 0.25, {y:0, opacity:1}, 0.15);
                }, SIDEBAR_ANIMATE_TIME);
            },
            leave: function($element, done){
                var _rows = Array.prototype.slice.call($element[0].querySelectorAll('.row')).reverse();
                TimelineHelpers.suicidal(done)
                    .staggerTo(_rows, 0.25, {y:500, opacity:0}, 0.1);
            }
        };
    }]).

    /**
     * Animation handler for when the form is sent successfully.
     */
    animation('.form-sent', ['TimelineHelpers', function( TimelineHelpers ){
        return {
            addClass: function( $element, className, done ){
                var _rows = $element[0].querySelectorAll('.row');
                // Create a new timeline and run it right away
                TimelineHelpers.suicidal(done)
                    .set($element, {overflow:'hidden'})
                    .staggerTo(_rows, 0.25, {y:-500, opacity:0, scale:0.8, ease:Power2.easeOut}, 0.15)
                    .to($element, 0.35, {height:0, ease:Power2.easeOut});
            }
        };
    }]);
angular.module('f43.sections').

    directive('sectionHome', [function(){

        function _link( scope, $element ){

        }

        return {
            restrict: 'A',
            scope: true,
            link: _link
        };
    }]).

    /**
     * Animation handler for the page entering/leaving
     */
    animation('.page-home', ['SIDEBAR_ANIMATE_TIME', 'TimelineHelpers', function( SIDEBAR_ANIMATE_TIME, TimelineHelpers ){
        return {
            enter: function($element, done){
                setTimeout(function(){
                    TimelineHelpers.suicidal(done)
                        //.set($element, {visibility:'visible'})
                        .fromTo($element, 1, {scale:0.8, opacity:0}, {scale:1, opacity:1, visibility: 'visible'});
                }, SIDEBAR_ANIMATE_TIME);
            },
            leave: function($element, done){
                TimelineHelpers.suicidal(done)
                    .to($element, 0.5, {scale:0.8, opacity:0});
            }
        };
    }]);
angular.module('f43.sections').

    directive('sectionWork', [function(){

        function _link( scope, $element ){

        }

        return {
            restrict: 'A',
            scope: true,
            link: _link
        };
    }]).

    /**
     * Animation handler for the page entering/leaving
     */
    animation('.page-work', ['TweenLite', function( TweenLite ){
        return {
            enter: function($element, done){
                TweenLite.fromTo($element, 1, {rotation:180, opacity:0}, {rotation:0, opacity:1, delay:1, onComplete: done}, 1);
            },
            leave: function($element, done){
                TweenLite.to($element, 1, {rotation:180, onComplete: done});
            }
        };
    }]);
