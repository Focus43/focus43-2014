angular.module('f43.common').

    directive('animations', ['$window', 'TweenLite', 'TimelineLite', function($window, TweenLite, TimelineLite){

        function _linkFun( $scope, $element, attrs ){
            var container = $element[0],
                h1        = container.querySelector('h1'),
                spans     = container.querySelectorAll('span'),
                timeline  = new TimelineLite({paused:true});

            TweenLite.set(container, {css:{
                transformPerspective: 400,
                perspective: 400,
                transformStyle: 'preserve-3d'
            }});

            timeline
                //.fromTo(container, 2, {css:{autoAlpha:0}}, {css: {autoAlpha:1}, immediateRender: true});
                .to(h1, 0.5, {css: {z: -500, opacity:0}});

            Array.prototype.slice.call(spans).forEach(function(el, idx){
                timeline.to(el, 0.5, {css: {rotationY:(idx===0 ? -90 : 90), x: (idx===0 ? -500 : 500), opacity:0}}, 0);
            });

//            var level1   = document.querySelector('#animations'),
//                level2   = level1.children[0],
//                nodes    = document.querySelectorAll('.node'),
//                timeline = new TimelineLite({paused:true, onUpdate:function(){
//                    console.log('TIMELINE PROGRESS: ', timeline.progress());
//                }});
//
//            TweenLite.set(level2, {css: {
//                transformPerspective: 400,
//                perspective: 400,
//                transformStyle: 'preserve-3d'
//            }});
//
//            timeline
//                .fromTo(level1, 0.5,
//                    {css: {
//                        autoAlpha: 0
//                    }},
//                    {css: {
//                        autoAlpha: 1
//                    }, immediateRender: true}
//                ).to(level2, 0.3,
//                    {css: {
//                        rotationY: 30, rotationX:20
//                    }}
//            ).add('z', '+=0.2');
//
//
//            Array.prototype.slice.call(nodes).forEach(function(index, node){
//                timeline.to(node, 0.2, {css:{
//                    z: randomize(-500,500)
//                }}, 'z');
//            });
//
//            timeline.to(level2, 2, {css:{rotationY:180,z:-180}, ease:Power2.easeOut}, '+=0.2')
//                .to(level2, 1, {css: {rotationX:180,z:-10}});
//
//            function randomize(min,max){
//                return Math.floor(Math.random() * (1 + max - min) + min);
//            }
//
//
            var contentHeight = document.querySelector('#content').clientHeight,
                windowHeight  = document.body.clientHeight;

            angular.element($window).on('scroll', function(){
                var perc = (this.pageYOffset / (contentHeight - windowHeight));
                console.log(perc);
                timeline.progress(perc);
            });

        }

        return {
            scope: false,
            link: _linkFun
        };
    }]);
