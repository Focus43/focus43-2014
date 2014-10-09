/* global FastClick */
;(function( window, angular, undefined ){ 'use strict';

    angular.module('redeaux', [
            'ngRoute',
            'ngResource',
            'ngAnimate',
            'GoogleMap',
            'redeaux.common',
            'redeaux.pages'
        ]).

        /**
         * @description App configuration
         * @param $provide
         * @param $routeProvider
         * @param $locationProvider
         * @param $httpProvider
         * @param GoogleMapsAPIProvider
         */
        config(['$provide', '$routeProvider', '$locationProvider', '$httpProvider', 'GoogleMapsAPIProvider',
            function( $provide, $routeProvider, $locationProvider, $httpProvider, GoogleMapsAPIProvider ){
                var headEl = document.querySelector('head');

                // Http config
                $httpProvider.defaults.headers.common['x-angularized'] = true;

                // AJAX request interceptor to show loading icon
                $httpProvider.interceptors.push(['$rootScope', function( $rootScope ){
                    return {
                        request: function( _default ){
                            $rootScope.bodyClasses.loading = true;
                            return _default;
                        },
                        response: function( _default ){
                            $rootScope.bodyClasses.loading = false;
                            return _default;
                        }
                    };
                }]);

                // Enable HTML5 location mode
                $locationProvider.html5Mode(true).hashPrefix('!');

                // Route definitions (purely dynamic)
                $routeProvider.
//                    when('/work/:project?', {templateUrl: '/work', resolve:{
//                        /**
//                         * Return a promise; resolves or rejects based on
//                         * whether its the top level 'work' page or a child
//                         * page. If promise gets rejected, it prevents angular
//                         * firing events that trigger page animations.
//                         */
//                        project: ['$route', '$q', function($route, $q){
//                            var defer = $q.defer();
//                            if( angular.isDefined($route.current.params.project) ){
//                                defer.reject();
//                            }else{
//                                defer.resolve();
//                            }
//                            return defer.promise;
//                        }]
//                    }}).
                    when('/:page*?', {
                        resolve: {
                            precompiled: ['$templateCache', '$location', '$q', function( $templateCache, $location, $q ){
                                if( $templateCache.info().size === 0 ){
                                    var defer = $q.defer();
                                    $templateCache.put($location.path(), window['PRE_COMPILED_VIEW']);
                                    defer.resolve();
                                    return defer.promise;
                                }
                            }]
                        },
                        templateUrl: function(params){
                            return '/' + (params.page || '');
                        }
                    });

                // Applications paths
                $provide.value('ApplicationPaths', {
                    images  : headEl.getAttribute('data-image-path'),
                    tools   : headEl.getAttribute('data-tools-path')
                });

                // Provide the breakpoints from Bootstrap as values
                $provide.value('Breakpoints', {
                    xs: 480,
                    sm: 768,
                    md: 992,
                    lg: 1200
                });

                // GoogleMapsAPI config
                GoogleMapsAPIProvider.setup({
                    api_key : headEl.getAttribute('data-gmap-api'),
                    sensor  : true,
                    weather : false
                });
            }
        ]).

        /**
         * @description Run on load
         */
        run(['$window', '$rootScope', function( $window, $rootScope ){
            if( angular.isDefined($window['FastClick']) ){
                FastClick.attach(document.body);
            }

            $rootScope.bodyClasses = {
                'loading'   : false
            };
        }]);


    /**
     * Bootstrap angular
     */
    angular.element(document).ready(function(){
        // Set target="_self" on all valid link tags to force following if logged into CMS...
        if( angular.element(document.documentElement).hasClass('cms-admin') ){
            angular.element(document.querySelectorAll('a')).each(function( index, el ){
                el.setAttribute('target', '_self');
            });
        }

        // Before angular initializes, store the innerHTML of ng-view before its compiled
        var $page = document.querySelector('section.page-body');
        window['PRE_COMPILED_VIEW'] = $page.innerHTML;

        // Purge all innerHTML contents. ALWAYS leave this here because angular can
        // rush ahead and compile the contents once, lose the reference, then when it
        // gets recreated from the template cache, everything can be bound again!
        while($page.firstChild){ $page.removeChild($page.firstChild); }

        // NOW bootstrap angular
        angular.bootstrap(document, ['redeaux']);
    });

})(window, window.angular);
angular.module('redeaux.common', []);

