/* global FastClick */

;(function(window, angular, undefined){ 'use strict';

    /**
     * 'focus-43' module declaration.
     */
    angular.module('f43', ['ngRoute', 'ngResource', 'ngAnimate', 'f43.common']).

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
                .when('/:section/:level1', {templateUrl: function( params ){
                    return '/' + params.section;
                }});

        }]).

        /**
         * App initialization: *post* configuration and angular bootstrapping.
         */
        run(['$rootScope', '$location', '$timeout', function( $rootScope ){
            // Attach FastClick
            FastClick.attach(document.body);

            // Sidebar settings available on the rootscope
            $rootScope.sidebar = {
                open: false
            };
        }]).

        animation('.sidebar-open', ['TweenLite', 'Modernizr', function(TweenLite, Modernizr){

            //console.log(alert(JSON.stringify(Modernizr)));

            return {

            };

//            return {
//                enter: function(element, done){
//                    console.log('entered');
//                },
//                leave: function(element, done){
//                    console.log('left');
//                },
//                beforeAddClass: function(element, className, done){
//                    //TweenLite.to('#content', 0.5, {x:-(document.body.clientWidth)});
//                    console.log('prior');
//                    done();
//                },
//                addClass: function(element, className, done){
//                    console.log('class added');
//                },
//                beforeRemoveClass: function(element, className, done){
//                    //TweenLite.to('#content',0.25,{x:0});
//                }
//            };
        }]);

//        animation('.custom-view', ['TweenLite', function(TweenLite){
//            return {
//                enter: function(element, done){
//                    TweenLite.to(element, 0.58, {x:0, ease:Power2.easeOut, onComplete: done});
//                },
//                leave: function(element, done){
//                    TweenLite.to(element, 0.58, {x:-(document.body.clientWidth), ease:Power2.easeOut, onComplete: done});
//                }
//            };
//        }]);

})( window, window.angular );

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
//                timelineMaster
//                    .add(timelineSection1(), 'section1').addPause()
//                    .add(timelineSection2(), 'section2').addPause()
//                    .add(timelineSection3(), 'section3').addPause();
                    //.add(timelineSection4(), 'section4').addPause();
