angular.module('redeaux.common').

    directive('parallaxer', ['$document', 'TweenLite', 'Modernizr',
        function( $document, TweenLite, Modernizr ){

            /**
             * @todo: make working implementation
             * @param scope
             * @param $element
             * @private
             */
            function _linkDeviceMotion( scope, $element ){
                var $win = angular.element(window),
                    $sky = $element[0].querySelector('.sky'),
                    $mtn = $element[0].querySelector('.mtn'),
                    winW = document.body.clientWidth,
                    winH = document.body.clientHeight,
                    plxW = $sky.clientWidth,
                    plxD = plxW - winW,
                    _beta;

                function onDeviceMotion( _event ){
                    _beta = _event.rotationRate.beta;
                    //_beta = _event.accelerationIncludingGravity.x;
                }

                function animateByMotion(){
                    //TweenLite.set($mtn, {x:(100/_beta) * 10});
                }

                // Bindings
                $win.on('devicemotion', onDeviceMotion);
                TweenLite.ticker.addEventListener('tick', animateByMotion);

                scope.$on('$destroy', function(){
                    $win.off('devicemotion', onDeviceMotion);
                    TweenLite.ticker.removeEventListener('tick', animateByMotion);
                });
            }


            function _linkMouse( scope, $element ){
                var $sky = $element[0].querySelector('.sky'),
                    $mtn = $element[0].querySelector('.mtn'),
                    winW = document.body.clientWidth,
                    winH = document.body.clientHeight,
                    plxW = $sky.clientWidth,
                    plxD = plxW - winW,
                    _coords, _prevCoords;

                // Run on every requestAnimationFrame tick
                function onMouseMove( _event ){
                    _coords = {x:_event.pageX, y:_event.pageY};
                }

                // Animation only runs if coordinates have changed
                function animateByMouse(){
                    if( _coords !== _prevCoords ){
                        var x = _coords.x / winW,
                            y = _coords.y / winH,
                            mx = -(plxD * x);

                        TweenLite.set($sky, {x:mx/2, scale:1+(y*0.1), y:(y * 25)});
                        TweenLite.set($mtn, {x:mx, scale:1+(y*0.1), y:-(y * 25)});

                        // Update _prevCoords for next loop test
                        _prevCoords = _coords;
                    }
                }

                // Bindings
                $document.on('mousemove', onMouseMove);
                TweenLite.ticker.addEventListener('tick', animateByMouse);

                // Destruct on removal
                scope.$on('$destroy', function(){
                    TweenLite.ticker.removeEventListener('tick', animateByMouse);
                    $document.off('mousemove', onMouseMove);
                });
            }

            return {
                restrict: 'A',
                link: (Modernizr.touch && Modernizr.devicemotion) ? _linkDeviceMotion : _linkMouse
            };
        }
    ]);