angular.module('GoogleMap', []);

angular.module('redeaux.pages', []);

angular.module('redeaux.common').

    /**
     * @description Generic body controller
     * @param $rootScope
     * @param $scope
     * @param $location
     */
    controller('CtrlRoot', ['$rootScope', '$scope', '$location',
        function( $rootScope, $scope, $location ){
            // Because SVG clip-paths reference the doc internally, and we HAVE to set
            // a <base /> tag for angular's router, we need to add the absolute URL in
            // the paths referenced by SVGs
            $rootScope.$on('$routeChangeSuccess', function(){
                $scope.absUrl = $location.absUrl();
            });

            // Available transition classes
            var _transitions = ['trnztn-1', 'trnztn-2', 'trnztn-3', 'trnztn-4', 'trnztn-5'];

            // When ng-view changes, set a new transition class
            $rootScope.$on('$viewContentLoaded', function(){
                console.log('-- content loaded --');
                $scope.transitionClass = _transitions[Math.floor(Math.random() * _transitions.length)];
            });
        }
    ]);
angular.module('redeaux.common').

    /**
     * @description Shared service for managing navigation state.
     * @returns {{open: boolean, working: boolean}}
     */
    factory('NavState', [function(){
        return {
            open: false,
            working: false
        };
    }]).

    /**
     * @description Nav element directive handler
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('nav', [function factory(){

        /**
         * @param scope
         * @param $element
         * @private
         */
        function _link( scope, $element ){
            var $trigger  = angular.element($element[0].querySelector('.trigger')),
                $level2   = angular.element(document.querySelector('#level-2'));

            $trigger.on('click', function(){
                scope.$apply(function(){
                    scope.navState.open = !scope.navState.open;
                });
            });

            scope.$watch('navState.open', function( _state ){
                // If sidebar is open, bind a one-time click listener on the track when its masked
                if( _state === true ){
                    $level2.one('click', function(){
                        scope.$apply(function(){
                            scope.navState.open = false;
                        });
                    });
                }
            });
        }

        return {
            restrict: 'E',
            link: _link,
            scope: true,
            /**
             * @param $rootScope
             * @param $scope
             * @param NavState
             */
            controller: ['$rootScope', '$scope', 'NavState',
                function( $rootScope, $scope, NavState ){
                    $scope.navState = NavState;

                    // Public method for toggling navigation open/closed
                    this.toggleSidebar = function(){
                        $scope.$apply(function(){
                            $scope.navState.open = !$scope.navState.open;
                        });
                    };

                    // Public method for toggling "working" spinner
                    this.toggleWorking = function(){
                        $scope.$apply(function(){
                            $scope.navState.working = !$scope.navState.working;
                        });
                    };

                    // Listen for route change and close nav if happens
                    $rootScope.$on('$routeChangeStart', function(){
                        $scope.navState.open = false;
                    });
                }
            ]
        };
    }]);
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
angular.module('redeaux.common').

    /**
     * @description Functions for easily working with common TimelineLite things.
     * @param TimelineLite
     * @returns {{randomInt: Function, suicidal: Function}}
     */
    factory('TimelineHelper', ['TimelineLite',
        function factory( TimelineLite ){
            return {
                /**
                 * Return a random integer b/w min -> max (can be negatives).
                 * @param min
                 * @param max
                 * @returns {number}
                 */
                randomInt: function(min, max){
                    return Math.floor(Math.random() * (max-min+1)+min);
                },

                /**
                 * Returns a new TimelineLite instance that is pre-configured with
                 * an onComplete callback to a) kill the timeline instance after
                 * completion (eg. play through then die), and b) process a
                 * _done callback function and/or a promise to resolve.
                 * @param done
                 * @param $defer
                 * @returns {TimelineLite}
                 */
                suicidal: function( done, $defer ){
                    return new TimelineLite({
                        onComplete: function(){
                            this.kill();
                            if( angular.isFunction(done) ){ done(); }
                            if( angular.isObject($defer) ){ $defer.resolve(); }
                        }
                    });
                }
            };
        }
    ]);
