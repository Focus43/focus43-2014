angular.module('redeaux.common').

    /**
     * Handle parallax background; automatically determines if should be using
     * accelerometer readings if appropriate.
     * @param $window
     * @param $document
     * @param TweenLite
     * @param Modernizr
     * @returns {{restrict: string, link: Function, scope: boolean}}
     */
    directive('parallaxer', ['$window', '$document', 'TweenLite', 'Modernizr',
        function( $window, $document, TweenLite, Modernizr ){

            /**
             * Layer info "class" (injected into either MouseMotion or DeviceMotion). Don't
             * extend as intended to use composition over inheritance.
             * @param $element
             * @constructor
             */
            function LayerInfo( $element ){
                var _self       = this;
                this.$element   = $element[0];
                this.$sky       = this.$element.querySelector('.sky');
                this.$mtns      = this.$element.querySelector('.mtn');
                this.winW       = $window.innerWidth;
                this.winH       = $window.innerHeight;
                this.layerW     = this.$sky.clientWidth;
                this.layerD     = this.layerW - this.winW; // layer delta (difference)

                // On window resize, update internal values
                angular.element($window).on('resize', function(){
                    _self.winW       = $window.innerWidth;
                    _self.winH       = $window.innerHeight;
                    _self.layerW     = _self.$sky.clientWidth;
                    _self.layerD     = _self.layerW - _self.winW;
                });
            }

            /**
             * @param xCoord
             * @returns {number}
             */
            LayerInfo.prototype.percentX = function( xCoord ){ return xCoord / this.winW; };

            /**
             * @param yCoord
             * @returns {number}
             */
            LayerInfo.prototype.percentY = function( yCoord ){ return yCoord / this.winH; };

            /**
             * @param xPercent
             * @returns {number}
             */
            LayerInfo.prototype.moveX    = function( xPercent ){ return -(xPercent * this.layerD); };

            /**
             * If device has accelerometer *and* its a touch device, this will get
             * instantiated.
             * @param LayerInfo
             * @constructor
             */
            function DeviceMotion( LayerInfo ){
                var _running = false,
                    _beta;

                // Run on every requestAnimationFrame tick
                function onDeviceMotion( _event ){
                    _beta = _event.rotationRate.beta;
                }

                // Animation only runs if coordinates have changed
                function animateByMotion(){
                    TweenLite.set(LayerInfo.$mtns, {x:(100/_beta) * 10});
                }

                this.init = function(){
                    if( _running ){ return; }
                    $document.on('mousemove', onDeviceMotion);
                    TweenLite.ticker.addEventListener('tick', animateByMotion);
                    _running = true;
                };

                this.destroy = function(){
                    $document.off('mousemove', onDeviceMotion);
                    TweenLite.ticker.removeEventListener('tick', animateByMotion);
                    _running = false;
                };
            }

            /**
             * If regular old desktop...
             * @param LayerInfo
             * @constructor
             */
            function MouseMotion( LayerInfo ){
                var _running = false,
                    _coords, _prevCoords;

                // Run on every requestAnimationFrame tick
                function onMouseMove( _event ){
                    _coords = {x:_event.pageX, y:_event.pageY};
                }

                // Animation only runs if coordinates have changed
                function animateByMouse(){
                    if( _coords !== _prevCoords ){
                        var x = LayerInfo.percentX( _coords.x ),
                            y = LayerInfo.percentY( _coords.y ),
                            mx = LayerInfo.moveX( x );

                        // Update layers
                        TweenLite.set(LayerInfo.$sky, {x:mx/2, scale:1+(y*0.1), y:(y*25)});
                        TweenLite.set(LayerInfo.$mtns, {x:mx, scale:1+(y*0.1), y:-(y*25)});

                        // Update _prevCoords for next loop test
                        _prevCoords = _coords;
                    }
                }

                this.init = function(){
                    if( _running ){ return; }
                    $document.on('mousemove', onMouseMove);
                    TweenLite.ticker.addEventListener('tick', animateByMouse);
                    _running = true;
                };

                this.destroy = function(){
                    $document.off('mousemove', onMouseMove);
                    TweenLite.ticker.removeEventListener('tick', animateByMouse);
                    _running = false;
                };
            }

            /**
             * Link function for the directive.
             * @param scope
             * @param $element
             * @private
             */
            function _link( scope, $element ){
                var _info    = new LayerInfo( $element),
                    _handler = ( Modernizr.touch && Modernizr.devicemotion ) ?
                        new DeviceMotion(_info) : new MouseMotion(_info);

                scope.start = _handler.init;
                scope.stop  = _handler.destroy;

                // Destruct on removal (shouldn't ever get called, but just in case)
                scope.$on('$destroy', function(){
                    _handler.destroy(); console.log('PARALLAX LAYER DESTROYED');
                });
            }


            return {
                restrict: 'A',
                link: _link,
                scope: true
            };
        }
    ]);