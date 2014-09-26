angular.module('redeaux.pages').

    directive('tplHome', ['TweenLite', '$document',
        function( TweenLite, $document ){

            function _link( scope, $element ){
                var $bgPrlx = angular.element(document.querySelector('#parallax')),
                    $z3     = $element[0].querySelector('.shard.z3'),
                    $z2     = $element[0].querySelector('.shard.z2'),
                    $z1     = $element[0].querySelector('.shard.z1'),
                    winW    = document.body.clientWidth,
                    winH    = document.body.clientHeight,
                    halfW   = winW / 2,
                    _coords, _prevCoords;

                // Run on every requestAnimationFrame tick
                function onMouseMove( _event ){
                    _coords = {x:_event.pageX, y:_event.pageY};
                }

                // Animation only runs if coordinates have changed
                function animate(){
                    if( _coords !== _prevCoords ){
                        var x = (halfW - _coords.x) / winW,
                            y = _coords.y / winH,
                            a = y + 0.25;

                        TweenLite.set($z3, {x:(125*x), autoAlpha:a, scale:1+(y*0.1)});
                        TweenLite.set($z2, {x:(300*x), autoAlpha:a, scale:1+(y*0.2)});
                        TweenLite.set($z1, {x:(700*x), autoAlpha:a, scale:1+(y*0.3)});

                        // Update _prevCoords for next loop test
                        _prevCoords = _coords;
                    }
                }

                // Mousemove event binding
                $document.on('mousemove', onMouseMove);

                // Start animation binding
                TweenLite.ticker.addEventListener('tick', animate);

                // Initialize the background parallax layer
                if( angular.isDefined($bgPrlx.data('$scope')) ){
                    $bgPrlx.data('$scope').start();
                }

                // Destruct on removal
                scope.$on('$destroy', function(){
                    $document.off('mousemove', onMouseMove);
                    TweenLite.ticker.removeEventListener('tick', animate);
                    if( angular.isDefined($bgPrlx.data('$scope')) ){
                        $bgPrlx.data('$scope').stop();
                    }
                });
            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);