angular.module('GoogleMap').

    /**
     * @description GoogleMaps directive
     * @style references:
     * Snazzy
     * [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#333739"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2ecc71"}]},{"featureType":"poi","stylers":[{"color":"#2ecc71"},{"lightness":-7}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-28}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"visibility":"on"},{"lightness":-15}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-18}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-34}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#333739"},{"weight":0.8}]},{"featureType":"poi.park","stylers":[{"color":"#2ecc71"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#333739"},{"weight":0.3},{"lightness":10}]}]
     * Cobalt
     * [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}]
     * Hot Pink
     * [{"stylers":[{"hue":"#ff61a6"},{"visibility":"on"},{"invert_lightness":true},{"saturation":40},{"lightness":10}]}]
     * Hot Yellow
     * [{"stylers":[{"hue":"#ffff00"},{"visibility":"on"},{"invert_lightness":true},{"saturation":40},{"lightness":10}]}]
     * Muted Monotone
     * [{"stylers":[{"visibility":"on"},{"saturation":-100},{"gamma":0.54}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#4d4946"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"gamma":0.48}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"gamma":7.18}]}]
     * Shades of Grey
     * [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]}]
     * Greyscale
     * [{"featureType":"all","stylers":[{"saturation":-100},{"gamma":0.5}]}]
     * Blue Essence
     * [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill"},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#7dcdcd"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]}]
     * Golden Crown
     * [{"featureType":"landscape","stylers":[{"visibility":"on"},{"color":"#e7cd79"},{"weight":0.1}]},{"featureType":"water","stylers":[{"visibility":"simplified"},{"color":"#282828"}]},{"featureType":"landscape.natural.landcover","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#d6bc68"}]},{"featureType":"administrative.locality","elementType":"geometry","stylers":[{"visibility":"off"},{"color":"#d6bc68"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#d6bc68"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"on"},{"color":"#d6bc68"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#d6bc68"}]},{"featureType":"poi"},{"featureType":"transit.line","stylers":[{"color":"#d6bc68"},{"visibility":"on"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"weight":1},{"color":"#e9d9a6"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#e9d9a6"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#e9d9a6"}]},{"featureType":"poi.business","stylers":[{"color":"#e9d9a6"},{"visibility":"on"}]},{},{"featureType":"poi.government","stylers":[{"visibility":"off"}]},{"featureType":"poi.school","stylers":[{"visibility":"off"}]},{"featureType":"administrative","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"geometry","stylers":[{"visibility":"off"},{"color":"#cfb665"}]},{"featureType":"poi.place_of_worship","stylers":[{"visibility":"off"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"off"}]},{},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"color":"#cfb665"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway.controlled_access","stylers":[{"visibility":"off"}]},{"featureType":"road"}]
     * Taste 206
     * [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a0d6d1"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#dedede"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#dedede"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f1f1f1"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]
     * @returns {{restrict: string, link: Function, scope: {mapOptions: string, mapInstance: string}, controller: Array}}
     */
    directive('googlemap', [

        function(){

            /**
             * @description Return defaults for the map instance
             * @param mapAPI
             * @returns {{zoom: number, mapTypeId: *}}
             * @private
             */
            function _defaults( mapAPI ){
                return {
                    zoom: 15,
                    mapTypeId: mapAPI.MapTypeId.ROADMAP
                };
            }

            /**
             * @param scope
             * @param $element
             * @param attrs
             * @private
             */
            function _link( scope, $element, attrs ){
                scope.$watch('_status.ready', function( isReady ){
                    // If ready, we *know* mapAPI and mapOptions have been set on the scope
                    if( isReady ){
                        // Initialize the map instance!
                        scope.mapInstance = new scope.mapAPI.Map(
                            $element[0],
                            angular.extend( _defaults(scope.mapAPI), (scope.mapOptions || {}) )
                        );

                        // Enable weather layer?
                        if( angular.isDefined(attrs.weather) ){
                            var weatherLayer = new scope.mapAPI.weather.WeatherLayer({
                                temperatureUnits: scope.mapAPI.weather.TemperatureUnit.FAHRENHEIT
                            });
                            weatherLayer.setMap(scope.mapInstance);
                        }

                        // Enable cloud layer?
                        if( angular.isDefined(attrs.clouds) ){
                            var cloudLayer = new scope.mapAPI.weather.CloudLayer();
                            cloudLayer.setMap(scope.mapInstance);
                        }
                    }
                });
            }

            return {
                restrict: 'A',
                link: _link,
                scope: {mapOptions:'=googlemap', mapInstance: '=?'},
                /**
                 * @description Directive controller
                 * @param $scope
                 * @param $q
                 * @param GoogleMapsAPI
                 */
                controller: ['$scope', '$q', 'GoogleMapsAPI',
                    function( $scope, $q, GoogleMapsAPI ){
                        // By default set status to false (changed when promises are resolved below)
                        $scope._status = {
                            ready: false
                        };

                        // Create another promise for when mapOptions are passed to the scope
                        var MapOptsDefer = $q.defer();

                        // Watch for mapOptions to be passed to the directive via an attribute, and
                        // *THEN* resolve (meaning, mapOptions are required).
                        $scope.$watch('mapOptions', function( _opts ){
                            if( angular.isObject(_opts) ){
                                MapOptsDefer.resolve(_opts);
                            }
                        });

                        // When a) GoogleMapsAPI promise resolves, the API is loaded; and b) mapOptions
                        // have been set on the scope; THEN initialize the map instance.
                        $q.all([GoogleMapsAPI.promise, MapOptsDefer.promise]).then(function( _resolved ){
                            $scope.mapAPI        = _resolved[0];
                            $scope._status.ready = true;
                        });
                    }
                ]
            };
        }
    ]);
