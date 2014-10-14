/* global Power2 */
angular.module('redeaux.pages').

    directive('portfolioToj', ['$window', '$document', 'TimelineLite', 'TweenLite',
        function( $window, $document, TimelineLite, TweenLite ){

            function _link( scope, $element ){

                var element         = $element[0],
                    scrollPercent   = 0,
                    smoothWheelTime = 0.6,
                    smoothWheelDist = 50,
                    masterTimeline  = new TimelineLite({paused:true, useFrames:false});

                // selectors
                var track  = document.querySelector('.track'),
                    images = document.querySelectorAll('[portfolio-toj] img'),
                    _fixed = document.querySelector('.pseudo-fixed');

                masterTimeline.
                    to(document.querySelector('h1'), 3, {y:-2000}).
                    fromTo(images[0], 2, {y:0, x:500}, {y:'-100%', x:0}).
                    to(images[0], 5, {rotationZ:6,rotationY:20,y:-150,x:0}).
                    to(images[0], 1, {rotationY:55,rotationX:-40,autoAlpha:0}).
                    to(images[1], 3, {y:'-200%'}, '-=2');

//                masterTimeline.
//                    to(images[0], 3, {rotationX:45,rotationZ:50,scale:1.8}).
//                    to(images[0], 1, {x:800}).
//                    to(images[1], 1, {y:-650}, '-=1').
//                    //delay(10).play().
//                    to(images[1], 1, {autoAlpha:0, scale:0.8, delay:7});


                // Smooth scrolling: http://blog.bassta.bg/2013/05/smooth-page-scrolling-with-tweenmax/
                function onWheel(event){
                    event.preventDefault();

                    var delta       = event.wheelDelta/120 || -(event.detail/3),
                        scrolled    = element.scrollTop,
                        scrollCalc  = scrolled - parseInt(delta * smoothWheelDist);

                    TweenLite.to(element, smoothWheelTime, {
                        scrollTo: {y:scrollCalc, autoKill:true},
                        ease: Power2.easeOut,
                        overwrite: 5
                    });
                }


                function animationLoop(){
                    _fixed.style.top = element.scrollTop + 'px';
                    //track.style.top  = -(element.scrollTop) + 'px';
                    scrollPercent = element.scrollTop / (element.scrollHeight - element.clientHeight);
                    masterTimeline.progress(scrollPercent);
                }




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




                // Kickoff events n' shit
                $element.on('mousewheel DOMMouseScroll', onWheel);
                TweenLite.ticker.addEventListener('tick', animationLoop);

                // Straight MURDA MURDA animation loop. Kapow.
                scope.$on('$destroy', function(){
                    $element.off('mousewheel DOMMouseScroll', onWheel);
                    TweenLite.ticker.removeEventListener('tick', animationLoop);
                });
            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);