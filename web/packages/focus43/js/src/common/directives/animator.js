angular.module('f43.common')

    .directive('animator', ['$window', 'TweenLite', 'TimelineLite',
        function( $window, TweenLite, TimelineLite ){

            var $track      = angular.element(document.querySelector('#track')),
                $sections   = angular.element(document.querySelectorAll('section')),
                $layers     = angular.element(document.querySelectorAll('#parallax .layer')),
                winW, winH, trackH, masterTimeline;


            function buildMasterTimeline(){
                masterTimeline = new TimelineLite({paused:true});

                angular.forEach($sections, function( node, index ){
                    var sectionTimeline = new TimelineLite(),
                        sectionEnter    = new TimelineLite({
                            onComplete: function(){ masterTimeline.pause(); },
                            onStart: function(){ TweenLite.set($layers, {x:-(((index+1)/$sections.length) * winW)}); }
                        }),
                        sectionLeave    = new TimelineLite();

                    sectionTimeline.add(sectionEnter, 'enter');
                    sectionTimeline.add(sectionLeave, 'leave');

                    // Add built timeline onto master
                    masterTimeline.add(sectionTimeline, 'section-' + index);

//                    sectionEnter.fromTo($sections[index], 1, {opacity:0,scale:0.6,rotationZ:-72}, {opacity:1,scale:1,rotationZ:0});
//                    sectionLeave.to($sections[index], 0.5, {rotationZ:180,opacity:0,delay:0.25});
//                    sectionTimeline.add(sectionEnter, 'enter');
//                    sectionTimeline.add(sectionLeave, 'leave');
//                    masterTimeline.add(sectionTimeline, 'section-' + index);
                });

                return masterTimeline;
            }


            function parallaxTo( index ){
//                var _percent = index === 0 ? 0 : (index+1)/$sections.length,
//                    _moveX   = winW * _percent,
//                    _moveY   = index * winH;
//                TweenLite.set($layers, {x:-(_moveX)});
//                TweenLite.to($track, 0.45, {y:-(_moveY), ease: Power2.easeOut});
            }


            function _linker( scope, $element, attrs ){
                winW = document.body.clientWidth;
                winH = document.documentElement.clientHeight;
                trackH = $track[0].clientHeight;
                buildMasterTimeline();

                angular.element($window).on('resize', function(){
//                    winW = document.body.clientWidth;
//                    winH = document.documentElement.clientHeight;
//                    trackH = $track[0].clientHeight;
//                    parallaxTo( angular.element(document.querySelector('nav')).data('$navController').activeIndex() );
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