angular.module('GoogleMap').

    /**
     * GoogleMapsAPI provider definition
     */
    provider('GoogleMapsAPI', function(){

        /**
         * @type {{callback: string, api_key: string, sensor: boolean, weather: boolean}}
         */
        var configs = {
            callback : 'google_map_loaded',
            api_key  : 'API_KEY',
            sensor   : true,
            weather  : false
        };

        /**
         * @description build the URI to load google maps from
         * @param _configs
         * @returns {string}
         * @private
         */
        function _scriptSrc( _configs ){
            var _uri = 'https://maps.googleapis.com/maps/api/js?';
            _uri += 'key=' + _configs.api_key;
            _uri += '&sensor=' + ((_configs.sensor) ? 'TRUE' : 'FALSE');
            _uri += (_configs.weather) ? '&libraries=weather' : '';
            _uri += '&callback=' + _configs.callback;
            return _uri;
        }

        /**
         * @description pass in an array of configuration options
         * @param configObj
         */
        this.setup = function( configObj ){
            angular.extend(configs, configObj);
        };


        /**
         * @description GoogleMapsAPI provider. Note, we're binding the Deferred to
         * the $window.data because of the callback for google maps that has to be placed
         * into the global scope. We don't want the global function to have to reference an
         * internal variable and create a memory leak, so bind it with angular.element(window).data
         * and access it via getters and setters.
         * @param $window
         * @param $q
         * @returns {{promise: (*|promise|Function|promise|promise|promise), available: Function}}
         */
        this.$get = ['$window', '$q',
            function( $window, $q ){
                // Create deferred object
                angular.element($window).data('mapDeferred', $q.defer());

                // Bind globally scoped callback for Google Maps onload
                $window[configs.callback] = function(){
                    angular.element($window).data('mapDeferred').resolve($window['google']['maps']);
                };

                // Initialize the script loading
                var script  = document.createElement('script');
                script.type = 'text/javascript';
                script.src  = _scriptSrc(configs); // inject to make sure we're using merged configs
                document.body.appendChild(script);

                // Provider methods
                return {
                    promise: angular.element($window).data('mapDeferred').promise,
                    available: function( _success ){
                        this.promise.then(_success);
                    }
                };
            }
        ];
    });

