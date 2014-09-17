/* global webkitCancelRequestAnimationFrame */

angular.module('f43.sections').

    directive('sectionHome', ['$document', 'TweenLite', 'TimelineMax', function( $document, TweenLite, TimelineLite ){

        function _link( scope, $element ){
            var $wrap       = document.querySelector('#logolax'),
                $z4         = document.querySelector('#z4'),
                $z3         = document.querySelector('#z3'),
                $z2         = document.querySelector('#z2'),
                $z1         = document.querySelector('#z1'),
                $all        = [$z4,$z3,$z2,$z1],
                winW        = document.body.clientWidth,
                winH        = document.body.clientHeight,
                halfWidth   = winW / 2,
                halfHeight  = winH / 2,
                _coords, _animationFrame;

//            (new TimelineLite({onComplete:function(){
//                var tl = (new TimelineLite({repeat:-1}))
//                    .fromTo($z1, 8, {x:200, scale:1, rotationX:0, y:-50}, {x:-550, scale:0.75, rotationX:30, y:30, ease:Power2.easeInOut})
//                    .fromTo($z2, 7, {x:100}, {x:-250, ease:Power2.easeInOut}, 0)
//                    .fromTo($z3, 6, {x:150}, {x:-100, ease:Power2.easeInOut}, 0)
//                    .fromTo($z4, 5, {x:-15}, {x:15, ease:Power2.easeInOut}, 0)
//                    .yoyo(true);
//            }}))
//                .set($all, {autoAlpha:0})
//                .staggerFromTo($all, 2.5, {scale:9}, {scale:1, autoAlpha:1, ease:Power2.easeOut}, 0.5)
//                .to($z1, 2.5, {x:200, y:-50}, 2.5)
//                .to($z2, 2.5, {x:100}, 2.5)
//                .to($z3, 2.5, {x:150}, 2.5)
//                .to($z4, 2.5, {x:-15}, 2.5);

            angular.element($document).on('mousemove', function( ev ){
                _coords = {x:ev.pageX, y:ev.pageY};
            });

            (function _draw(){
                if( _coords ){
                    var _x = (halfWidth - _coords.x) / winW,
                        _y = (halfHeight - _coords.y) / winH;
                    TweenLite.set($z4, {x:-(290*_x),y:-(290*_y)});
                    TweenLite.set($z3, {x:-(50*_x),y:-(50*_y)});
                    TweenLite.set($z2, {x:(250*_x),y:(500*_y)});
                    TweenLite.set($z1, {x:(1200*_x),y:(1200*_y)});
                }
                _animationFrame = requestAnimationFrame(_draw);
            })();

            // "Destruct" on removal
            scope.$on('$destroy', function(){
                cancelAnimationFrame(_animationFrame);
            });
        }

        return {
            restrict: 'A',
            scope: true,
            link: _link
        };
    }]).


    /**
     * Animation
     */
    animation('.page-home-animation', [function(){
        return {
            addClass: function($element, className, _done){
                console.log(className);
                _done();
            }
        };
    }]);