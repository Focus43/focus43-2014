/* global Power2 */
angular.module('redeaux.pages').

    /**
     * new'able PortfolioTimeline; handles setting up all event bindings for portfolio items
     * and makes it super easy to create timelines.
     * @param $document
     * @param Timeline
     * @param Tween
     * @returns {Function} reference to CustomTimeline
     */
    factory('PortfolioTimeline', ['$document', 'Timeline', 'Tween',
        function( $document, Timeline, Tween ){

            /**
             * CustomTimeline class constructor. HAVE to pass in the following arguments and
             * they're added as properties to 'this' via the constructor. To override the
             * defaults; you can just pass in the {propName:value}.
             *
             * @param _required
             * {
             *  element: node,
             *  scrollTarget: node,
             *  $progressContainer: jqLite,
             *  $progressBar: jqLite
             * }
             * @constructor
             */
            function CustomTimeline( _required ){
                // Defaults
                this.scrollPercent      = 0;
                this.scrollHeight       = 0;
                this.smoothWheelTime    = 0.65;
                this.smoothWheelDist    = 325;
                this.timeline           = new Timeline({paused:true, smoothChildTiming:true});

                // Merge _required into class properties.
                angular.extend(this, (_required || {}));

                // Store LOCALLY SCOPED references to the event handlers (so we can properly unbind)
                var wheelEvent        = this._onWheelHandler.bind(this),
                    animFrameEvent    = this._onAnimationFrameHandler.bind(this),
                    markerClickEvent  = this._onMarkerClickHandler.bind(this);

                // Should be recreated every time CustomTimeline is instantiated
                this._bindEvents = function(){
                    $document.on('mousewheel DOMMouseScroll', wheelEvent);
                    this.$progressContainer.on('click', markerClickEvent);
                    Tween.ticker.addEventListener('tick', animFrameEvent);
                };

                // Same as above...
                this._unbindEvents = function(){
                    $document.off('mousewheel DOMMouseScroll', wheelEvent);
                    this.$progressContainer.off('click', markerClickEvent);
                    Tween.ticker.removeEventListener('tick', animFrameEvent);
                };
            }


            /**
             * animationFrame event handler
             * @private
             */
            CustomTimeline.prototype._onAnimationFrameHandler = function(){
                this.scrollPercent = this._getScrollPosition() / (this._getScrollHeight() - document.body.clientHeight);
                this.timeline.progress(this.scrollPercent);
                Tween.to(this.$progressBar, 0.5, {width:Math.round(this.timeline.progress()*100)+'%', overwrite:5});
            };


            /**
             * on(mousewheel || DOMMouseScroll) event handler
             * @param event
             * @private
             */
            CustomTimeline.prototype._onWheelHandler = function( event ){
                event.preventDefault();
                // Normalize mousewheel speed for consistency
                this._normalizeMousewheel(event);
                // Tween the scrollbar to specific location, implicitly tweening the timeline
                Tween.to(this.scrollTarget, this.smoothWheelTime, {
                    scrollTo: {y:(this._getScrollPosition() - parseInt(event.delta * this.smoothWheelDist)), autoKill:true},
                    ease: Power2.easeOut,
                    overwrite: 5
                });
            };


            /**
             * onClick handler for marker items in the progress bar
             * @param event
             * @private
             */
            CustomTimeline.prototype._onMarkerClickHandler = function( event ){
                if( event.target.tagName === 'A' ){
                    angular.element(this.$progressContainer[0].querySelectorAll('.marker')).removeClass('active');
                    event.target.className += ' active';
                    var labelTime = this.timeline.getLabelTime(event.target.getAttribute('data-label'));
                    Tween.to(this.scrollTarget, 2, {
                        scrollTo: {y: (labelTime/this.timeline._totalDuration) * (this._getScrollHeight() - this.scrollTarget.clientHeight), autoKill:true },
                        ease: Power2.easeOut,
                        overwrite: 5
                    });
                }
            };


            /**
             * Take the scrollWheel event and normalize it across browsers.
             * @param event
             * @private
             */
            CustomTimeline.prototype._normalizeMousewheel = function( event ){
                var o = event,
                    d = o.detail, w = o.wheelDelta,
                    n = 225, n1 = n- 1, f;
                // Normalize delta
                d = d ? w && (f = w/d) ? d/f : -d/1.35 : w/120;
                // Quadratic scale if |d| > 1
                d = d < 1 ? d < -1 ? (-Math.pow(d, 2) - n1) / n : d : (Math.pow(d, 2) + n1) / n;
                // Delta *should* not be greater than 2...
                event.delta = Math.min(Math.max(d / 2, -1), 1);
            };


            /**
             * Create the progress markers according to the labels in the timeline.
             * @private
             */
            CustomTimeline.prototype._buildMarkers = function(){
                var fragment = document.createDocumentFragment(),
                    index    = 0,
                    length   = Object.keys(this.timeline._labels).length - 1;

                angular.forEach(this.timeline._labels, function( labelTime, key ){
                    var el = document.createElement('a');
                    el.className = 'marker';
                    el.setAttribute('data-label', key);
                    el.style.left = Math.round(index / length*100) + '%';
                    el.innerText = index + 1;
                    fragment.appendChild(el);
                    index++;
                });

                this.$progressContainer.append(fragment);
            };


            /**
             * document.body.scrollHeight computes inconsistently b/w chrome, firefox, and IE. This
             * will inspect the actual source height from the stylesheet directly and then compute
             * it against the body height.
             * @note body.fixed-max::after {height:{xx}%;} (MUST be percentage!)
             * @returns {number}
             * @private
             */
            CustomTimeline.prototype._getScrollHeight = function(){
                return this.scrollTarget.scrollHeight;
            };


            /**
             * Get the position from top of the scrollElement.
             * * @note: (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
             * @returns {scrollTop|*|number|scrollTop|scrollTop|Function}
             * @private
             */
            CustomTimeline.prototype._getScrollPosition = function(){
                return this.scrollTarget.scrollTop;
            };


            /**
             * After instantiation, call this method to add things to the timeline instance
             * @usage: instance.build(function( tl ){ tl.to().addLabel()... })
             * @param _callback
             */
            CustomTimeline.prototype.build = function( _callback ){
                _callback.apply(this, [this.timeline]);
                this._buildMarkers();
                this._bindEvents();
            };


            /**
             * Destroy the instance, and more importantly all references within to mark
             * for garbage collection.
             */
            CustomTimeline.prototype.destroy = function(){
                this.timeline.kill();
                this._unbindEvents();
                Object.keys(this).forEach(function( k ){
                    this[k] = null;
                });
            };


            return CustomTimeline;
        }
    ]);