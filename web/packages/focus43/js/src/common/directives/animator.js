angular.module('f43.common')

    .directive('animator', ['$window', 'TweenLite', 'TimelineLite',
        function( $window, TweenLite, TimelineLite ){

            var $track      = angular.element(document.querySelector('#track')),
                $sections   = angular.element(document.querySelectorAll('section')),
                $layers     = angular.element(document.querySelectorAll('#parallax .layer')),
                winW, winH, trackH;


            function parallaxTo( index ){
                var _percent = index === 0 ? 0 : (index+1)/$sections.length,
                    _moveX   = winW * _percent,
                    _moveY   = index * winH;
                TweenLite.set($layers, {x:-(_moveX)});
                TweenLite.to($track, 0.45, {y:-(_moveY), ease: Power2.easeOut});
            }


            function _linker( scope, $element, attrs ){
                winW = document.body.clientWidth;
                winH = document.documentElement.clientHeight;
                trackH = $track[0].clientHeight;

                angular.element($window).on('resize', function(){
                    winW = document.body.clientWidth;
                    winH = document.documentElement.clientHeight;
                    trackH = $track[0].clientHeight;
                    parallaxTo( angular.element(document.querySelector('nav')).data('$navController').activeIndex() );
                });
            }


            return {
                restrict: 'A',
                scope: false,
                link: _linker,
                controller: ['$scope', function( $scope ){

                    // Publicly accessible method of the controller
                    this.parallaxTo = parallaxTo;

                }]
            };
        }
    ]);