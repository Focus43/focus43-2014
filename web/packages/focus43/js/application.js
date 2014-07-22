angular.module('f43.common', []);

angular.module('f43.common').

    directive('animations', ['$window', 'TweenLite', 'TimelineLite', function($window, TweenLite, TimelineLite){

        function _linkFun( $scope, $element, attrs ){
            var _container      = document.querySelector('#content'),
                _home           = document.querySelector('#section-home'),
                _about          = document.querySelector('#section-about'),
                _work           = document.querySelector('#section-work'),
                _experiments    = document.querySelector('#section-experiments'),
                _contact        = document.querySelector('#section-contact'),
                timeline        = new TimelineLite({paused:true});

            TweenLite.set([_container, document.querySelector('#stacked')], {css:{
                transformPerspective: 400,
                perspective: 400,
                transformStyle: 'preserve-3d'
            }});

            //timeline
//                .to(_home, 0, {top:0})
//                .to(_about, 1, {top:document.body.clientHeight})
//                .to(_work, 1, {top:document.body.clientHeight*2})
//                .to(_experiments, 1, {top:document.body.clientHeight*3})
//                .to(_contact, 1, {top:document.body.clientHeight*4});

            var timelineHome = new TimelineLite();
            timelineHome
                .to(document.querySelector('#stacked h1'), 1, {x:-500});

            var timelineAbout = new TimelineLite();
            timelineAbout
                .to(_about, 1, {top:document.body.clientHeight});

            timeline
                .add(timelineHome)
                .add(timelineAbout)
                .to(_work, 1, {top:document.body.clientHeight*2})
                .to(_experiments, 1, {top:document.body.clientHeight*3})
                .to(_contact, 1, {top:document.body.clientHeight*4});


//            var container = $element[0],
//                h1        = container.querySelector('h1'),
//                spans     = container.querySelectorAll('span'),
//                timeline  = new TimelineLite({paused:true});
//
//            TweenLite.set(container, {css:{
//                transformPerspective: 400,
//                perspective: 400,
//                transformStyle: 'preserve-3d'
//            }});
//
//            timeline
//                .to(h1, 0.5, {css: {z: -500, opacity:0}});
//
//            Array.prototype.slice.call(spans).forEach(function(el, idx){
//                timeline.to(el, 0.5, {css: {rotationY:(idx===0 ? -90 : 90), x: (idx===0 ? -500 : 500), opacity:0}}, 0);
//            });

            var contentHeight = document.querySelector('#content').clientHeight,
                windowHeight  = document.body.clientHeight;
            angular.element($window).on('scroll', function(){
                var perc = (this.pageYOffset / (contentHeight - windowHeight));
                timeline.progress(perc);
            });

        }

        return {
            scope: false,
            link: _linkFun
        };
    }]);

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
/**
 * Main application entry
 */
;(function(window, angular, undefined){ 'use strict';

    /**
     * 'focus-43' module declaration.
     */
    angular.module('f43', ['ngRoute', 'ngResource', 'f43.common', 'f43.navigation']).

        /**
         * Focus-43 module configuration.
         */
        config(['$routeProvider', '$locationProvider', '$httpProvider', function( $routeProvider, $locationProvider, $httpProvider ){
            // Use html5 location methods
            $locationProvider.html5Mode(true).hashPrefix('!');

            // http config
            $httpProvider.defaults.headers.common['x-angularized'] = true;

            // Dynamic routing for top level pages; so $routeChanges{event}s get issued
            $routeProvider
                .when('/:section', {})
                .when('/experiments/:post', {templateUrl: '/experiments'});

        }]).

        /**
         * App initialization: *post* configuration and angular bootstrapping.
         */
        run(['$rootScope', '$location', '$timeout', function( $rootScope ){
            $rootScope.$on('PRELOAD_UPDATE', function(event, data){
                $rootScope.loaded = (data.length === 0);
            });
        }]);

})( window, window.angular );

angular.module('f43.navigation', []);

