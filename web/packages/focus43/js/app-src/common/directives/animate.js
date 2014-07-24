/* global requestAnimationFrame */

angular.module('f43.common')

    .directive('animate', ['$window', 'TweenLite', 'TimelineLite',
        function( $window, TweenLite, TimelineLite ){

            var elTrack         = document.querySelector('#track'),
                parallaxLayers  = document.querySelectorAll('#parallax .layer'),
                sections        = document.querySelectorAll('section'),
                timelineMaster  = new TimelineLite({paused:true}),
                winH, winW, trackH, trackW;

            function processDimensions(){
                winH = document.documentElement.clientHeight;
                winW = document.body.clientWidth;
                trackH = elTrack.clientHeight;
                trackW = winW;
            }

            function random(min, max){
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }


            /**
             * @returns TimelineLite
             */
            function timelineSection1(){
                var _timeline = (new TimelineLite()).
                    to(elTrack, 0, {y:0, ease:Power2.easeIn, roundProps:"y"}, 0);
                    //staggerTo(sections[0].querySelectorAll('h1 span'), 0.15, {scale:random(2,3), opacity:0}, 0.05);

                return _timeline;
            }

            /**
             * @returns TimelineLite
             */
            function timelineSection2(){
                TweenLite.set(sections[1].querySelector('.inside-track'), {
                    transformOrigin:'50% 100%'
                });

                var _timeline = (new TimelineLite()).
                    to(elTrack, 1, {y:-(winH), ease:Power2.easeIn, roundProps:"y"}, 0).
                    fromTo(sections[1].querySelector('.pane'), 1, {top:'100%'}, {top:0}).
                    to(sections[1].querySelector('.node:nth-child(1)'), 0.5, {opacity:1, backgroundColor:'rgba(255,255,255,0.5)'}).
                    to(sections[1].querySelector('.inside-track'), 2, {left:'-=100%', delay:1}).
                    to(sections[1].querySelector('.node:nth-child(1)'), 0.5, {opacity:0}).
                    to(sections[1].querySelector('.node:nth-child(2)'), 0.5, {opacity:1, backgroundColor:'rgba(15,15,79,0.8)'}, '-=0.5').
                    to(sections[1].querySelector('.inside-track'), 2, {left:'-=100%'}).
                    to(sections[1], 1, {rotationX:20, rotationY:20, scale:0.7}).
                    to(sections[1].querySelector('.subscroller'), 1, {z: 10}).
                    to(sections[1].querySelector('.inside-track'), 1, {z: 50, rotationX: 90});


                return _timeline;
            }

            function timelineSection3(){
                var _timeline = (new TimelineLite()).
                    to(elTrack, 1, {y:-(winH*2), ease:Power2.easeIn, roundProps:"y"}, 0).
                    fromTo(sections[2].querySelector('.rotated'), 2, {left:'-100%'}, {left:0, ease:Power2.easeInOut});

                return _timeline;
            }

            function timelineSection4(){
                var _timeline = (new TimelineLite())
                    .to(elTrack, 1, {y:-(winH*3), ease:Power2.easeIn, roundProps:"y"}, 0);
                return _timeline;
            }

            function timelineSection5(){
                var _timeline = (new TimelineLite())
                    .to(elTrack, 1, {y:-(winH*4), ease:Power2.easeIn, roundProps:"y"}, 0);
                return _timeline;
            }

            function buildTimelines(){
                // Nest the timelines into the master
                timelineMaster
                    .add(timelineSection1(), 'section1')
                    .add(timelineSection2(), 'section2')
                    .add(timelineSection3(), 'section3')
                    .add(timelineSection4(), 'section4')
                    .add(timelineSection5(), 'section5');

                $window['tlMaster'] = timelineMaster;
            }

            function _linkFn( scope, $element, attrs, Controller ){
                processDimensions();
                buildTimelines();

                (function draw(){
                    Controller.progressTo(window.scrollY);
                    requestAnimationFrame(draw);
                })();


//                Draggable.create(elTrack, {
//                    type:'scrollTop',
//                    throwProps:true,
//                    edgeResistance: 0.85,
//                    onThrowUpdate: function(){
//                        console.log(this);
//                    }
//                });


//                angular.element($window)
//                    // "onWindowScroll"
//                    .on('scroll', function(){
//                        // Set the background parallax position independently
//                        Controller.progressTo(this.pageYOffset);
//                    })
//                    // "onWindowResize"
//                    .on('resize', processDimensions);
            }

            return {
                restrict: 'A',
                scope:    false,
                link:     _linkFn,
                controller: ['$rootScope', '$q', function( $rootScope, $q ){

                    var self = this;

                    /**
                     * Call this method to set the progress to a certain point; modifies
                     * the parallax backgrounds then the timelineMaster independently.
                     * @param int verticalOffset
                     */
                    self.progressTo = function( verticalOffset ){
                        var _scroll = (verticalOffset / (trackH - winH)),
                            _moveX  = _scroll * winW;
                        //console.log(verticalOffset);
                        //TweenLite.set(parallaxLayers, {x:-_moveX});
                        timelineMaster.progress(_scroll);
                    };

                }]
            };
        }
    ]);