/* global Power2 */
/* global SteppedEase */
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

//                var canvas  = document.querySelector('canvas'),
//                    context = canvas.getContext('2d');
//                canvas.width = canvas.clientWidth;
//                canvas.height = canvas.clientHeight;
//                canvas._useFrame = 0;

                /**
                 * Animation loop function, called on every tick
                 * @return void
                 */
                function _animationLoop(){
                    scrollPercent = _scrollPosition() / (scrollableHeight - document.body.clientHeight); //element.scrollTop / (element.scrollHeight - element.clientHeight)
                    masterTimeline.progress(scrollPercent);
                    Tween.to(progressBar, 0.5, {width:Math.round(masterTimeline.progress()*100)+'%', overwrite:5});

//                    if( canvas._frameCollection && canvas._useFrame > 0 ){
//                        context.clearRect(0,0,canvas.width,canvas.height);
//                        var img = canvas._frameCollection[Math.round(canvas._useFrame)];
//                        context.drawImage(img,0,0,canvas.width,canvas.height);
//                    }
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
                        to(_video, 1, {y:'-100%'});
                        //to(_video, 1, {autoAlpha:1});
                        //to(_video, 1, {y:'-100%'}, '-=1');

//                    var imgCollection = [];
//                    (function loadFrames( frame, totalFrames, path ){
//                        var img = new Image();
//                        img.onload = function(){
//                            imgCollection.push(this);
//                            frame++;
//                            if(frame <= totalFrames){
//                                loadFrames(frame,totalFrames,path);
//                            }else{
//                                canvas._frameCollection = imgCollection;
//                            }
//                        };
//                        img.src = path.replace('%s',frame);
//                    })(0, 26, '/packages/redeaux/_scratch/frames5/%s.jpg');
//
//                    masterTimeline.fromTo(canvas, 2, {_useFrame:0}, {_useFrame: 26, ease:SteppedEase.config(26)}, '-=1');

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
                    masterTimeline      = window['tl'] = _buildTimeline($element[0]);
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