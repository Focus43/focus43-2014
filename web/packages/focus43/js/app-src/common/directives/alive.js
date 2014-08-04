angular.module('f43.common')

    .directive('alive', ['$window', 'TweenLite', 'TimelineLite',
        function( $window, TweenLite, TimelineLite ){

            var $track  = angular.element(document.querySelector('#track')),
                $layers = angular.element(document.querySelectorAll('#parallax .layer')),
                winW, winH, trackH;

            function _linker( scope, $element, attrs ){
                winW = document.body.clientWidth;
                winH = document.documentElement.clientHeight;
                trackH = $track[0].clientHeight;

                angular.element($window).on('scroll', function(ev){
                    var percent = (window.scrollY / (trackH - winH)),
                        moveX   = percent * winW;
                    TweenLite.set($layers, {x:-(moveX)});
                });
            }

            return {
                restrict: 'A',
                scope: false,
                link: _linker
            };
        }
    ]);