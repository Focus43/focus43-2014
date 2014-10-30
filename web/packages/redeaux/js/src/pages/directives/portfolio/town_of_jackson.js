/* global Linear */
/* global Power2 */
/* global SteppedEase */
angular.module('redeaux.pages').

    /**
     * TOJ portfolio directive.
     * @param $document
     * @param $rootScope
     * @param Timeline
     * @param Tween
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('portfolioToj', ['$document', '$rootScope', 'Timeline', 'Tween',
        function( $document, $rootScope, Timeline, Tween ){

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
                    scrollPercent = _scrollPosition() / (scrollableHeight - document.body.clientHeight);
                    masterTimeline.progress(scrollPercent);
                    //Tween.to(progressBar, 0.5, {width:Math.round(masterTimeline.progress()*100)+'%', overwrite:5});
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
                        _brief          = linkedEl.querySelector('.brief'),
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

                    var g1 = linkedEl.querySelector('.group-1'),
                        g2 = linkedEl.querySelector('.group-2');

                    return masterTimeline.
                        to([g1, _brief, g2], 2, {y:'-50%'}).

                        to([g1, _brief, g2], 2, {y:'-100%'}).

                        to([g2.querySelector('.screens'), g2.querySelector('.trips')], 2, {y:'-100%'}).

                        to(linkedEl.querySelector('.trips'), 2, {scale:0.8}).
                        to(linkedEl.querySelector('.holder'), 2, {x:'-50%'}, '-=2').

                        to(g2, 2, {y:'-200%'}).
                        to([_about], 2, {y:'-100%'}, '-=2');

                        //to([linkedEl.querySelector('.group-1'), _brief, _screens], 2, {y:'-100%'});
//                        to(linkedEl.querySelector('.trips'), 2, {y:'-100%'}).
//                        to(linkedEl.querySelector('.holder'), 2, {x:'-75%'});

                        //to([_screens, _about], 2, {y:'-100%'});
//                        addLabel('intro').
//                        to(_intro, 3, {backgroundPositionY:'100%', backgroundPositionX:'100%'}).
//                        to(_intro.querySelector('small'), 2, {top:500, autoAlpha:0, ease:Power2.easeIn}, '-=2.5').
//                        to(_intro.querySelector('h1'), 2, {y:'-200%', autoAlpha:0, ease:Power2.easeOut}, '-=2').
//                        to(_intro, 2, {top:'-50%'},'-=1.5').

//                        to([_intro.querySelector('.textual'),_screens], 2, {top:'50%'}, '-=2').
//                        fromTo(_intro.querySelector('h3'), 1, {y:300}, {y:0}).
//                        addLabel('textual').
//                        staggerTo(_intro.querySelectorAll('h2, h3'), 1, {y:300, autoAlpha:0}, 0.5).
//                        to([_intro, _screens], 1, {y:'-50%'}, '-=1').

//                        to(_screensImgs[0], 1, {x:'-80%'}).
//                        to(_screensImgs[1], 1, {y:'-56%'}, '-=1').
//                        to(_screensImgs[2], 1, {x:'-20%',y:'-53%'}, '-=1').
//                        to(_screensSpans[0], 1, {x:'-30%',y:-20}, '-=1').
//                        to(_screensSpans[2], 1, {x:'30%',y:-20}, '-=1').
//                        fromTo(_screens.querySelector('.phonerize'), 0.5, {scale:0.8}, {scale:1, rotationY:30}, '-=1').
//                        addLabel('screens').
//                        staggerTo(_screensImgs, 1.5, {left:0,autoAlpha:0}, 0.5).
//                        staggerTo(_screensSpans, 1.5, {y:200,autoAlpha:0}, 0.5, '-=2.5').
//                        to(_screens.querySelector('.bg'), 4, {autoAlpha:1}, '-=3').
//
//                        to(_about, 1, {y:'-100%'}, '-=2').
//                        addLabel('about').
//
//                        to(_video, 1, {y:'-100%'}).
//                        addLabel('video');
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
                    progressBar         = $element[0].querySelector('.timeline-progress > .value');
                    $markers            = angular.element($element[0].querySelectorAll('.timeline-progress > .marker'));

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
                        masterTimeline._playByScroll('video', 12);
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
                    if( angular.isObject(masterTimeline) ){
                        masterTimeline.kill();
                    }
                };
            }

            return {
                restrict: 'A',
                link: _link,
                scope: true,
                controller: ['$rootScope', '$scope', '$q', 'Preloader', 'Utilities',
                    function( $rootScope, $scope, $q, Preloader, Utilities ){
                        $rootScope.bodyClasses['fixed-max'] = true;

                        /**
                         * @see: See Utilities.determineScrollElement (determines where mousehweel event should be bound
                         * as there are inconsistencies b/w webkit and everything else).
                         */
                        $q.all([
                            Utilities.determineBodyScrollElement(),
                            Preloader.promise()
                        ]).then(function( resolved ){
                            $scope._scrollTarget= resolved[0];
                        });

                        /**
                         * On scope destroy, clean errrthang up.
                         */
                        $scope.$on('$destroy', function(){
                            $rootScope.bodyClasses['fixed-max'] = false;
                            $scope.linkTearDown();
                        });
                    }
                ]
            };
        }
    ]);