angular.module('redeaux.pages').

    /**
     * @description Template handler
     * @param $document
     * @param $animate
     * @param TweenLite
     * @param ApplicationPaths
     * @param Breakpoints
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('tplAbout', ['$document', '$animate', 'TweenLite', 'Breakpoints',
        function( $document, $animate, TweenLite, Breakpoints ){

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

                // On window resize event callback, to adjust instagram include
                function onWindowResize(){
                    scope.$apply(function(){
                        scope.gramCount = (window.innerWidth <= Breakpoints.lg) ? 9 : 16;
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
                link: _link,
                scope: true,
                controller: ['$scope', '$http', 'ApplicationPaths', 'Breakpoints', function( $scope, $http, ApplicationPaths, Breakpoints ){
                    $scope.gramCount = (window.innerWidth <= Breakpoints.lg) ? 9 : 16;

                    $http.get(ApplicationPaths.tools + 'instagram/json').then(function(resp){
                        if( resp.status >= 200 && resp.status <= 300 ){
                            $scope.instagramList = resp.data;
                        }
                    });

                }]
            };
        }
    ]).

    /**
     * @description Animation handler
     * @returns {{addClass: Function}}
     */
    animation('.anim-about', [function(){
        return {
            addClass: function(el, className, done){
                console.log('about_view_ready');
                done();
            }
        };
    }]);
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
angular.module('redeaux.pages').

    /**
     * @description Template handler
     * @param TweenLite
     * @param $document
     * @param $animate
     * @returns {{restrict: string, link: Function}}
     */
    directive('tplExperiments', ['TweenLite', '$document', '$animate',
        function( TweenLite, $document, $animate ){

            var ANIMATION_CLASS = 'anim-experiments';

            /**
             * @param scope
             * @param $element
             * @private
             */
            function _link( scope, $element ){
                $animate.enter($element[0].parentNode, $element[0].parentNode.parentNode).then(function(){
                    scope.$apply(function(){
                        scope.animClass = ANIMATION_CLASS;
                    });
                });
            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);
angular.module('redeaux.pages').

    /**
     * @param Parallaxer
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('tplHome', ['Parallaxer',
        function( Parallaxer ){

            /**
             * @param scope
             * @param $element
             * @private
             */
            function _link( scope, $element ){
                scope._parallax = Parallaxer.initialize($element[0].querySelector('#parallax'));
            }

            return {
                restrict: 'A',
                link: _link,
                scope: true,
                controller: ['$scope', function( $scope ){
                    // When scope is destroyed, make sure to destruct the parallaxer
                    // so all event listeners are unbound!
                    $scope.$on('$destroy', function(){
                        if( angular.isObject($scope._parallax) ){
                            $scope._parallax.destroy();
                        }
                    });
                }]
            };
        }
    ]).

    /**
     * @description Parallaxer service; gets "new'd" by injector.
     * @param $window
     * @param $document
     * @param TweenLite
     * @param Modernizr
     */
    service('Parallaxer', ['$window', '$document', 'TweenLite', 'Modernizr',
        function($window, $document, TweenLite, Modernizr){

            /**
             * @type {boolean}
             * @private
             */
            var _accelerometer = (Modernizr.touch && Modernizr.devicemotion) ? true : false;

            /**
             * Layer info "class" (injected into either MouseMotion or DeviceMotion). Don't
             * extend as intended to use composition over inheritance.
             * @param element
             * @constructor
             */
            function LayerInfo( element ){
                var _self       = this;
                this.element   = element;
                this.$sky       = this.element.querySelector('.sky');
                this.$mtns      = this.element.querySelector('.mtn');
                this.$z3        = this.element.querySelector('.z3');
                this.$z2        = this.element.querySelector('.z2');
                this.$z1        = this.element.querySelector('.z1');
                this.winW       = $window.innerWidth;
                this.winH       = $window.innerHeight;
                this.layerW     = this.$sky.clientWidth;
                this.layerD     = this.layerW - this.winW; // layer difference

                // Resize handler; automatically updates dimensions for calculations.
                function onResize(){
                    _self.winW   = $window.innerWidth;
                    _self.winH   = $window.innerHeight;
                    _self.layerW = _self.$sky.clientWidth;
                    _self.layerD = _self.layerW - _self.winW;
                }

                // On window resize, update internal values
                angular.element($window).on('resize', onResize);

                // Make sure to always call this to remove the resize listener!
                this.destruct = function(){
                    angular.element($window).off('resize', onResize);
                };
            }

            /**
             * @param xCoord
             * @returns {number}
             */
            LayerInfo.prototype.percentX = function( xCoord ){ return xCoord / this.winW; };

            /**
             * @param yCoord
             * @returns {number}
             */
            LayerInfo.prototype.percentY = function( yCoord ){ return yCoord / this.winH; };

            /**
             * @param xPercent
             * @returns {number}
             */
            LayerInfo.prototype.moveX = function( xPercent ){ return -(xPercent * this.layerD); };

            /**
             * @param xCoord
             * @returns {number}
             */
            LayerInfo.prototype.halfX = function( xCoord ){ return ((this.winW / 2) - xCoord) / this.winW; };

            /**
             * If device has accelerometer *and* its a touch device, this will get
             * instantiated.
             * @param LayerInfo
             * @constructor
             */
            function DeviceMotion( LayerInfo ){
                var _running = false,
                    _beta;

                // Run on every requestAnimationFrame tick
                function onDeviceMotion( _event ){
                    _beta = _event.rotationRate.beta;
                }

                // Animation only runs if coordinates have changed
                function animateByMotion(){
                    TweenLite.set(LayerInfo.$mtns, {x:(100/_beta) * 10});
                }

                this.run = function(){
                    if( _running ){ return this; }
                    $document.on('mousemove', onDeviceMotion);
                    TweenLite.ticker.addEventListener('tick', animateByMotion);
                    _running = true;
                    return this;
                };

                this.destroy = function(){
                    $document.off('mousemove', onDeviceMotion);
                    TweenLite.ticker.removeEventListener('tick', animateByMotion);
                    LayerInfo.destruct();
                    LayerInfo = null; // mark for garbage collection
                    _running = false;
                };
            }

            /**
             * If regular old desktop...
             * @param LayerInfo
             * @constructor
             */
            function MouseMotion( LayerInfo ){
                var _running = false,
                    _coords, _prevCoords;

                // Run on every requestAnimationFrame tick
                function onMouseMove( _event ){
                    _coords = {x:_event.pageX, y:_event.pageY};
                }

                // Animation only runs if coordinates have changed
                function animateByMouse(){
                    if( _coords !== _prevCoords ){
                        var x     = LayerInfo.percentX( _coords.x ),
                            y     = LayerInfo.percentY( _coords.y ),
                            xHalf = LayerInfo.halfX( _coords.x),
                            moveX = LayerInfo.moveX( x),
                            alpha = y + 0.25;

                        // Base layers
                        TweenLite.set(LayerInfo.$sky, {x:moveX/2, scale:1+(y*0.1), y:(y*25)});
                        TweenLite.set(LayerInfo.$mtns, {x:moveX, scale:1+(y*0.1), y:-(y*25)});
                        // Depth layers
                        TweenLite.set(LayerInfo.$z3, {x:(125*xHalf), autoAlpha:alpha, scale:1+(y*0.1)});
                        TweenLite.set(LayerInfo.$z2, {x:(300*xHalf), autoAlpha:alpha, scale:1+(y*0.2)});
                        TweenLite.set(LayerInfo.$z1, {x:(700*xHalf), autoAlpha:alpha, scale:1+(y*0.3)});


                        // Update _prevCoords for next loop test
                        _prevCoords = _coords;
                    }
                }

                this.run = function(){
                    if( _running ){ return this; }
                    $document.on('mousemove', onMouseMove);
                    TweenLite.ticker.addEventListener('tick', animateByMouse);
                    _running = true;
                    return this;
                };

                this.destroy = function(){
                    $document.off('mousemove', onMouseMove);
                    TweenLite.ticker.removeEventListener('tick', animateByMouse);
                    LayerInfo.destruct();
                    LayerInfo = null; // mark for garbage collection
                    _running = false;
                };
            }


            /**
             * Call when initializing; automatically determines if should be using
             * mouse or accelerometer and returns the appropriate class instance.
             * @param element Plain javascript object (NOT angular.element!)
             * @returns DeviceMotion | MouseMotion
             */
            this.initialize = function( element ){
                var layerData = new LayerInfo(element);

                if( _accelerometer ){
                    return (new DeviceMotion(layerData)).run();
                }

                return (new MouseMotion(layerData)).run();
            };

        }
    ]);

