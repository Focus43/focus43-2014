/* global Power2 */
angular.module('redeaux.pages').

    directive('portfolioToj', ['$window', '$document', 'TimelineLite', 'TweenLite',
        function( $window, $document, TimelineLite, TweenLite ){

            function _link( scope, $element ){

                var element         = $element[0],
                    scrollPercent   = 0,
                    smoothWheelTime = 0.6,
                    smoothWheelDist = 50,
                    masterTimeline  = new TimelineLite({paused:true});

                function onScroll(){
                    scrollPercent = element.scrollTop / (element.scrollHeight - element.clientHeight);
                }


                // Smooth scrolling: http://blog.bassta.bg/2013/05/smooth-page-scrolling-with-tweenmax/
                function onWheel(event){
                    event.preventDefault();
                    var delta       = event.wheelDelta/120 || -(event.detail/3),
                        scrolled    = element.scrollTop,
                        scrollCalc  = scrolled - parseInt(delta * smoothWheelDist);

                    TweenLite.to(element, smoothWheelTime, {
                        scrollTo: {y:scrollCalc, autoKill:true},
                        ease: Power2.easeOut,
                        overwrite: 5,
                        onUpdate: function(){
                            //console.log(element.scrollTop);
                        }
                    });
                }


                function animationLoop(){
                    //console.log(scrollPercent);
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
                $element.on('scroll', onScroll);
                $element.on('mousewheel DOMMouseScroll', onWheel);
                TweenLite.ticker.addEventListener('tick', animationLoop);

                // Straight MURDA MURDA animation loop. Kapow.
                scope.$on('$destroy', function(){
                    $element.off('scroll', onScroll);
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