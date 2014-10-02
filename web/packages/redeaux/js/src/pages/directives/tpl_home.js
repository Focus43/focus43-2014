angular.module('redeaux.pages').

    /**
     * @param Parallaxer
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('tplHome', ['Parallaxer',
        function( Parallaxer ){

            /**
             * @param scope
             * @param $element
             * @private
             */
            function _link( scope, $element ){
                scope._parallax = Parallaxer.initialize($element[0].querySelector('#parallax'));
            }

            return {
                restrict: 'A',
                link: _link,
                scope: true,
                controller: ['$scope', function( $scope ){
                    // When scope is destroyed, make sure to destruct the parallaxer
                    // so all event listeners are unbound!
                    $scope.$on('$destroy', function(){
                        if( angular.isObject($scope._parallax) ){
                            $scope._parallax.destroy();
                        }
                    });
                }]
            };
        }
    ]).

    /**
     * @description Parallaxer service; gets "new'd" by injector.
     * @param $window
     * @param $document
     * @param TweenLite
     * @param Modernizr
     */
    service('Parallaxer', ['$window', '$document', 'TweenLite', 'Modernizr',
        function($window, $document, TweenLite, Modernizr){

            /**
             * @type {boolean}
             * @private
             */
            var _accelerometer = (Modernizr.touch && Modernizr.devicemotion) ? true : false;

            /**
             * Layer info "class" (injected into either MouseMotion or DeviceMotion). Don't
             * extend as intended to use composition over inheritance.
             * @param element
             * @constructor
             */
            function LayerInfo( element ){
                var _self       = this;
                this.element   = element;
                this.$sky       = this.element.querySelector('.sky');
                this.$mtns      = this.element.querySelector('.mtn');
                this.$z3        = this.element.querySelector('.z3');
                this.$z2        = this.element.querySelector('.z2');
                this.$z1        = this.element.querySelector('.z1');
                this.winW       = $window.innerWidth;
                this.winH       = $window.innerHeight;
                this.layerW     = this.$sky.clientWidth;
                this.layerD     = this.layerW - this.winW; // layer difference

                // Resize handler; automatically updates dimensions for calculations.
                function onResize(){
                    _self.winW   = $window.innerWidth;
                    _self.winH   = $window.innerHeight;
                    _self.layerW = _self.$sky.clientWidth;
                    _self.layerD = _self.layerW - _self.winW;
                }

                // On window resize, update internal values
                angular.element($window).on('resize', onResize);

                // Make sure to always call this to remove the resize listener!
                this.destruct = function(){
                    angular.element($window).off('resize', onResize);
                };
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
            LayerInfo.prototype.moveX = function( xPercent ){ return -(xPercent * this.layerD); };

            /**
             * @param xCoord
             * @returns {number}
             */
            LayerInfo.prototype.halfX = function( xCoord ){ return ((this.winW / 2) - xCoord) / this.winW; };

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

                this.run = function(){
                    if( _running ){ return this; }
                    $document.on('mousemove', onDeviceMotion);
                    TweenLite.ticker.addEventListener('tick', animateByMotion);
                    _running = true;
                    return this;
                };

                this.destroy = function(){
                    $document.off('mousemove', onDeviceMotion);
                    TweenLite.ticker.removeEventListener('tick', animateByMotion);
                    LayerInfo.destruct();
                    LayerInfo = null; // mark for garbage collection
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
                        var x     = LayerInfo.percentX( _coords.x ),
                            y     = LayerInfo.percentY( _coords.y ),
                            xHalf = LayerInfo.halfX( _coords.x),
                            moveX = LayerInfo.moveX( x),
                            alpha = y + 0.25;

                        // Base layers
                        TweenLite.set(LayerInfo.$sky, {x:moveX/2, scale:1+(y*0.1), y:(y*25)});
                        TweenLite.set(LayerInfo.$mtns, {x:moveX, scale:1+(y*0.1), y:-(y*25)});
                        // Depth layers
                        TweenLite.set(LayerInfo.$z3, {x:(125*xHalf), autoAlpha:alpha, scale:1+(y*0.1)});
                        TweenLite.set(LayerInfo.$z2, {x:(300*xHalf), autoAlpha:alpha, scale:1+(y*0.2)});
                        TweenLite.set(LayerInfo.$z1, {x:(700*xHalf), autoAlpha:alpha, scale:1+(y*0.3)});

                        // Update _prevCoords for next loop test
                        _prevCoords = _coords;
                    }
                }

                this.run = function(){
                    if( _running ){ return this; }
                    $document.on('mousemove', onMouseMove);
                    TweenLite.ticker.addEventListener('tick', animateByMouse);
                    _running = true;
                    return this;
                };

                this.destroy = function(){
                    $document.off('mousemove', onMouseMove);
                    TweenLite.ticker.removeEventListener('tick', animateByMouse);
                    LayerInfo.destruct();
                    LayerInfo = null; // mark for garbage collection
                    _running = false;
                };
            }


            /**
             * Call when initializing; automatically determines if should be using
             * mouse or accelerometer and returns the appropriate class instance.
             * @param element Plain javascript object (NOT angular.element!)
             * @returns DeviceMotion | MouseMotion
             */
            this.initialize = function( element ){
                var layerData = new LayerInfo(element);

                if( _accelerometer ){
                    return (new DeviceMotion(layerData)).run();
                }

                return (new MouseMotion(layerData)).run();
            };

        }
    ]);
