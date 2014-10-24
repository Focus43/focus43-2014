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
         * @todo: implement error message displaying instead of just hiding the loading animation
         */
        config(['$provide', '$routeProvider', '$locationProvider', '$httpProvider', 'GoogleMapsAPIProvider',
            function( $provide, $routeProvider, $locationProvider, $httpProvider, GoogleMapsAPIProvider ){
                // Http config
                $httpProvider.defaults.headers.common['x-angularized'] = true;

                // AJAX request interceptor to show loading icon
                $httpProvider.interceptors.push(['$rootScope', function( $rootScope ){
                    return {
                        request: function( _passthrough ){
                            $rootScope.bodyClasses.loading = true;
                            return _passthrough;
                        },
                        response: function( _passthrough ){
                            $rootScope.bodyClasses.loading = false;
                            return _passthrough;
                        },
                        requestError: function( _passthrough ){
                            $rootScope.bodyClasses.loading = false;
                            return _passthrough;
                        },
                        responseError: function( _passthrough ){
                            $rootScope.bodyClasses.loading = false;
                            return _passthrough;
                        }
                    };
                }]);

                // Enable HTML5 location mode
                $locationProvider.html5Mode(true).hashPrefix('!');

                // Route definitions (purely dynamic)
                $routeProvider.when('/:page*?', {
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

                var headEl = document.querySelector('head');

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
            // Initialize FastClick right out of the gate
            if( angular.isDefined($window['FastClick']) ){
                FastClick.attach(document.body);
            }

            // List of available body classes
            $rootScope.bodyClasses = {
                'loading'   : false,
                'fixed-max' : false
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
        var $page = document.querySelector('main.page-body');
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
angular.module('redeaux.common').

    /**
     * @description Functions for easily working with common Timeline things.
     * @param Timeline
     * @returns {{randomInt: Function, suicidal: Function}}
     */
    factory('TimelineHelper', ['Timeline',
        function factory( Timeline ){
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
                 * Returns a new Timeline instance that is pre-configured with
                 * an onComplete callback to a) kill the timeline instance after
                 * completion (eg. play through then die), and b) process a
                 * _done callback function and/or a promise to resolve.
                 * @param done
                 * @param $defer
                 * @returns {Timeline(Max|Lite)}
                 */
                suicidal: function( config, onCompletes ){
                    return new Timeline(angular.extend(config, {
                        onComplete: function(){
                            this.kill();
                            if( angular.isArray(onCompletes) ){
                                for(var i = 0; i <= onCompletes.length; i++){
                                    if( angular.isObject(onCompletes[i]) && onCompletes[i]['resolve'] ){
                                        onCompletes[i].resolve();
                                    }
                                    if( angular.isFunction(onCompletes[i]) ){
                                        onCompletes[i]();
                                    }
                                }
                            }
                        }
                    }));
                }
            };
        }
    ]).

    /**
     * @returns {{parseRule: Function, determineBodyScrollElement: Function}}
     */
    factory('Utilities', [
        function(){

            /**
             * Get the value of a property defined in a stylesheet for a given selector.
             * @param ssObjOrIndex CSSStyleSheet | int Stylesheet Object or Index of the stylesheet to
             * get from the DOM
             * @param selectorRegex RegExp Pass in a regex rule to match against, eg: new RegExp(/body\.fixed-max*(.)+after/)
             * @param property string Property name to get from the matched rule
             * @returns {mixed|boolean}
             * @private
             */
            function _parseRule( ssObjOrIndex, selectorRegex, property ){
                var stylesheet = angular.isObject(ssObjOrIndex) ? ssObjOrIndex : document.styleSheets[ssObjOrIndex],
                    rules      = stylesheet.cssRules,
                    computed   = false;
                for(var _key in rules){
                    if( rules[_key].selectorText && selectorRegex.test(rules[_key].selectorText) ){
                        computed = rules[_key].style[property];
                        break;
                    }
                }
                return computed;
            }

            /**
             * Bug in webkit causes a) different height calculations, and b) which DOM
             * element emits scroll events on the body, ie. mousewheel. This is a quick
             * test that will return the proper element to bind listeners to.
             * @note Always use this inside of a timeout() with at least 15ms to ensure
             * that DOM rendering is complete before running this test!
             * @returns {HTMLElement}
             * @private
             * @ref: https://bugs.webkit.org/show_bug.cgi?id=106133
             */
            function _bodyScrollingElement(){
                if( document.body.scrollHeight > document.body.clientHeight ){
                    return document.body;
                }
                return document.documentElement;
            }

            return {
                parseRule                   : _parseRule,
                determineBodyScrollElement  : _bodyScrollingElement
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
     * @param ApplicationPaths
     * @param Breakpoints
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('tplAbout', ['$document', '$animate', 'Breakpoints',
        function( $document, $animate, Breakpoints ){

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
     * @param $animate
     * @returns {{restrict: string, link: Function}}
     */
    directive('tplExperiments', ['$animate',
        function( $animate ){

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
     * @param Tween
     * @param Modernizr
     */
    service('Parallaxer', ['$window', '$document', 'Tween', 'Modernizr',
        function($window, $document, Tween, Modernizr){

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
                    Tween.set(LayerInfo.$mtns, {x:(100/_beta) * 10});
                }

                this.run = function(){
                    if( _running ){ return this; }
                    $document.on('mousemove', onDeviceMotion);
                    Tween.ticker.addEventListener('tick', animateByMotion);
                    _running = true;
                    return this;
                };

                this.destroy = function(){
                    $document.off('mousemove', onDeviceMotion);
                    Tween.ticker.removeEventListener('tick', animateByMotion);
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
                        Tween.set(LayerInfo.$sky, {x:moveX/2, scale:1+(y*0.1), y:(y*25)});
                        Tween.set(LayerInfo.$mtns, {x:moveX, scale:1+(y*0.1), y:-(y*25)});
                        // Depth layers
                        Tween.set(LayerInfo.$z3, {x:(125*xHalf), autoAlpha:alpha, scale:1+(y*0.1)});
                        Tween.set(LayerInfo.$z2, {x:(300*xHalf), autoAlpha:alpha, scale:1+(y*0.2)});
                        Tween.set(LayerInfo.$z1, {x:(700*xHalf), autoAlpha:alpha, scale:1+(y*0.3)});


                        // Update _prevCoords for next loop test
                        _prevCoords = _coords;
                    }
                }

                this.run = function(){
                    if( _running ){ return this; }
                    $document.on('mousemove', onMouseMove);
                    Tween.ticker.addEventListener('tick', animateByMouse);
                    _running = true;
                    return this;
                };

                this.destroy = function(){
                    $document.off('mousemove', onMouseMove);
                    Tween.ticker.removeEventListener('tick', animateByMouse);
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
     * @param $animate
     * @returns {{restrict: string, link: Function}}
     */
    directive('tplWork', ['$animate',
        function( $animate ){

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

    /**
     * TOJ portfolio directive.
     * @param $window
     * @param $document
     * @param $rootScope
     * @param Timeline
     * @param Tween
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('portfolioToj', ['$window', '$document', '$rootScope', 'Timeline', 'Tween', 'TimelineHelper', 'Utilities',
        function( $window, $document, $rootScope, Timeline, Tween, TimelineHelper, Utilities ){

            function _link( scope, $element ){

                var scrollElement,
                    scrollPercent,
                    scrollableHeight,
                    smoothWheelTime,
                    smoothWheelDist,
                    masterTimeline,
                    progressBar,
                    $markers;

                /**
                 * document.body.scrollHeight computes inconsistently b/w chrome, firefox, and IE. This
                 * will inspect the actual source height from the stylesheet directly and then compute
                 * it against the body height
                 * @note body.fixed-max::after {height:{xx}%;} (MUST be percentage!)
                 * @returns {number}
                 * @private
                 */
                function _scrollableHeight(){
                    return scrollElement.scrollHeight;
                }

                /**
                 * Get the position from top of the scrollElement
                 * @returns {scrollTop|*|number|scrollTop|scrollTop|Function}
                 * @private
                 * @note: (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
                 */
                function _scrollPosition(){
                    return scrollElement.scrollTop;
                }

                /**
                 * Normalize mousewheel (and especially OXS trackpad momentum scrolling)
                 * http://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
                 * @param e
                 */
                function normalizeMousewheel(e){
                    var o = e,
                        d = o.detail, w = o.wheelDelta,
                        n = 225, n1 = n- 1, f;

                    // Normalize delta
                    d = d ? w && (f = w/d) ? d/f : -d/1.35 : w/120;
                    // Quadratic scale if |d| > 1
                    d = d < 1 ? d < -1 ? (-Math.pow(d, 2) - n1) / n : d : (Math.pow(d, 2) + n1) / n;
                    // Delta *should* not be greater than 2...
                    e.delta = Math.min(Math.max(d / 2, -1), 1);
                }

                /**
                 * Smooth scrolling: http://blog.bassta.bg/2013/05/smooth-page-scrolling-with-tweenmax/
                 * @param event
                 * @return void
                 */
                function _onWheel(event){
                    event.preventDefault();
                    // Normalize mousewheel speed for consistency
                    normalizeMousewheel(event);
                    // Tween the scrollbar to specific location, implicitly tweening the timeline
                    Tween.to(scrollElement, smoothWheelTime, {
                        scrollTo: {y:(_scrollPosition() - parseInt(event.delta * smoothWheelDist)), autoKill:true},
                        ease: Power2.easeOut,
                        overwrite: 5
                    });
                }

                /**
                 * Animation loop function, called on every tick
                 * @return void
                 */
                function _animationLoop(){
                    scrollPercent = _scrollPosition() / (scrollableHeight - document.body.clientHeight); //element.scrollTop / (element.scrollHeight - element.clientHeight)
                    masterTimeline.progress(scrollPercent);
                    Tween.to(progressBar, 0.5, {width:Math.round(masterTimeline.progress()*100)+'%', overwrite:5});
                }

                /**
                 * Build the timeline.
                 * @param linkedEl
                 * @returns TimelineMax | TimelineLite
                 * @private
                 */
                function _buildTimeline( linkedEl ){
                    var masterTimeline  = new Timeline({paused:true, useFrames:false, smoothChildTiming:true}),
                        _intro          = linkedEl.querySelector('.intro'),
                        _screens        = linkedEl.querySelector('.screens'),
                        _screensImgs    = _screens.querySelectorAll('img'),
                        _screensSpans   = _screens.querySelectorAll('span'),
                        _about          = linkedEl.querySelector('.about'),
                        _video          = linkedEl.querySelector('.video');

                    masterTimeline._playByScroll = function( _label, _duration ){
                        var labelPoint = this._labels[_label] / this.totalDuration();
                        // Tween to
                        Tween.to(scrollElement, (_duration || 2), {
                            scrollTo: {y:((scrollableHeight - scrollElement.clientHeight) * labelPoint), autoKill:true},
                            ease: Power2.easeOut,
                            overwrite: 5
                        });
                    };

                    masterTimeline.
                        addLabel('intro').
                        to(_intro, 3, {backgroundPositionY:'100%', backgroundPositionX:'100%'}).
                        to(_intro.querySelector('small'), 2, {top:500, autoAlpha:0, ease:Power2.easeIn}, '-=2.5').
                        to(_intro.querySelector('h1'), 2, {y:'-200%', autoAlpha:0, ease:Power2.easeOut}, '-=2').
                        to(_intro, 2, {top:'-50%'},'-=1.5').

                        addLabel('textual').
                        to([_intro.querySelector('.textual'),_screens], 2, {top:'50%'}, '-=2').
                        fromTo(_intro.querySelector('h3'), 1, {y:300}, {y:0}).
                        staggerTo(_intro.querySelectorAll('h2, h3'), 1, {y:300, autoAlpha:0}, 0.5).
                        to([_intro, _screens], 1, {y:'-50%'}, '-=1').

                        addLabel('screens').
                        to(_screensImgs[0], 1, {x:'-80%'}).
                        to(_screensImgs[1], 1, {y:'-56%'}, '-=1').
                        to(_screensImgs[2], 1, {x:'-20%',y:'-53%'}, '-=1').
                        to(_screensSpans[0], 1, {x:'-30%',y:-20}, '-=1').
                        to(_screensSpans[2], 1, {x:'30%',y:-20}, '-=1').
                        fromTo(_screens.querySelector('.phonerize'), 0.5, {scale:0.8}, {scale:1, rotationY:30}, '-=1').
                        staggerTo(_screensImgs, 1.5, {left:0,autoAlpha:0}, 0.5).
                        staggerTo(_screensSpans, 1.5, {y:200,autoAlpha:0}, 0.5, '-=2.5').
                        to(_screens.querySelector('.bg'), 4, {autoAlpha:1}, '-=3').

                        addLabel('about').
                        to(_about, 1, {y:'-100%'}, '-=2').

                        addLabel('video').
                        to(_video, 1, {y:'-100%'}, '-=1');

//                    var video   = document.querySelector('video'),
//                        canvas  = document.querySelector('canvas'),
//                        context = canvas.getContext('2d'),
//                        cw      = canvas.clientWidth, //Math.floor(canvas.clientWidth/100),
//                        ch      = canvas.clientHeight;//Math.floor(canvas.clientHeight/100);
//                    canvas.width = cw;
//                    canvas.height = ch;
//
//                    var videoavail = false;
//
//                    //video.play();
//
//                    video.ondurationchange = function(){
//                        masterTimeline.to(video, this.duration, {currentTime:'+=1'});
//                        masterTimeline.invalidate().restart();
//                        videoavail = true;
//                        video.play();
//                        console.log('playing');
//
//                        (function draw(v,c,w,h){
//                            video.play();
//                            c.drawImage(v,0,0,w,h);
//                            video.pause();
//                            setTimeout(draw,20,v,c,w,h);
//                        })(video,context,cw,ch);
//                    };

                    return masterTimeline;

//                    var timeline = new Timeline({paused:true, useFrames:false}),
//                        frame0   = linkedEl.querySelector('.frame-0'),
//                        frame1   = linkedEl.querySelector('.frame-1'),
//                        device   = frame1.querySelector('.device'),
//                        deviceIn = device.querySelector('.inner-l1'),
//                        frame2   = linkedEl.querySelector('.frame-2'),
//                        frame3   = linkedEl.querySelector('.frame-3');
//
//                    timeline._playByScroll = function( _label ){
//                        var labelPoint = this._labels[_label] / this.totalDuration();
//                        // Tween to
//                        Tween.to(scrollElement, 2, {
//                            scrollTo: {y:((scrollableHeight - scrollElement.clientHeight) * labelPoint), autoKill:true},
//                            ease: Power2.easeOut,
//                            overwrite: 5
//                        });
//                    };
//
//                    return timeline.
//                        add('start').
//                        to(frame0, 15, {backgroundPositionY:'100%', backgroundPositionX:'100%'}).
//                        to(frame0.querySelector('small'), 2, {top:500, autoAlpha:0, ease:Power2.easeIn}, '-=14').
//                        to(frame0.querySelector('h1'), 2, {y:'-200%', autoAlpha:0, ease:Power2.easeOut}, '-=12').
//                        add('frame1').
//                        to(frame1, 2, {y:'-100%'}, '-=11.5').
//                        to(deviceIn, 2, {css:{className:'inner-l1 desktop'}}, '-=8').
//                        to(deviceIn, 2, {css:{className:'inner-l1 laptop'}}, '-=6').
//                        to(deviceIn, 2, {css:{className:'inner-l1 tablet'}}, '-=4').
//                        to(deviceIn, 2, {css:{className:'inner-l1 phone'}}, '-=2').
//                        to(device, 2, {rotationZ:-15, x:'-100%'}).
//                        staggerFromTo(frame1.querySelectorAll('.copy *'), 2.5, {autoAlpha:0,y:200}, {autoAlpha:1,y:0}, 0.65).
//                        to(frame1, 4, {}).
//                        to(frame1.querySelectorAll('.device, .copy'), 2, {y:'-75%', autoAlpha:0}).
//                        add('frame2').
//                        to(frame2, 2, {top:'-=100%'}, '-=2').
//                        to(frame2, 11, {backgroundPositionY:'100%', backgroundSize:'300% 300%', ease:Power2.easeOut}).
//                        fromTo(frame2.querySelector('img'), 3, {y:-1000}, {y:0}, '-=11').
//                        fromTo(frame2.querySelector('.col-sm-4'), 3, {x:800}, {x:0}, '-=9').
//                        to(frame2, 2, {}).
//                        add('frame3').
//                        set(frame3, {top:0}).
//                        fromTo(frame3, 2, {x:1000}, {x:0}).
//                        fromTo(frame3.querySelector('img'), 2, {x:-1500,autoAlpha:0}, {x:0,autoAlpha:1});
                }

                /**
                 * Init function once everything is ready to roll
                 */
                function init(){
                    // Try to unbind any previous event listeners if they stuck around
                    $document.off('mousewheel DOMMouseScroll', _onWheel);
                    Tween.ticker.removeEventListener('tick', _animationLoop);

                    scrollElement       = scope._scrollTarget;
                    scrollPercent       = 0;
                    scrollableHeight    = _scrollableHeight();
                    smoothWheelTime     = 0.65;
                    smoothWheelDist     = 325;
                    masterTimeline      = _buildTimeline($element[0]);
                    progressBar         = $element[0].querySelector('.progress > .value');
                    $markers            = angular.element($element[0].querySelectorAll('.progress > .marker'));

                    // Set marker locations
                    angular.forEach($markers, function( node ){
                        node.style.left = Math.round((masterTimeline.getLabelTime(node.getAttribute('data-label'))/masterTimeline._totalDuration)*100) + '%';
                    });

                    // Bind click event to markers
                    $markers.on('click', function(){
                        $markers.removeClass('active');
                        angular.element(this).addClass('active');
                        var labelTime = masterTimeline.getLabelTime(this.getAttribute('data-label'));
                        Tween.to(scrollElement, 2, {
                            //scrollTo: {y:(scrollableHeight - scrollElement.clientHeight) * (+(this.getAttribute('data-percent'))/100), autoKill:true},
                            scrollTo: {y: (labelTime/masterTimeline._totalDuration) * (scrollableHeight - scrollElement.clientHeight), autoKill:true },
                            ease: Power2.easeOut,
                            overwrite: 5
                        });
                    });

                    // "Autoplay"
                    scope.autoplay = function(){
                        masterTimeline._playByScroll('about', 12);
                    };

                    // Kickoff events n' shit
                    $document.on('mousewheel DOMMouseScroll', _onWheel);
                    Tween.ticker.addEventListener('tick', _animationLoop);
                }

                /**
                 * Watch _scrollTarget property on scope, and when its set to
                 * an element, initialize this mofo.
                 */
                scope.$watch('_scrollTarget', function( target ){
                    if( angular.isElement(target) ){
                        init();
                    }
                });

                /**
                 * Tear down event bindings; used in the controller's scope.$destroy
                 * event listener.
                 * @return void
                 */
                scope.linkTearDown = function(){
                    $document.off('mousewheel DOMMouseScroll', _onWheel);
                    Tween.ticker.removeEventListener('tick', _animationLoop);
                    masterTimeline.kill();
                };
            }

            return {
                restrict: 'A',
                link: _link,
                scope:true,
                controller: ['$rootScope', '$timeout', '$scope', function( $rootScope, $timeout, $scope ){
                    $rootScope.bodyClasses['fixed-max'] = true;

                    $scope.tlProgress = 0;

                    /**
                     * On view content loaded, do a quick timeout (to allow for render update) and
                     * test differences b/w "...scrollHeight" and "...clientHeight" on doc.body; this
                     * is a quick way to tell where the mouseWheel event should be bound as there are
                     * inconsistencies b/w webkit and everyone else.
                     * @type {*|function()|$on|$on|$on|$on}
                     * @todo: more bullet-proof implementation of determining/waiting to init so the scroll
                     * bug error doesn't get caught
                     */
                    var $unregister = $rootScope.$on('$viewContentLoaded', function(){
                        $timeout(function(){
                            $scope._scrollTarget = Utilities.determineBodyScrollElement();
                        }, 100);
                    });

                    /**
                     * On scope destroy, clean errrthang up.
                     */
                    $scope.$on('$destroy', function(){
                        $rootScope.bodyClasses['fixed-max'] = false;
                        $unregister();
                        $scope.linkTearDown();
                    });
                }]
            };
        }
    ]);