angular.module('redeaux.pages').

    /**
     * @description Template handler
     * @param TweenLite
     * @param $document
     * @param $animate
     * @returns {{restrict: string, link: Function}}
     */
    directive('tplWork', ['TweenLite', '$document', '$animate',
        function( TweenLite, $document, $animate ){

            var ANIMATION_CLASS = 'anim-work';

            /**
             * @param scope
             * @param $element
             * @private
             */
            function _link( scope, $element ){
                $animate.enter($element[0].parentNode, $element[0].parentNode.parentNode).then(function(){
                    scope.$apply(function(){
                        scope.animClass = ANIMATION_CLASS;
                    });
                });
            }

            return {
                restrict: 'A',
                link: _link,
                controller: ['$scope', '$route', 'ApplicationPaths',
                    function( $scope, $route, ApplicationPaths ){
//                        $scope._route = $route;
//
//                        $scope.$watch('_route.current.params', function( params ){
//                            if( angular.isDefined(params.project) ){
//                                $scope._include = ApplicationPaths.tools + 'work/' + params.project;
//                            }
//                        });
                    }
                ]
            };
        }
    ]).


    /**
     * @description Animation handler
     * @returns {{addClass: Function}}
     */
    animation('.anim-work', [function(){
        return {
            addClass: function(el, className, done){
                console.log('work_view_ready');
                done();
            }
        };
    }]);
