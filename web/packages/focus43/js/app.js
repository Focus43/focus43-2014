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
            // Http config
            $httpProvider.defaults.headers.common['x-angularized'] = true;

            // Provide constants
            $provide.factory('AppPaths', function factory(){
                return {
                    toolsBasePath: document.querySelector('meta[name="app-tools"]').getAttribute('content'),
                    toolsHandler: function( _path ){
                        return this.toolsBasePath + _path;
                    }
                };
            });

            var _resolvable  = {
                initialTemplate: ['$templateCache', '$q', function( $templateCache, $q ){
                    if( $templateCache.info().size === 0 ){
                        var _defer = $q.defer();
                        $templateCache.put(window.location.pathname, window._precompiledView);
                        _defer.resolve();
                        return _defer.promise;
                    }
                }]
//                ,templateCheck: ['$q', function( $q ){
//                    var _defer = $q.defer();
//
//                    console.log('CHECKING TEMPLATE');
//                    setTimeout(function(){
//                        console.log('TEMPLATE CHECKED');
//                        _defer.resolve();
//                    }, 1500);
//
//                    return _defer.promise;
//                }]
//                ,pauser: ['$q', function( $q ){
//                    var _defer = $q.defer();
//                    setTimeout(function(){ _defer.resolve(); }, 500);
//                    return _defer.promise;
//                }]
                };

            // If cms-admin class is present on <html>, don't initialize any angular routing
            if( angular.element(document.documentElement).hasClass('cms-admin') ){
                return;
            }

            // Enable HTML5 location mode
            $locationProvider.html5Mode(true).hashPrefix('!');

            // Dynamic routing for top level pages; so $routeChanges{event}s get issued
            $routeProvider.
                when('/:section', {
                    resolve: _resolvable,
                    templateUrl: function( params ){
                        console.log('STATIC PAGE');
                        return '/' + params.section;
                    }
                }).
                when('/:section/:dynamic*?', {
                    resolve: _resolvable,
                    templateUrl: function( params ){
                        console.log('DYNAMIC PAGE');
                        return '/' + params.section + '/' + params.dynamic;
                    }
                }).
                otherwise({
                    templateUrl: '/',
                    resolve: _resolvable
                });
        }]).

        /**
         * App initialization: *post* configuration and angular bootstrapping.
         * @todo: trigger enter animation on ng-view so the immediately cached template
         * gets animated in properly (eg. setTimeout(function(){$route.reload();},500) ?)
         */
        run(['$rootScope', '$route', '$animate', '$templateCache', 'ViewHelper', function( $rootScope, $route, $animate, $templateCache, ViewHelper ){
            //setTimeout(function(){ $route.reload(); }, 500);

            // Attach FastClick
            FastClick.attach(document.body);

            // Set the class on ng-view to the "page-{route}"
            var isFirstRun = true;
            $rootScope.$on('$viewContentLoaded', function(){
                if( isFirstRun ){
                    isFirstRun = false;
                    ViewHelper.viewChanged().resolve();
                }else{
                    ViewHelper.viewChanged();
                }

                $rootScope.pageClass = 'page-' + ($route.current.params.section || 'home');
            });
        }]);


    /**
     * Manually bootstrap angular
     */
    angular.element(document).ready(function() {
        // Before angular is initialized; store the precompiled innerHTML of the ng-view
        var pageElement = document.querySelector('#content-l2 > .page');
        window._precompiledView = pageElement.innerHTML;
        // Remove all elements within pageElement
        while (pageElement.firstChild) {
            pageElement.removeChild(pageElement.firstChild);
        }
        // *Now* bootstrap angular
        angular.bootstrap(document, ['f43']);
    });

})( window, window.angular );

angular.module('f43.common', []);

angular.module('f43.googlemap', []);

