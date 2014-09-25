/* global FastClick */
;(function( window, angular, undefined ){ 'use strict';

    angular.module('redeaux', ['ngRoute', 'ngResource', 'ngAnimate', 'redeaux.common', 'redeaux.pages']).

        config(['$provide', '$routeProvider', '$locationProvider', '$httpProvider',
            function( $provide, $routeProvider, $locationProvider, $httpProvider ){
                // Http config
                $httpProvider.defaults.headers.common['x-angularized'] = true;

                // Enable HTML5 location mode
                $locationProvider.html5Mode(true).hashPrefix('!');

                // Route definitions (purely dynamic)
                $routeProvider.
                    when('/:page*?', {
                        resolve: {
                            precompiled: ['$templateCache', '$q', function( $templateCache, $q ){
                                if( $templateCache.info().size === 0 ){
                                    var defer = $q.defer();
                                    $templateCache.put(window.location.pathname, window['precompiled_view']);
                                    defer.resolve();
                                    return defer.promise;
                                }
                            }]
                        },
                        templateUrl: function(params){
                            return '/' + (params.page || '');
                        }
                    });
            }
        ]).

        run(['$rootScope', 'NavState', function($rootScope, NavState){
            FastClick.attach(document.body);

            $rootScope.$on('$routeChangeStart', function(){
                NavState.open = false;
            });
        }]);


    /**
     * Bootstrap angular
     */
    angular.element(document).ready(function(){
        // Before angular initializes, store the innerHTML of ng-view before its compiled
        var $page = document.querySelector('section.page-body');
        window['precompiled_view'] = $page.innerHTML;

        // Purge all innerHTML contents
        while($page.firstChild){
            $page.removeChild($page.firstChild);
        }

        // Set target="_self" on all valid link tags to force following if logged into CMS...
        if( angular.element(document.documentElement).hasClass('cms-admin') ){
            angular.element(document.querySelectorAll('a')).each(function( index, el ){
                el.setAttribute('target', '_self');
            });
        }

        // NOW bootstrap angular
        angular.bootstrap(document, ['redeaux']);
    });

})(window, window.angular);
angular.module('redeaux.common', []);

angular.module('redeaux.pages', []);

angular.module('redeaux.common').

    controller('CtrlRoot', ['$scope', 'NavState',
        function( $scope, NavState ){

        }
    ]);
angular.module('redeaux.common').

    /**
     * Shared service for managing navigation state.
     */
    factory('NavState', [function(){
        return {
            open: false,
            working: false
        };
    }]).

    /**
     * Nav element directive handler
     */
    directive('nav', [function factory(){

        function _link( scope, $element, attrs ){
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
            controller: ['$scope', 'NavState', function( $scope, NavState ){
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
            }]
        };
    }]);
angular.module('redeaux.common').

    directive('parallaxer', ['$document', 'TweenLite', 'Modernizr',
        function( $document, TweenLite, Modernizr ){

            /**
             * @todo: make working implementation
             * @param scope
             * @param $element
             * @private
             */
            function _linkDeviceMotion( scope, $element ){
                var $win = angular.element(window),
                    $sky = $element[0].querySelector('.sky'),
                    $mtn = $element[0].querySelector('.mtn'),
                    winW = document.body.clientWidth,
                    winH = document.body.clientHeight,
                    plxW = $sky.clientWidth,
                    plxD = plxW - winW,
                    _beta;

                function onDeviceMotion( _event ){
                    _beta = _event.rotationRate.beta;
                    //_beta = _event.accelerationIncludingGravity.x;
                }

                function animateByMotion(){
                    //TweenLite.set($mtn, {x:(100/_beta) * 10});
                }

                // Bindings
                $win.on('devicemotion', onDeviceMotion);
                TweenLite.ticker.addEventListener('tick', animateByMotion);

                scope.$on('$destroy', function(){
                    $win.off('devicemotion', onDeviceMotion);
                    TweenLite.ticker.removeEventListener('tick', animateByMotion);
                });
            }


            function _linkMouse( scope, $element ){
                var $sky = $element[0].querySelector('.sky'),
                    $mtn = $element[0].querySelector('.mtn'),
                    winW = document.body.clientWidth,
                    winH = document.body.clientHeight,
                    plxW = $sky.clientWidth,
                    plxD = plxW - winW,
                    _coords, _prevCoords;

                // Run on every requestAnimationFrame tick
                function onMouseMove( _event ){
                    _coords = {x:_event.pageX, y:_event.pageY};
                }

                // Animation only runs if coordinates have changed
                function animateByMouse(){
                    if( _coords !== _prevCoords ){
                        var x = _coords.x / winW,
                            y = _coords.y / winH,
                            mx = -(plxD * x);

                        TweenLite.set($sky, {x:mx/2, scale:1+(y*0.1), y:(y * 25)});
                        TweenLite.set($mtn, {x:mx, scale:1+(y*0.1), y:-(y * 25)});

                        // Update _prevCoords for next loop test
                        _prevCoords = _coords;
                    }
                }

                // Bindings
                $document.on('mousemove', onMouseMove);
                TweenLite.ticker.addEventListener('tick', animateByMouse);

                // Destruct on removal
                scope.$on('$destroy', function(){
                    TweenLite.ticker.removeEventListener('tick', animateByMouse);
                    $document.off('mousemove', onMouseMove);
                });
            }

            return {
                restrict: 'A',
                link: (Modernizr.touch && Modernizr.devicemotion) ? _linkDeviceMotion : _linkMouse
            };
        }
    ]);
/* global TimelineLite */

angular.module('redeaux.common').

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
     * Wrap TimelineMax library for dependency injection
     */
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
angular.module('redeaux.pages').

    directive('tplAbout', ['TweenLite', '$document',
        function( TweenLite, $document ){

            function _link( scope, $element ){

            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);
angular.module('redeaux.pages').

    directive('tplHome', ['TweenLite', '$document',
        function( TweenLite, $document ){

            function _link( scope, $element ){
                var $z3     = $element[0].querySelector('.shard.z3'),
                    $z2     = $element[0].querySelector('.shard.z2'),
                    $z1     = $element[0].querySelector('.shard.z1'),
                    winW    = document.body.clientWidth,
                    winH    = document.body.clientHeight,
                    halfW   = winW / 2,
                    _coords, _prevCoords;

                // Run on every requestAnimationFrame tick
                function onMouseMove( _event ){
                    _coords = {x:_event.pageX, y:_event.pageY};
                }

                // Animation only runs if coordinates have changed
                function animate(){
                    if( _coords !== _prevCoords ){
                        var x = (halfW - _coords.x) / winW,
                            y = _coords.y / winH,
                            a = y + 0.25;

                        TweenLite.set($z3, {x:(125*x), autoAlpha:a, scale:1+(y*0.1)});
                        TweenLite.set($z2, {x:(300*x), autoAlpha:a, scale:1+(y*0.2)});
                        TweenLite.set($z1, {x:(700*x), autoAlpha:a, scale:1+(y*0.3)});

                        // Update _prevCoords for next loop test
                        _prevCoords = _coords;
                    }
                }

                // Mousemove event binding
                $document.on('mousemove', onMouseMove);

                // Start animation binding
                TweenLite.ticker.addEventListener('tick', animate);

                // Destruct on removal
                scope.$on('$destroy', function(){
                    TweenLite.ticker.removeEventListener('tick', animate);
                    $document.off('mousemove', onMouseMove);
                });
            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);
angular.module('redeaux.pages').

    directive('tplWork', ['TweenLite', '$document',
        function( TweenLite, $document ){

            function _link( scope, $element ){

            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);