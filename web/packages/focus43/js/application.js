angular.module('f43.common', []);

/* global requestAnimationFrame */
/* global ThrowPropsPlugin */
/* global Hammer */

angular.module('f43.common')

    .directive('animate', ['$window', 'TweenLite', 'TimelineLite',
        function( $window, TweenLite, TimelineLite ){

            var elContent       = document.querySelector('#content'),
                elFalseTrack    = document.querySelector('#falseTrack'),
                elTrack         = document.querySelector('#track'),
                parallaxLayers  = document.querySelectorAll('#parallax .layer'),
                sections        = document.querySelectorAll('section'),
                timelineMaster  = new TimelineLite({
                    paused:true,
                    data: {section: 1},
                    onStart: function(){
                        console.log('started');
                    }
                    //smoothChildTiming:true
                }),
                winH, winW, trackH, trackW;

            var watchScrollPosition = true;

            function processDimensions(){
                winH = document.documentElement.clientHeight;
                winW = document.body.clientWidth;
                trackH = elTrack.clientHeight;
                trackW = winW;
            }

            function random(min, max){
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function tlInstance(_params){
                return new TimelineLite(_params);
            }


            /**
             * @returns TimelineLite
             */
            function timelineSection1(){
                return tlInstance()
                    //.to(elTrack, 0, {y:0});
                    .to($window, 0, {scrollTo:{y:0}, ease:Power2.easeOut});
            }

            /**
             * @returns TimelineLite
             */
            function timelineSection2(){
                return tlInstance()
                    //.to(elTrack, 1, {y:-(winH)});
                    .to($window, 1, {scrollTo:{y:winH}, ease:Power2.easeOut});

//                TweenLite.set(sections[1].querySelector('.inside-track'), {
//                    transformOrigin:'50% 100%'
//                });
//
//                var _timeline = (new TimelineLite()).
//                    to(elTrack, 1, {y:-(winH), ease:Power2.easeIn, roundProps:"y"}, 0).
//                    fromTo(sections[1].querySelector('.pane'), 1, {top:'100%'}, {top:0}).
//                    to(sections[1].querySelector('.node:nth-child(1)'), 0.5, {opacity:1, backgroundColor:'rgba(255,255,255,0.5)'}).
//                    to(sections[1].querySelector('.inside-track'), 2, {left:'-=100%', delay:1}).
//                    to(sections[1].querySelector('.node:nth-child(1)'), 0.5, {opacity:0}).
//                    to(sections[1].querySelector('.node:nth-child(2)'), 0.5, {opacity:1, backgroundColor:'rgba(15,15,79,0.8)'}, '-=0.5').
//                    to(sections[1].querySelector('.inside-track'), 2, {left:'-=100%'}).
//                    to(sections[1], 1, {rotationX:20, rotationY:20, scale:0.7}).
//                    to(sections[1].querySelector('.subscroller'), 1, {z: 10}).
//                    to(sections[1].querySelector('.inside-track'), 1, {z: 50, rotationX: 90});
//
//
//                return _timeline;
            }

            function timelineSection3(){
                return tlInstance()
//                    .to(elTrack, 1, {y:-(winH*2)});
                    .to($window, 1, {scrollTo:{y:(winH*2)}, ease:Power2.easeOut});

//                var _timeline = (new TimelineLite()).
//                    to(elTrack, 1, {y:-(winH*2), ease:Power2.easeIn, roundProps:"y"}, 0).
//                    fromTo(sections[2].querySelector('.rotated'), 2, {left:'-100%'}, {left:0, ease:Power2.easeInOut});
//
//                return _timeline;
            }

            function timelineSection4(){
                return tlInstance()
                    .to(elTrack, 1, {y:-(winH*3)});
//                var _timeline = (new TimelineLite())
//                    .to(elTrack, 1, {y:-(winH*3), ease:Power2.easeIn, roundProps:"y"}, 0);
//                return _timeline;
            }

            function timelineSection5(){
                return tlInstance();
//                var _timeline = (new TimelineLite())
//                    .to(elTrack, 1, {y:-(winH*4), ease:Power2.easeIn, roundProps:"y"}, 0);
//                return _timeline;
            }

            function buildTimelines(){
                // Nest the timelines into the master
                timelineMaster
                    .add(timelineSection1(), 'section1').addPause()
                    .add(timelineSection2(), 'section2').addPause()
                    .add(timelineSection3(), 'section3').addPause();
                    //.add(timelineSection4(), 'section4').addPause();
//                    .add(timelineSection4(), 'section4')
//                    .add(timelineSection5(), 'section5');

                $window['tlMaster'] = timelineMaster;
            }

            function _linkFn( scope, $element, attrs, Controller ){
                processDimensions();
                buildTimelines();

                angular.element($window)
                    .on('scroll', function(){
                        timelineMaster.data.section = (function(position){
                            if( position >= Math.ceil((sections[0].clientHeight * 0.75)) * 5 ){
                                return 5;
                            }
                            if( position >= Math.ceil((sections[0].clientHeight * 0.75)) * 4 ){
                                return 4;
                            }
                            if( position >= Math.ceil((sections[0].clientHeight * 0.75)) * 3 ){
                                return 3;
                            }
                            if( position >= Math.ceil((sections[0].clientHeight * 0.75)) * 2 ){
                                return 2;
                            }
                            if( position >= Math.ceil((sections[0].clientHeight * 0.75)) * 1 ){
                                return 1;
                            }
                            return 1;
                        })(window.scrollY);
                    });

                var lastSection = timelineMaster.data.section;
                setInterval(function(){
                    if( lastSection !== timelineMaster.data.section ){
                        TweenLite.to($window, 1, {scrollTo:{y: (winH*timelineMaster.data.section)}, ease:Power2.easeOut});
                        lastSection = timelineMaster.data.section;
                    }
                }, 250);

//                setInterval(function(){
//                    if( watchScrollPosition ){
//
//                        if( window.scrollY > (sections[0].clientHeight * 0.75) ){
//                            TweenLite.to($window, 1, {scrollTo:{y:winH}, ease:Power2.easeOut});
//                            //timelineMaster.gotoAndPlay('section2');
//                            return;
//                        }
//
//                    }
//                }, 250);

//                angular.element($window).on('scroll', function(){
//                    manualScroll = true;
//                });

//                (function draw(){
//                    //requestAnimationFrame(draw);
//                })();

//                var _hammer = new Hammer(document.documentElement);
//                _hammer.get('pan').set({direction: Hammer.DIRECTION_VERTICAL});
//
//                var lastMove = 0,
//                    trackY   = 0,
//                    duration = timelineMaster.totalDuration(),
//                    notch    = duration / trackH;

                //ThrowPropsPlugin.track(elTrack, 'y');

                //_hammer.on('pan', function(event){
                    console.log(event);
//                    if( event.timeStamp - lastMove > 200 ){
//                        console.log(event.deltaY);
//                        lastMove = event.timeStamp;
//                        trackY = trackY + (event.deltaY * (notch*100));
//                        TweenLite.to(elTrack, 0.25, {
//                            y: trackY,
//                            ease: Power2.easeOut
//                        });
//                    }

                    //ThrowPropsPlugin.track(elTrack, 'y');
//                    TweenLite.to(elTrack, 0.1, {
//                        y: trackY,
//                        ease: Power2.easeOut
//                    });

//                    if( (event.timeStamp - lastMove) > 200 ){
//                        lastMove = event.timeStamp;
//                        trackY   = trackY - (event.velocityY * 100);
//                        TweenLite.to(elTrack, 0.5, {y: trackY, ease:Power2.easeOut});
//
//                        //console.log(event.velocityY, timelineMaster.totalTime() + (timelineMaster.totalTime() * event.velocityY));
//
////                        TweenLite.to(timelineMaster, 0.2, {
////                            time: event.velocityY * duration //((event.velocityY * 5)/100) + timelineMaster.progress()
////                        });
//
////                        console.log('playTo', (notch / (1 - event.velocityY))*duration );
////                        TweenLite.to(timelineMaster, 0.2, {
////                            progress: timelineMaster.progress() + (1-event.velocityY)
////                        });
//
////                        TweenLite.to(timelineMaster, 0.2,
////                            {progress: timelineMaster.progress() + event.velocityY}
////                            //{time: timelineMaster.totalTime() + (timelineMaster.totalTime() * event.velocityY)}
////                            //{time: (window.scrollY / (trackH - winH)) * timelineMaster.totalDuration()}
////                            //{ThrowProps: {time: timelineMaster.totalDuration() + _to}}
////                        );
//                        //timelineMaster.totalTime(_scroll * timelineMaster.totalDuration());
//                    }
                //});



                // Prevents overscrolling on iOS!
//                document.addEventListener('touchmove', function(e){
//                    e.preventDefault();
//                }, false);

//                (function _draw(){
//                    //console.log(window.scrollY, 'ON ANIMATION FRAME');
//                    //Controller.progressTo(window.scrollY);
//                    requestAnimationFrame(_draw);
//                })();

//                $window.addEventListener('touchmove', function(ev){
//                    event.preventDefault();
//                    console.log(ev);
//                }, false);

//                Draggable.create(document.body, {
//                    type: 'scrollTop',
//                    edgeResistance: 0.5
//                });

//                Draggable.create(elTrack, {
//                    type:'scrollTop',
//                    throwProps:true,
//                    edgeResistance: 0.85,
//                    onThrowUpdate: function(){
//                        console.log(this);
//                    }
//                });


                //ThrowPropsPlugin.track(timelineMaster, 'time');

//                angular.element($window)
//                    .on('scroll', function(ev){
//                        console.log('scroll event triggered!', window.scrollY);
//                        //Controller.progressTo(window.scrollY);
//                    })
//                    .on('mousewheel', function(ev){
//                        //console.log(ev.deltaY);
//                        //Controller.progressTo( (window.scrollY) )
//                        //console.log( (window.scrollY) );
//                        //var _to = timelineMaster.totalDuration() * (ev.deltaY/1000);
//
////                        TweenLite.to(timelineMaster, 0.25,
////                            {time: (window.scrollY / (trackH - winH)) * timelineMaster.totalDuration()}
////                            //{ThrowProps: {time: timelineMaster.totalDuration() + _to}}
////                        );
//                        //timelineMaster.totalTime(_scroll * timelineMaster.totalDuration());
//
//                        //console.log(ev);
//                    });
            }

            return {
                restrict: 'A',
                scope:    false,
                link:     _linkFn,
                controller: ['$rootScope', '$q', function( $rootScope, $q ){

                    var self = this;

                    /**
                     * Call this method to set the progress to a certain point; modifies
                     * the parallax backgrounds then the timelineMaster independently.
                     * @param int verticalOffset
                     */
                    self.progressTo = function( verticalOffset ){
                        var _scroll = (verticalOffset / (trackH - winH)),
                            _moveX  = _scroll * winW;
                        //TweenLite.set(parallaxLayers, {x:-_moveX});
                        //timelineMaster.progress(_scroll);

//                        TweenLite.to(timelineMaster, 0.75,
//                            //{time: _scroll * timelineMaster.totalDuration()}
//                            {ThrowProps: {time: _scroll * timelineMaster.totalDuration()}}
//                        );

//                        ThrowPropsPlugin.track(timelineMaster, 'time');
//                        timelineMaster.totalTime(_scroll * timelineMaster.totalDuration());
                    };

                }]
            };
        }
    ]);
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

//angular.module('f43.navigation').
//
//    directive('nav', ['Modernizr', 'TweenLite', function factory( modernizr, TweenLite ){
//
//        return {
//            restrict: 'E',
//            require:  '^scrollHandler',
//            link: function( $scope, $element, attrs, ScrollHandlerCtrl ){
//                // Swap 'active' class on <li> tags
//                $element.find('a').on('click', function(){
//                    $element.find('li').removeClass('active');
//                    angular.element(this).parent().addClass('active');
//                });
//
//                // Listen for $routeChangeSuccess and perform scrolling navigation
//                $scope.$on('$routeChangeSuccess', function(event, current){
//                    var offset = 0;
//                    if( angular.isDefined(current) ){
//                        var $element = angular.element(document.querySelector('#section-'+current.params.section));
//                        offset = $element[0].offsetTop;
//                    }
//
//                    ScrollHandlerCtrl.parallaxTo(offset).unwatchScrollUntil(function( _defer ){
//                        TweenLite.to(window, 0.35, {scrollTo:{y:offset, autoKill:false}, onComplete: function(){
//                            _defer.resolve();
//                        }});
//                    });
//                });
//            }
//        };
//    }]);
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