angular.module('f43.sections', []);
angular.module('f43.common').

    directive('animator', ['$window', 'TweenLite', function factory( $window, TweenLite ){

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

    directive('areaPartial', [function(){

        function _link( scope, $element, attrs ){
            scope.areaHandle = attrs.areaPartial;
        }

        return {
            restrict: 'A',
            scope: true, // **** DO NOT create isolateScope w/ {...} ****
            link: _link,
            controller: ['$scope', 'AppPaths', function( $scope, AppPaths ){
                // Watch for the areaHandle to be set from the link fn
                $scope.$watch('areaHandle', function( _val ){
                    $scope._partial = {
                        path: AppPaths.toolsHandler('angularized') + '?route=' + window.location.pathname + '&area=' + _val
                    };
                });
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
                    element = $element[0].querySelector('[href="'+href+'"]');

                // @todo: implement fallback
                if( ! element ){
                    return;
                }

                var index = Array.prototype.indexOf.call($listItems, element.parentNode); //_active ? Array.prototype.indexOf.call($listItems, _active.parentNode) : 0;
                // Change active class
                $listItems.removeClass('active').eq(index).addClass('active');
                // Trigger parallax background
                AnimatorController.parallaxTo(index);
                // Close the nav sidebar (if was open)
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
angular.module('f43.common').

    directive('preloader', ['$window', '$q', 'TweenLite', function factory( $window, $q, TweenLite ){

        function getImagePromises( $element ){
            var promises = [],
                images   = Array.prototype.slice.call($element[0].querySelectorAll('img'));

            images.forEach(function( imgNode ){
                var defer       = $q.defer(),
                    synthImage  = new Image();
                synthImage.onload = function(){
                    defer.resolve();
                };
                synthImage.src = imgNode.getAttribute('src');
                promises.push( defer.promise );
            });

            return promises;
        }

        function _link( scope, $element, attrs ){
//            scope.$watch('preloading', function( status ){
//                if( status === true ){
//                    var promises = getImagePromises( $element );
//                    $q.all(promises).then(function(){
//                        console.log('all resolved!');
//                    });
//                }
//                scope.preloading = false;
//            });
        }

        return {
            restrict: 'A',
            link: _link,
            controller: ['$scope', function( $scope ){
                $scope.preloading = false;

                $scope.$on('$viewContentLoaded', function(){
                    $scope.preloading = true;
                });
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

    /**
     * Functions for easily working with common TimelineLite things.
     */
    factory('TimelineHelper', ['TimelineLite', function factory( TimelineLite ){
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
    }]).


    /**
     * Since ngView animation lets the enter/leave animations run concurrently, we
     * need some way to make sure they run in proper order, eg:
     * 1) leave animation COMPLETES
     * 2) enter animation BEGINS
     * This service uses an internally tracked _currentDefer (whereas a new one is
     * created every time viewChanged() gets called!) to keep track of the order in
     * which things get run.
     */
    service('ViewHelper', ['$q', 'TimelineHelper', function factory( $q, TimelineHelper ){
        var _currentDefer = $q.defer();

        /**
         * Create a new _currentDefer object.
         * @return {$.defer()}
         */
        this.viewChanged = function(){
            _currentDefer = $q.defer();
            return _currentDefer;
        };

        /**
         * Enter and Leave functions used to register with animations.
         * @type {{enter: Function, leave: Function}}
         */
        this.whenReady = {
            enter: function( _done, _animations ){
                var timeline = TimelineHelper.suicidal(_done);

                _currentDefer.promise.then(function(){
                    _animations.apply(timeline, [timeline]);
                });
            },
            leave: function( _done, _animations ){
                var timeline = TimelineHelper.suicidal(_done, _currentDefer);
                _animations.apply(timeline, [timeline]);
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
    animation('.page-about', ['ViewHelper', function( ViewHelper ){
        return {
            enter: function($element, _done){
                ViewHelper.whenReady.enter(_done, function( timeline ){
                    timeline.fromTo($element, 0.75, {x:'-200%', autoAlpha:0}, {x:0, autoAlpha:1});
                });
            },
            leave: function($element, _done){
                ViewHelper.whenReady.leave(_done, function( timeline ){
                    timeline.to($element, 0.45, {scale:0.75, autoAlpha:0, ease:Power2.easeOut});
                });
            }
        };
    }]);

/* global Power2 */

angular.module('f43.sections').

    /**
     * Handler specifically for contact section.
     */
    directive('sectionContact', ['$animate', 'GoogleMaps', function factory( $animate, GoogleMaps ){

        function _linker( scope, $element, attrs ){
            scope.mapOptions = {
                center: new GoogleMaps.LatLng(43.479634, -110.760234)
            };

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
            controller: ['$scope', '$http', 'AppPaths', function( $scope, $http, AppPaths ){
                $scope.processing = false;

                $scope.isValid = function(){
                    return $scope.contactForm.$invalid;
                };

                $scope.submit = function(){
                    $scope.processing = true;
                    // POST the form data
                    $http.post(AppPaths.toolsHandler('contact'), $scope.form_data)
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
    animation('.page-contact', ['ViewHelper', function( ViewHelper ){
        return {
            enter: function($element, _done){
                ViewHelper.whenReady.enter(_done, function( timeline ){
                    var _rows = $element[0].querySelectorAll('.row');
                    timeline.
                        set(_rows, {y:'100%', autoAlpha:0}).
                        set($element, {autoAlpha:1}).
                        staggerTo(_rows, 0.25, {y:0, autoAlpha:1}, 0.15);
                });
            },
            leave: function($element, _done){
                ViewHelper.whenReady.leave(_done, function( timeline ){
                    var _rows = Array.prototype.slice.call($element[0].querySelectorAll('.row')).reverse();
                    timeline.staggerTo(_rows, 0.25, {y:500, autoAlpha:0}, 0.1);
                });
            }
        };
    }]).

    /**
     * Animation handler for when the form is sent successfully.
     */
    animation('.form-sent', ['TimelineHelper', function( TimelineHelper ){
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
    }]);
angular.module('f43.sections').

    directive('sectionDefault', [function(){

        function _link( scope, $element ){

        }

        return {
            restrict: 'A',
            scope: true,
            link: _link,
            controller: ['$scope', '$route', '$http', function( $scope, $route, $http ){
                //$scope.pageContent = $route.params.section + '/' + $route.params.dynamic;
                //$scope.pageContent = 'some/route/to/something';

//                $http.get('/tools/packages/focus43/angularized', {
//                    params: {
//                        route: $route.current.params.section + '/' + $route.current.params.dynamic
//                    }
//                }).then(function( resp ){
//                    console.log(resp);
//                });
            }]
        };
    }]);
/* global Power2 */

angular.module('f43.sections').

    directive('sectionExperiments', [function(){

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
    animation('.page-experiments', ['ViewHelper', function( ViewHelper ){
        return {
            enter: function($element, _done){
                ViewHelper.whenReady.enter(_done, function( timeline ){
                    timeline.fromTo($element, 0.75, {x:'-200%', autoAlpha:0}, {x:0, autoAlpha:1});
                });
            },
            leave: function($element, _done){
                ViewHelper.whenReady.leave(_done, function( timeline ){
                    timeline.to($element, 0.45, {scale:0.75, autoAlpha:0, ease:Power2.easeOut});
                });
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
    animation('.page-home', ['ViewHelper', function( ViewHelper ){
        return {
            enter: function($element, _done){
                ViewHelper.whenReady.enter(_done, function( timeline ){
                    timeline.fromTo($element, 0.75, {x:'200%', autoAlpha:0}, {x:0, autoAlpha:1});
                });
            },
            leave: function($element, _done){
                ViewHelper.whenReady.leave(_done, function( timeline ){
                    timeline.to($element, 0.45, {scale:1.5, rotationZ:180, autoAlpha:0, ease:Power2.easeOut});
                });
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
    animation('.page-work', ['ViewHelper', function( ViewHelper ){
        return {
            enter: function($element, _done){
                ViewHelper.whenReady.enter(_done, function( timeline ){
                    timeline.fromTo($element, 0.75, {x:'200%', autoAlpha:0}, {x:0, autoAlpha:1});
                });
            },
            leave: function($element, _done){
                ViewHelper.whenReady.leave(_done, function( timeline ){
                    timeline.to($element, 0.45, {scale:1.5, rotationZ:180, autoAlpha:0, ease:Power2.easeOut});
                });
            }
        };
    }]);
