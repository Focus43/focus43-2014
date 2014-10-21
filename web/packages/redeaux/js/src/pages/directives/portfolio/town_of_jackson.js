/* global Power2 */
angular.module('redeaux.pages').

    directive('portfolioToj', ['$window', '$document', '$rootScope', 'TimelineLite', 'TweenLite',
        function( $window, $document, $rootScope, TimelineLite, TweenLite ){

            function _link( scope, $element ){

                var scrollElement,
                    scrollPercent,
                    scrollableHeight,
                    smoothWheelTime,
                    smoothWheelDist,
                    masterTimeline,
                    progressBar,
                    markers;

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
//                    var styleSheet = Array.prototype.slice.call(document.styleSheets).filter(function(ss){ return ss.href; }),
//                        styleRules = styleSheet[0].cssRules,
//                        computed   = 0;
//                    for(var key in styleRules){
//                        if( styleRules[key].selectorText ){
//                            if( /body\.fixed-max*(.)+after/.test(styleRules[key].selectorText) ){
//                                computed = (parseInt(styleRules[key].style.height)/100) * document.body.clientHeight;
//                                break;
//                            }
//                        }
//                    }
//                    return computed;
                }

                /**
                 * Get the position from top of the scrollElement
                 * @returns {scrollTop|*|number|scrollTop|scrollTop|Function}
                 * @private
                 */
                function _scrollPosition(){
                    return scrollElement.scrollTop;
                    //return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
                }

                /**
                 * Smooth scrolling: http://blog.bassta.bg/2013/05/smooth-page-scrolling-with-tweenmax/
                 * @param event
                 * @return void
                 */
                function _onWheel(event){
                    event.preventDefault();

                    var delta       = event.wheelDelta/120 || -(event.detail/3),
                        scrolled    = _scrollPosition(),
                        scrollCalc  = scrolled - parseInt(delta * smoothWheelDist);

                    TweenLite.to(scrollElement, smoothWheelTime, {
                        scrollTo: {y:scrollCalc, autoKill:true},
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
                    TweenLite.to(progressBar, 0.5, {width:Math.round(masterTimeline.progress()*100)+'%', overwrite:5});
                }

                /**
                 * Build the timeline.
                 * @param linkedEl
                 * @returns TimelineLite
                 * @private
                 */
                function _buildTimeline( linkedEl ){
                    var timeline = new TimelineLite({paused:true, useFrames:false}),
                        frame1   = linkedEl.querySelector('.frame-1'),
                        device   = frame1.querySelector('.device'),
                        deviceIn = device.querySelector('.inner-l1'),
                        frame2   = linkedEl.querySelector('.frame-2'),
                        frame3   = linkedEl.querySelector('.frame-3');

                    //TweenLite.set(frame2, {top:0,autoAlpha:0});

                    return timeline.
                        to(deviceIn, 2, {css:{className:'inner-l1 desktop'}}).
                        to(deviceIn, 2, {css:{className:'inner-l1 laptop'}}).
                        to(deviceIn, 2, {css:{className:'inner-l1 tablet'}}).
                        to(deviceIn, 2, {css:{className:'inner-l1 phone'}}).
                        //pause(25).play().
                        to(device, 2, {rotationZ:-15, x:'-100%'}).
                        staggerFromTo(frame1.querySelectorAll('.copy *'), 2.5, {autoAlpha:0,y:200}, {autoAlpha:1,y:0}, 0.65).
                        to(frame1, 4, {}).
                        to(frame1.querySelectorAll('.device, .copy'), 2, {y:'-75%', autoAlpha:0}).
                        //fromTo(frame2, 2, {top:'100%', autoAlpha:0}, {top:0, autoAlpha:1}, '-=2').
                        //to(frame2, 2, {autoAlpha:1}).
                        to(frame2, 2, {top:'-=100%'}, '-=2').
                        to(frame2, 11, {backgroundPositionY:'100%', ease:Power2.easeOut}).
                        fromTo(frame2.querySelector('img'), 3, {y:-1000}, {y:0}, '-=11').
                        fromTo(frame2.querySelector('.col-sm-4'), 3, {x:800}, {x:0}, '-=9').
                        to(frame2, 2, {}).
                        set(frame3, {top:0}).
                        fromTo(frame3, 2, {x:1000}, {x:0}).
                        fromTo(frame3.querySelector('img'), 2, {x:-1500,autoAlpha:0}, {x:0,autoAlpha:1});
                }

                /**
                 * Init function once everything is ready to roll
                 */
                function init(){
                    scrollElement       = scope._scrollTarget;
                    scrollPercent       = 0;
                    scrollableHeight    = _scrollableHeight();
                    smoothWheelTime     = 0.6;
                    smoothWheelDist     = 50;
                    masterTimeline      = _buildTimeline($element[0]);
                    progressBar         = $element[0].querySelector('.progress > .value');
                    markers             = $element[0].querySelectorAll('.progress > .marker');

                    // Set marker locations
                    Array.prototype.slice.call(markers).forEach(function( node ){
                        node.style.left = node.getAttribute('data-percent') + '%';
                    });

                    // Bind click event to markers
                    angular.element(markers).on('click', function(){
                        angular.element(markers).removeClass('active');
                        angular.element(this).addClass('active');
                        TweenLite.to(scrollElement, 2, {
                            scrollTo: {y:(scrollableHeight - scrollElement.clientHeight) * (+(this.getAttribute('data-percent'))/100), autoKill:true},
                            ease: Power2.easeOut,
                            overwrite: 5
                        });
                    });

                    // Kickoff events n' shit
                    $document.on('mousewheel DOMMouseScroll', _onWheel);
                    TweenLite.ticker.addEventListener('tick', _animationLoop);
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
                    TweenLite.ticker.removeEventListener('tick', _animationLoop);
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
                     */
                    var $unregister = $rootScope.$on('$viewContentLoaded', function(){
                        $timeout(function(){
                            if( document.body.scrollHeight > document.body.clientHeight ){
                                $scope._scrollTarget = document.body;
                            }else{
                                $scope._scrollTarget = document.documentElement;
                            }
                        }, 15);
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


//    directive('portfolioToj', ['$window', '$document', 'TimelineLite', 'TweenLite',
//        function( $window, $document, TimelineLite, TweenLite ){
//
//            function _link( scope, $element ){
//
//                var element         = $element[0],
//                    scrollPercent   = 0,
//                    smoothWheelTime = 0.6,
//                    smoothWheelDist = 50,
//                    masterTimeline  = new TimelineLite({paused:true, useFrames:false});
//
//                // selectors
//                var track  = document.querySelector('.track'),
//                    images = document.querySelectorAll('[portfolio-toj] img'),
//                    _fixed = document.querySelector('.pseudo-fixed');
//
//                masterTimeline.
//                    to(document.querySelector('h1'), 3, {y:-2000}).
//                    fromTo(images[0], 2, {y:0, x:500}, {y:'-100%', x:0}).
//                    to(images[0], 5, {rotationZ:6,rotationY:20,y:-150,x:0}).
//                    to(images[0], 1, {rotationY:55,rotationX:-40,autoAlpha:0}).
//                    to(images[1], 3, {y:'-200%'}, '-=2');
//
////                masterTimeline.
////                    to(images[0], 3, {rotationX:45,rotationZ:50,scale:1.8}).
////                    to(images[0], 1, {x:800}).
////                    to(images[1], 1, {y:-650}, '-=1').
////                    //delay(10).play().
////                    to(images[1], 1, {autoAlpha:0, scale:0.8, delay:7});
//
//
//                // Smooth scrolling: http://blog.bassta.bg/2013/05/smooth-page-scrolling-with-tweenmax/
//                function onWheel(event){
//                    event.preventDefault();
//
//                    var delta       = event.wheelDelta/120 || -(event.detail/3),
//                        scrolled    = element.scrollTop,
//                        scrollCalc  = scrolled - parseInt(delta * smoothWheelDist);
//
//                    TweenLite.to(element, smoothWheelTime, {
//                        scrollTo: {y:scrollCalc, autoKill:true},
//                        ease: Power2.easeOut,
//                        overwrite: 5
//                    });
//                }
//
//
//                function animationLoop(){
//                    _fixed.style.top = element.scrollTop + 'px';
//                    //track.style.top  = -(element.scrollTop) + 'px';
//                    scrollPercent = element.scrollTop / (element.scrollHeight - element.clientHeight);
//                    masterTimeline.progress(scrollPercent);
//                }
//
//
//
//
////            (new TimelineLite({onComplete:function(){
////                var tl = (new TimelineLite({repeat:-1}))
////                    .fromTo($z1, 8, {x:200, scale:1, rotationX:0, y:-50}, {x:-550, scale:0.75, rotationX:30, y:30, ease:Power2.easeInOut})
////                    .fromTo($z2, 7, {x:100}, {x:-250, ease:Power2.easeInOut}, 0)
////                    .fromTo($z3, 6, {x:150}, {x:-100, ease:Power2.easeInOut}, 0)
////                    .fromTo($z4, 5, {x:-15}, {x:15, ease:Power2.easeInOut}, 0)
////                    .yoyo(true);
////            }}))
////                .set($all, {autoAlpha:0})
////                .staggerFromTo($all, 2.5, {scale:9}, {scale:1, autoAlpha:1, ease:Power2.easeOut}, 0.5)
////                .to($z1, 2.5, {x:200, y:-50}, 2.5)
////                .to($z2, 2.5, {x:100}, 2.5)
////                .to($z3, 2.5, {x:150}, 2.5)
////                .to($z4, 2.5, {x:-15}, 2.5);
//
//
//
//
//                // Kickoff events n' shit
//                $element.on('mousewheel DOMMouseScroll', onWheel);
//                TweenLite.ticker.addEventListener('tick', animationLoop);
//
//                // Straight MURDA MURDA animation loop. Kapow.
//                scope.$on('$destroy', function(){
//                    $element.off('mousewheel DOMMouseScroll', onWheel);
//                    TweenLite.ticker.removeEventListener('tick', animationLoop);
//                });
//            }
//
//            return {
//                restrict: 'A',
//                link: _link
//            };
//        }
//    ]);