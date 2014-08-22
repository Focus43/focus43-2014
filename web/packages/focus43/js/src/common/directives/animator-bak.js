angular.module('f43.common')

    .directive('animator-bak', ['$window', 'TweenLite', 'TimelineMax',
        function( $window, TweenLite, TimelineMax ){

            var $track      = angular.element(document.querySelector('#track')),
                $sections   = angular.element(document.querySelectorAll('section')),
                $layers     = angular.element(document.querySelectorAll('#parallax .layer'));
                //winW, winH, trackH,
                //masterTimeline = new TimelineLite({paused:true});


//            function sectionTimeline( _index ){
//                var tl    = new TimelineLite({data:{index:_index}}),
//                    enter = new TimelineLite({
//                        onComplete: function(){ masterTimeline.pause(); },
//                        onStart: function(){ TweenLite.set($layers, {x:-(((_index+1)/$sections.length) * winW)}); }
//                    }),
//                    leave = new TimelineLite();
//                tl.add(enter, 'enter');
//                tl.add(leave, 'leave');
//                return tl;
//            }


//            function buildMasterTimeline(){
//                if( ! angular.isObject(masterTimeline) ){
//                    masterTimeline = new TimelineLite({paused:true});
//
//                    angular.forEach($sections, function( node, index ){
//                        var sectionTimeline = new TimelineLite({data:{index:index}}),
//                            sectionEnter    = new TimelineLite({
//                                onComplete: function(){ masterTimeline.pause(); },
//                                onStart: function(){ TweenLite.set($layers, {x:-(((index+1)/$sections.length) * winW)}); }
//                            }),
//                            sectionLeave    = new TimelineLite();
//
//                        sectionTimeline.add(sectionEnter, 'enter');
//                        sectionTimeline.add(sectionLeave, 'leave');
//
//                        angular.element(node).data('timeline', sectionTimeline);
//                    });
//
//                    $window['tl'] = masterTimeline;
//                }
//
//                return masterTimeline;
//            }


            function parallaxTo( index ){
                console.log(index);
//                var _percent = index === 0 ? 0 : (index+1)/$sections.length,
//                    _moveX   = winW * _percent,
//                    _moveY   = index * winH;
//                TweenLite.set($layers, {x:-(_moveX)});
//                TweenLite.to($track, 0.45, {y:-(_moveY), ease: Power2.easeOut});
            }


            function _linker( scope, $element, attrs ){
//                winW = document.body.clientWidth;
//                winH = document.documentElement.clientHeight;
//                trackH = $track[0].clientHeight;

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
                    $scope.timelineMaster = new TimelineMax({paused:true, smoothChildTiming:true});
                    $window['tl'] = $scope.timelineMaster;

                    // Publicly accessible method of the controller
                    this.parallaxTo = parallaxTo;

                    this._timeline = $scope.timelineMaster;

                    // Master timeline
                    //this._timeline = buildMasterTimeline();

//                    this.addSectionTimeline = function( $element, _callback ){
//                        var index     = Array.prototype.indexOf.call(document.querySelectorAll('section'), $element[0]),
//                            sectionTl = _callback.apply(undefined, [index]);
//                        masterTimeline.add(sectionTl, 'section-' + index);
//                    };

                }]
            };
        }
    ]);