angular.module('f43.navigation').

    directive('nav', ['Modernizr', 'TweenLite', function factory( modernizr, TweenLite ){

        return {
            restrict: 'E',
            require:  '^scrollHandler',
            link: function( $scope, $element, attrs, ScrollHandlerCtrl ){
                // Swap 'active' class on <li> tags
                $element.find('a').on('click', function(){
                    $element.find('li').removeClass('active');
                    angular.element(this).parent().addClass('active');
                });

                // Listen for $routeChangeSuccess and perform scrolling navigation
                $scope.$on('$routeChangeSuccess', function(event, current){
                    var offset = 0;
                    if( angular.isDefined(current) ){
                        var $element = angular.element(document.querySelector('#section-'+current.params.section));
                        offset = $element[0].offsetTop;
                    }

                    ScrollHandlerCtrl.parallaxTo(offset).unwatchScrollUntil(function( _defer ){
                        TweenLite.to(window, 0.35, {scrollTo:{y:offset, autoKill:false}, onComplete: function(){
                            _defer.resolve();
                        }});
                    });
                });
            }
        };
    }]);
angular.module('f43.navigation').

    directive('scrollHandler', [ '$window', 'Modernizr', function factory( $window, modernizr ){

        var CONTROLLED_SCROLL = false,
            $target, windowHeight, windowWidth, contentHeight, parallaxLayers;

        function _prefix( declaration ){
            return ['-webkit-', '-moz-', '-o-', '-ms-', ''].join(declaration + ';');
        }

        function linkFn( scope, $element, attrs, Controller ){
            $target        = angular.element(document.querySelector(attrs.scrollTarget));
            windowHeight   = document.body.clientHeight;
            windowWidth    = document.body.clientWidth;
            contentHeight  = $target[0].clientHeight;
            parallaxLayers = Array.prototype.slice.call(document.querySelectorAll(attrs.scrollHandler));

            // Bind window.resize listener to update cached window/content height values.
            angular.element($window)
                // "onWindowScroll"
                .on('scroll', function(){
                    if( CONTROLLED_SCROLL ){ return; }
                    Controller.parallaxTo(this.pageYOffset);
                })
                // "onWindowResize"
                .on('resize', function(){
                    windowHeight  = document.body.clientHeight;
                    windowWidth   = document.body.clientWidth;
                    contentHeight = $target[0].clientHeight;
                });
        }

        return {
            restrict: 'A',
            link:     linkFn,
            controller: ['$rootScope', '$q', function( $rootScope, $q ){
                var _self = this;

                /**
                 * Pass in a page offset integer and this will trigger the parallax layers
                 * to transition to appropriate positions. This is a method on the controller
                 * so it can be used by other directives!
                 * @param pageOffset
                 * @returns {factory}
                 */
                _self.parallaxTo = function( pageOffset ){
                    var _scroll = (pageOffset / (contentHeight - windowHeight)),
                        _moveX  = _scroll * windowWidth;

                    // If 3d transforms are available...
                    if( modernizr.csstransforms3d ){
                        parallaxLayers.forEach(function(_node){
                            _node.style.cssText = _prefix('transform:translateX(-'+_moveX+'px)');
                        });
                        return _self;
                    }

                    // If we're here, fallback to pos:left
                    parallaxLayers.forEach(function(_node){
                        _node.style.left = -_moveX+'px';
                    });
                    return _self;
                };

                /**
                 * Using this method lets you pass in a callback to perform some animation (presumably
                 * that will adjust the scroll position), and make sure that the event bound to the
                 * window scroll above DOES NOT trigger anything. The callback will receive a deferred
                 * object as its only parameter, which MUST be resolved to resume the scroll event.
                 * @param _callback
                 * @returns {factory}
                 */
                _self.unwatchScrollUntil = function( _callback ){
                    // Set CONTROLLED_SCROLL to true (so scroll event on window doesn't do anything)
                    CONTROLLED_SCROLL = true;
                    // Create new deferred
                    var deferred = $q.defer();
                    // Invoke the callback, with the deferred object as an arg
                    _callback.apply(_self, [deferred]);
                    // When the deferred gets resolved...
                    deferred.promise.then(function(){
                        CONTROLLED_SCROLL = false;
                    });
                    return _self;
                };
            }]
        };
    }]);