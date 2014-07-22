angular.module('f43.common').

    directive('animations', ['$window', 'TweenLite', 'TimelineLite', function($window, TweenLite, TimelineLite){

        function _linkFun( $scope, $element, attrs ){
            var _container      = document.querySelector('#content'),
                _home           = document.querySelector('#section-home'),
                _about          = document.querySelector('#section-about'),
                _work           = document.querySelector('#section-work'),
                _experiments    = document.querySelector('#section-experiments'),
                _contact        = document.querySelector('#section-contact'),
                timeline        = new TimelineLite({paused:true});

            TweenLite.set([_container, document.querySelector('#stacked')], {css:{
                transformPerspective: 400,
                perspective: 400,
                transformStyle: 'preserve-3d'
            }});

            //timeline
//                .to(_home, 0, {top:0})
//                .to(_about, 1, {top:document.body.clientHeight})
//                .to(_work, 1, {top:document.body.clientHeight*2})
//                .to(_experiments, 1, {top:document.body.clientHeight*3})
//                .to(_contact, 1, {top:document.body.clientHeight*4});

            var timelineHome = new TimelineLite();
            timelineHome
                .to(document.querySelector('#stacked h1'), 1, {x:-500});

            var timelineAbout = new TimelineLite();
            timelineAbout
                .to(_about, 1, {top:document.body.clientHeight});

            timeline
                .add(timelineHome)
                .add(timelineAbout)
                .to(_work, 1, {top:document.body.clientHeight*2})
                .to(_experiments, 1, {top:document.body.clientHeight*3})
                .to(_contact, 1, {top:document.body.clientHeight*4});


//            var container = $element[0],
//                h1        = container.querySelector('h1'),
//                spans     = container.querySelectorAll('span'),
//                timeline  = new TimelineLite({paused:true});
//
//            TweenLite.set(container, {css:{
//                transformPerspective: 400,
//                perspective: 400,
//                transformStyle: 'preserve-3d'
//            }});
//
//            timeline
//                .to(h1, 0.5, {css: {z: -500, opacity:0}});
//
//            Array.prototype.slice.call(spans).forEach(function(el, idx){
//                timeline.to(el, 0.5, {css: {rotationY:(idx===0 ? -90 : 90), x: (idx===0 ? -500 : 500), opacity:0}}, 0);
//            });

            var contentHeight = document.querySelector('#content').clientHeight,
                windowHeight  = document.body.clientHeight;
            angular.element($window).on('scroll', function(){
                var perc = (this.pageYOffset / (contentHeight - windowHeight));
                timeline.progress(perc);
            });

        }

        return {
            scope: false,
            link: _linkFun
        };
    }]);