/* global Power2 */
angular.module('redeaux.pages').

    directive('portfolioToj', ['$window', '$document', 'TimelineLite', 'TweenLite',
        function( $window, $document, TimelineLite, TweenLite ){

            function _link( scope, $element ){

                var element         = $element[0],
                    scrollPercent   = 0,
                    smoothWheelTime = 0.6,
                    smoothWheelDist = 50,
                    masterTimeline  = new TimelineLite({paused:true, useFrames:false});


//                masterTimeline.to(document.querySelector('h1'), 1, {y:1000}).
//                    to(document.querySelector('h1'), 1, {color:'#222'});
                //masterTimeline.fromTo(document.querySelector('img.three-d'), 2, {x:-2000, scale:1.3, rotation:-50}, {x:0, scale:1, rotation:40});
                    //to(document.querySelector('img.three-d'), 1, {y:500, rotationY:-90});
                    //to(null, 1, {});


                // Smooth scrolling: http://blog.bassta.bg/2013/05/smooth-page-scrolling-with-tweenmax/
                function onWheel(event){
                    event.preventDefault();

                    var delta       = event.wheelDelta/120 || -(event.detail/3),
                        scrolled    = element.scrollTop,
                        scrollCalc  = scrolled - parseInt(delta * smoothWheelDist);

                    TweenLite.to(element, smoothWheelTime, {
                        scrollTo: {y:scrollCalc, autoKill:true},
                        ease: Power2.easeOut,
                        overwrite: 5
                    });
                }


                function animationLoop(){
                    scrollPercent = element.scrollTop / (element.scrollHeight - element.clientHeight);
                    //masterTimeline.progress(scrollPercent);

                    document.querySelector('.hold-still').style.top = element.scrollTop + 'px';
                }




//            (new TimelineLite({onComplete:function(){
//                var tl = (new TimelineLite({repeat:-1}))
//                    .fromTo($z1, 8, {x:200, scale:1, rotationX:0, y:-50}, {x:-550, scale:0.75, rotationX:30, y:30, ease:Power2.easeInOut})
//                    .fromTo($z2, 7, {x:100}, {x:-250, ease:Power2.easeInOut}, 0)
//                    .fromTo($z3, 6, {x:150}, {x:-100, ease:Power2.easeInOut}, 0)
//                    .fromTo($z4, 5, {x:-15}, {x:15, ease:Power2.easeInOut}, 0)
//                    .yoyo(true);
//            }}))
//                .set($all, {autoAlpha:0})
//                .staggerFromTo($all, 2.5, {scale:9}, {scale:1, autoAlpha:1, ease:Power2.easeOut}, 0.5)
//                .to($z1, 2.5, {x:200, y:-50}, 2.5)
//                .to($z2, 2.5, {x:100}, 2.5)
//                .to($z3, 2.5, {x:150}, 2.5)
//                .to($z4, 2.5, {x:-15}, 2.5);




                // Kickoff events n' shit
                $element.on('mousewheel DOMMouseScroll', onWheel);
                TweenLite.ticker.addEventListener('tick', animationLoop);

                // Straight MURDA MURDA animation loop. Kapow.
                scope.$on('$destroy', function(){
                    $element.off('mousewheel DOMMouseScroll', onWheel);
                    TweenLite.ticker.removeEventListener('tick', animationLoop);
                });
            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);