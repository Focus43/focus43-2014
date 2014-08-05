angular.module('f43.common')

    .directive('alive', ['$window', 'TweenLite', 'TimelineLite',
        function( $window, TweenLite, TimelineLite ){

            var $track      = angular.element(document.querySelector('#track')),
                $sections   = angular.element(document.querySelectorAll('section')),
                $layers     = angular.element(document.querySelectorAll('#parallax .layer')),
                $arrows     = angular.element(document.querySelectorAll('#content .arrow')),
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

                $arrows.on('click', function(){
                    var _sections   = ($sections.length - 1),
                        _current    = [].indexOf.call($sections, document.querySelector('section.active')),
                        _next       = (angular.element(this).hasClass('left')) ? (_current === 0 ? 0 : (_current - 1)) : (_current === _sections ? _sections : (_current + 1));
                    $sections.removeClass('active').eq(_next).addClass('active');
                    parallaxTo(_next);
                });

//                angular.element($window).on('scroll', function(ev){
//                    var percent = (window.scrollY / (trackH - winH)),
//                        moveX   = percent * winW;
//                    TweenLite.set($layers, {x:-(moveX)});
//                });
            }

            return {
                restrict: 'A',
                scope: false,
                link: _linker
            };
        }
    ]);