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
                    progressContainer,
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
                        _group1         = linkedEl.querySelector('.group-1'),
                        _group2         = linkedEl.querySelector('.group-2'),
                        _intro          = linkedEl.querySelector('.intro'),
                        _brief          = linkedEl.querySelector('.brief'),
                        _screens        = linkedEl.querySelector('.screens'),
                        _screensMobile  = _screens.querySelector('.mobiles'),
                        _screensLarge   = _screens.querySelector('.large-format'),
                        _screensImgs    = _screens.querySelectorAll('img'),
                        _details        = linkedEl.querySelector('.details'),
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

                    return masterTimeline.
                        addLabel('intro').

                        to(_intro.querySelector('img'), 2, {rotation:720, autoAlpha:0}).
                        to(_intro.querySelector('.instruct'), 1, {autoAlpha:0}, '-=1').
                        staggerTo(_intro.querySelectorAll('h1 span'), 1.5, {y:100,autoAlpha:0}, 0.5, '-=1.5').
                        to([_group1, _brief, _group2], 2, {y:'-50%'}).
                        addLabel('background').

                        to(_group1.querySelector('.vert-track'), 4, {y:'-100%'}, '+=2').
                        addLabel('brief').

                        to(_group1.querySelector('.vert-track'), 4, {y:'-200%'}, '+=2').
                        staggerTo(_group1.querySelectorAll('.approach h2'), 3.5, {className:'+=striker'}, 1.5).
                        addLabel('approach').

                        to([_group1, _brief, _group2], 2, {y:'-100%'}, '+=1').
                        fromTo(_screensMobile, 2, {y:-700,autoAlpha:0}, {y:0,autoAlpha:1}, '-=1').
                        fromTo(_screensMobile.querySelector('h3'), 1, {y:100,autoAlpha:0}, {y:0,autoAlpha:1}, '-=1.5').
                        add([
                            Tween.to(_screensImgs[0], 1, {x:'-80%'}),
                            Tween.to(_screensImgs[1], 1, {y:'-56%'}),
                            Tween.to(_screensImgs[2], 1, {x:'-20%',y:'-53%'}),
                            Tween.fromTo(_screensMobile, 0.5, {scale:0.8}, {scale:1, rotationY:30})
                        ]).
                        addLabel('mobiles').

                        to(_screensMobile, 4, {x:'-100%', autoAlpha:0}, '+=2').
                        to(_screensLarge, 3, {x:'-100%', ease:Power2.easeOut}, '-=4').
                        fromTo(_screensLarge.querySelector('h3'), 2, {y:100,autoAlpha:0}, {y:0,autoAlpha:1}, '+=2').
                        addLabel('larges').

                        to(_group2, 2, {y:'-200%'}).
                        add([
                            Tween.fromTo(_details.querySelector('.background'), 2, {scale:1.4, rotation:5}, {scale:1, rotation:0}),
                            Tween.staggerFromTo(_details.querySelectorAll('.design p'), 2, {y:50,autoAlpha:0}, {y:0,autoAlpha:1}, 1)
                        ]).
                        addLabel('design').

                        add([
                            Tween.to(_details.querySelector('.design'), 2, {x:'-100%'}),
                            Tween.to(_details.querySelector('.tech'), 2, {x:'100%'})
                        ], '+=2').
                        staggerFromTo(_details.querySelectorAll('.tech p'), 6, {y:50,autoAlpha:0}, {y:0,autoAlpha:1}, 2).
                        addLabel('tech').

                        to([_video], 4, {y:'-100%'}, '+=2').
                        addLabel('final');
                }

                /**
                 * AFTER the masterTimeline is created, look at the labels and automatically
                 * generate <a class="marker">{index}</a> elements for each; then position
                 * on the timeline accordingly.
                 * @param _timeline
                 * @param _container
                 * @returns {element|*}
                 * @private
                 */
                function _buildAndGetMarkers( _timeline, _container ){
                    var fragment = document.createDocumentFragment(),
                        index    = 1;

                    angular.forEach(_timeline._labels, function( labelTime, key ){
                        var el = document.createElement('a');
                        el.className = 'marker';
                        el.setAttribute('data-label', key);
                        el.style.left = Math.round((labelTime/_timeline._totalDuration)*100) + '%';
                        el.innerText = index++;
                        fragment.appendChild(el);
                    });

                    _container.appendChild(fragment);

                    return angular.element(_container.querySelectorAll('.marker'));
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
                    progressContainer   = $element[0].querySelector('.timeline-progress');
                    progressBar         = progressContainer.querySelector('.value');
                    $markers            = _buildAndGetMarkers( masterTimeline, progressContainer );

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