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
                 * Smooth scrolling: http://blog.bassta.bg/2013/05/smooth-page-scrolling-with-tweenmax/
                 * @param event
                 * @return void
                 */
                function _onWheel(event){
                    event.preventDefault();

                    var delta       = event.wheelDelta/120 || -(event.detail/3),
                        scrolled    = _scrollPosition(),
                        scrollCalc  = scrolled - parseInt(delta * smoothWheelDist);

                    Tween.to(scrollElement, smoothWheelTime, {
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
                    Tween.to(progressBar, 0.5, {width:Math.round(masterTimeline.progress()*100)+'%', overwrite:5});
                }

                /**
                 * Build the timeline.
                 * @param linkedEl
                 * @returns TimelineMax | TimelineLite
                 * @private
                 */
                function _buildTimeline( linkedEl ){
                    var timeline = new Timeline({paused:true, useFrames:false}),
                        frame0   = linkedEl.querySelector('.frame-0'),
                        frame1   = linkedEl.querySelector('.frame-1'),
                        device   = frame1.querySelector('.device'),
                        deviceIn = device.querySelector('.inner-l1'),
                        frame2   = linkedEl.querySelector('.frame-2'),
                        frame3   = linkedEl.querySelector('.frame-3');

                    timeline._playByScroll = function( _label ){
                        var labelPoint = this._labels[_label] / this.totalDuration();
                        // Tween to
                        Tween.to(scrollElement, 2, {
                            scrollTo: {y:((scrollableHeight - scrollElement.clientHeight) * labelPoint), autoKill:true},
                            ease: Power2.easeOut,
                            overwrite: 5
                        });
                    };

                    return timeline.
                        add('start').
                        to(frame0, 15, {backgroundPositionY:'100%', backgroundPositionX:'100%'}).
                        to(frame0.querySelector('small'), 2, {top:500, autoAlpha:0, ease:Power2.easeIn}, '-=14').
                        to(frame0.querySelector('h1'), 2, {y:'-200%', autoAlpha:0, ease:Power2.easeOut}, '-=12').
                        add('frame1').
                        to(frame1, 2, {y:'-100%'}, '-=11.5').
                        to(deviceIn, 2, {css:{className:'inner-l1 desktop'}}, '-=8').
                        to(deviceIn, 2, {css:{className:'inner-l1 laptop'}}, '-=6').
                        to(deviceIn, 2, {css:{className:'inner-l1 tablet'}}, '-=4').
                        to(deviceIn, 2, {css:{className:'inner-l1 phone'}}, '-=2').
                        to(device, 2, {rotationZ:-15, x:'-100%'}).
                        staggerFromTo(frame1.querySelectorAll('.copy *'), 2.5, {autoAlpha:0,y:200}, {autoAlpha:1,y:0}, 0.65).
                        to(frame1, 4, {}).
                        to(frame1.querySelectorAll('.device, .copy'), 2, {y:'-75%', autoAlpha:0}).
                        add('frame2').
                        to(frame2, 2, {top:'-=100%'}, '-=2').
                        to(frame2, 11, {backgroundPositionY:'100%', backgroundSize:'300% 300%', ease:Power2.easeOut}).
                        fromTo(frame2.querySelector('img'), 3, {y:-1000}, {y:0}, '-=11').
                        fromTo(frame2.querySelector('.col-sm-4'), 3, {x:800}, {x:0}, '-=9').
                        to(frame2, 2, {}).
                        add('frame3').
                        set(frame3, {top:0}).
                        fromTo(frame3, 2, {x:1000}, {x:0}).
                        fromTo(frame3.querySelector('img'), 2, {x:-1500,autoAlpha:0}, {x:0,autoAlpha:1});
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
                        Tween.to(scrollElement, 2, {
                            scrollTo: {y:(scrollableHeight - scrollElement.clientHeight) * (+(this.getAttribute('data-percent'))/100), autoKill:true},
                            ease: Power2.easeOut,
                            overwrite: 5
                        });
                    });

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
                     */
                    var $unregister = $rootScope.$on('$viewContentLoaded', function(){
                        $timeout(function(){
                            $scope._scrollTarget = Utilities.determineBodyScrollElement();
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