//                    .add(timelineSection4(), 'section4')
//                    .add(timelineSection5(), 'section5');

                $window['tlMaster'] = timelineMaster;
            }

            function _linkFn( scope, $element, attrs, Controller ){
                processDimensions();
                buildTimelines();

//                document.addEventListener('touchmove', function(e){
//                    e.preventDefault();
//                }, false);
//
//                Draggable.create('#track', {
//                    type:'scrollTop',
//                    edgeResistance:0.8,
//                    throwProps:true,
//                    onDrag: function(){
//                        console.log( this.endY);
//                    }
//                });

//                angular.element($window)
//                    .on('scroll', function(){
//                        timelineMaster.data.section = (function(position){
//                            if( position >= Math.ceil((sections[0].clientHeight * 0.75)) * 5 ){
//                                return 5;
//                            }
//                            if( position >= Math.ceil((sections[0].clientHeight * 0.75)) * 4 ){
//                                return 4;
//                            }
//                            if( position >= Math.ceil((sections[0].clientHeight * 0.75)) * 3 ){
//                                return 3;
//                            }
//                            if( position >= Math.ceil((sections[0].clientHeight * 0.75)) * 2 ){
//                                return 2;
//                            }
//                            if( position >= Math.ceil((sections[0].clientHeight * 0.75)) * 1 ){
//                                return 1;
//                            }
//                            return 1;
//                        })(window.scrollY);
//                    });
//
//                var lastSection = timelineMaster.data.section;
//                setInterval(function(){
//                    if( lastSection !== timelineMaster.data.section ){
//                        TweenLite.to($window, 1, {scrollTo:{y: (winH*timelineMaster.data.section)}, ease:Power2.easeOut});
//                        lastSection = timelineMaster.data.section;
//                    }
//                }, 250);

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
                    //console.log(event);
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
//                        var _scroll = (verticalOffset / (trackH - winH)),
//                            _moveX  = _scroll * winW;

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
angular.module('f43.common')

    .directive('animator', ['$window', 'TweenLite', 'TimelineLite',
        function( $window, TweenLite, TimelineLite ){

            var $track      = angular.element(document.querySelector('#track')),
                $sections   = angular.element(document.querySelectorAll('section')),
                $layers     = angular.element(document.querySelectorAll('#parallax .layer')),
                winW, winH, trackH;


            function parallaxTo( index ){
                var _percent = index === 0 ? 0 : (index+1)/$sections.length,
                    _moveX   = winW * _percent,
                    _moveY   = index * winH;
                TweenLite.set($layers, {x:-(_moveX)});
                TweenLite.to($track, 0.45, {y:-(_moveY), ease: Power2.easeOut});
            }


            function _linker( scope, $element, attrs ){
                winW = document.body.clientWidth;
                winH = document.documentElement.clientHeight;
                trackH = $track[0].clientHeight;

                angular.element($window).on('resize', function(){
                    winW = document.body.clientWidth;
                    winH = document.documentElement.clientHeight;
                    trackH = $track[0].clientHeight;
                    parallaxTo( angular.element(document.querySelector('nav')).data('$navController').activeIndex() );
                });
            }


            return {
                restrict: 'A',
                scope: false,
                link: _linker,
                controller: ['$scope', function( $scope ){

                    // Publicly accessible method of the controller
                    this.parallaxTo = parallaxTo;

                }]
            };
        }
    ]);
angular.module('f43.common').
    directive('nav', ['$rootScope', '$location', function factory( $rootScope, $location ){

        var $arrows = angular.element(document.querySelectorAll('#content .arrow')),
            $trigger, $listItems, $navLinks;


        function setActiveByIndex( index ){
            $listItems.removeClass('active').eq(index).addClass('active');
        }


        function _linker( scope, $element, attrs, AnimatorController ){
            $trigger   = angular.element(document.querySelector('nav .trigger'));
            $listItems = $element.find('li');
            $navLinks  = angular.element(document.querySelectorAll('.section-nav a'));


            // Instead of listening for clicks on the <a> tags in the nav list, just
            // let the $routeChangeSuccess event update the active index to trigger this
            scope.$watch('activeIndex', function( _index, _prevIndex ){
                if( _index === _prevIndex ){
                    return;
                }
                setActiveByIndex(_index || 0);
                AnimatorController.parallaxTo(_index);
            });

            // Nav trigger (toggle open/close)
            $trigger.on('click', function( event ){
                scope.$apply(function(){
                    $rootScope.sidebar.open = !$rootScope.sidebar.open;
                });
            });

            // If sidebar is open, bind a one-time click listener on the track when its masked
            $rootScope.$watch('sidebar.open', function( status ){
                if( status === true ){
                    angular.element(document.querySelector('#track')).one('click', function(){
                        $rootScope.sidebar.open = false;
                    });
                }
            });

            // Arrow clicks; instead of updating just the active index, we update the
            // *route* (by finding the prev/next <a> tag and getting its href) so that the
            // $routeChangeStart event gets triggered accordingly.
            $arrows.on('click', function(){
                if( angular.element(this).hasClass('left') && scope.activeIndex > 0 ){
                    scope.$apply(function(){
                        $location.path($navLinks.eq(scope.activeIndex-1).attr('href'));
                        //scope.activeIndex--;
                    });
                }

                if( angular.element(this).hasClass('right') && scope.activeIndex < ($listItems.length - 1) ){
                    scope.$apply(function(){
                        $location.path($navLinks.eq(scope.activeIndex+1).attr('href'));
                        //scope.activeIndex++;
                    });
                }
            });
        }


        return {
            restrict: 'E',
            require:  '^animator',
            scope:    true,
            link:     _linker,
            controller: ['$rootScope', '$scope', function( $rootScope, $scope ){
                // Default activeIndex of 0 = home section
                $scope.activeIndex = 0;

                /**
                 * Get the current activeIndex
                 * @returns {number}
                 */
                this.activeIndex = function(){
                    return $scope.activeIndex;
                };

                /**
                 * Watch for route changes and update the scope's active index - which triggers
                 * all subsequent navigation stuff.
                 */
                $scope.$on('$routeChangeStart', function(event, current){
                    var href = '/';
                    if( angular.isDefined(current) && angular.isDefined(current.params.section) ){
                        href += current.params.section;
                    }
                    $scope.activeIndex = Array.prototype.indexOf.call($listItems, document.querySelector('nav [href="'+href+'"]').parentNode);
                    $rootScope.sidebar.open = false;
                });

            }]
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