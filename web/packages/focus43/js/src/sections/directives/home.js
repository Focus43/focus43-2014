angular.module('f43.sections').

    directive('sectionHome', ['$document', 'TweenLite', 'TimelineMax', function( $document, TweenLite, TimelineLite ){

        function _link( scope, $element ){
            var $wrap = document.querySelector('#logolax'),
                $z4 = document.querySelector('#z4'),
                $z3 = document.querySelector('#z3'),
                $z2 = document.querySelector('#z2'),
                $z1   = document.querySelector('#z1'),
                winW  = document.body.clientWidth,
                winH  = document.body.clientHeight,
                halfWidth  = winW / 2,
                halfHeight = winH / 2;

            var $all = [$z4,$z3,$z2,$z1];

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

            var _coords;

            angular.element($document).on('mousemove', function( ev ){
                _coords = {x:ev.pageX, y:ev.pageY};
            });

            setInterval(function(){
                if( _coords ){
                    var _x = (halfWidth - _coords.x) / winW,
                        _y = (halfHeight - _coords.y) / winH;
                    TweenLite.set($z4, {x:-(290*_x),y:-(290*_y),scale:(1 + (1 * _y))});
                    TweenLite.set($z3, {x:-(50*_x),y:-(50*_y),scale:(1 + (1 * _y))});
                    TweenLite.set($z2, {x:(250*_x),y:(500*_y),scale:(1 + (1 * _y))});
                    TweenLite.set($z1, {x:(1200*_x),y:(1200*_y),scale:(1 + (1 * _y))});
                }
            }, 50);
        }

        return {
            restrict: 'A',
            scope: true,
            link: _link
        };
    }]).

    animation('.page-home', [function(){
        return {
            addClass: function($element, className, done){
                console.log('added' + className /*$element[0].innerHTML*/);
            }
        };
    }]);

    /**
     * Animation handler for the page entering/leaving
     */
//    animation('.page-home', ['ViewHelper', function( ViewHelper ){
//        return {
//            enter: function($element, _done){
//                ViewHelper.whenReady.enter(_done, function( timeline ){
//                    timeline.fromTo($element, 0.75, {x:'200%', autoAlpha:0}, {x:0, autoAlpha:1});
//                });
//            },
//            leave: function($element, _done){
//                ViewHelper.whenReady.leave(_done, function( timeline ){
//                    timeline.to($element, 0.45, {scale:1.5, rotationZ:180, autoAlpha:0, ease:Power2.easeOut});
//                });
//            }
//        };
//    }]);