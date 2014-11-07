/* global Linear */
/* global Power2 */
/* global SteppedEase */
angular.module('redeaux.pages').

    /**
     * TOJ portfolio directive.
     * @param $document
     * @param $rootScope
     * @param Timeline
     * @param Tween
     * @param PortfolioTimeline
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('portfolioToj', ['$document', '$rootScope', 'Timeline', 'Tween', 'PortfolioTimeline',
        function( $document, $rootScope, Timeline, Tween, PortfolioTimeline ){

            function _link( scope, $element ){
                // set body class
                $rootScope.bodyClasses['fixed-max'] = true;

                var _timeline;

                scope.ready.then(function( _resolved ){
                    _timeline = new PortfolioTimeline({
                        element             : $element[0],
                        scrollTarget        : _resolved[0],
                        $progressContainer  : angular.element($element[0].querySelector('.progress-bar')),
                        $progressBar        : angular.element($element[0].querySelector('.progress-bar > .bar'))
                    });

                    _timeline.build(function( timeline ){
                        var _group1         = this.element.querySelector('.group-1'),
                            _group2         = this.element.querySelector('.group-2'),
                            _intro          = this.element.querySelector('.intro'),
                            _brief          = this.element.querySelector('.brief'),
                            _screens        = this.element.querySelector('.screens'),
                            _screensMobile  = _screens.querySelector('.mobiles'),
                            _screensLarge   = _screens.querySelector('.large-format'),
                            _screensImgs    = _screens.querySelectorAll('img'),
                            _details        = this.element.querySelector('.details'),
                            _video          = this.element.querySelector('.video');

                        timeline.
                            addLabel('intro').

                            to(_intro.querySelector('img'), 2, {rotation:720, autoAlpha:0}).
                            to(_intro.querySelector('.instruct'), 1, {autoAlpha:0}, '-=1').
                            staggerTo(_intro.querySelectorAll('h1 span'), 1.5, {y:100,autoAlpha:0}, 0.5, '-=1.5').
                            to([_group1, _brief, _group2], 2, {y:'-50%'}).
                            addLabel('background').

                            to(_group1.querySelector('.vert-track'), 4, {y:'-100%'}, '+=2').
                            addLabel('brief').

                            to(_group1.querySelector('.vert-track'), 4, {y:'-200%'}, '+=2').
                            staggerTo(_group1.querySelectorAll('.approach h2'), 3.5, {className:'+=striker'}, 1.5).
                            addLabel('approach').

                            to([_group1, _brief, _group2], 2, {y:'-100%'}, '+=1').
                            fromTo(_screensMobile, 2, {y:-700,autoAlpha:0}, {y:0,autoAlpha:1}, '-=1').
                            fromTo(_screensMobile.querySelector('h3'), 1, {y:100,autoAlpha:0}, {y:0,autoAlpha:1}, '-=1.5').
                            add([
                                Tween.to(_screensImgs[0], 3, {x:'-80%',z:3}),
                                Tween.to(_screensImgs[1], 3, {y:'-56%',z:2}),
                                Tween.to(_screensImgs[2], 3, {x:'-20%',y:'-53%',z:1}),
                            ]).
                            addLabel('mobiles').

                            to(_screensMobile, 4, {x:'-100%', autoAlpha:0}, '+=2').
                            to(_screensLarge, 3, {x:'-100%', ease:Power2.easeOut}, '-=4').
                            fromTo(_screensLarge.querySelector('h3'), 2, {y:100,autoAlpha:0}, {y:0,autoAlpha:1}).
                            addLabel('larges').

                            add([
                                Tween.to(_group2, 3, {y:'-200%'}),
                                Tween.fromTo(_details.querySelector('.background'), 8, {scale:1.4, rotation:5}, {scale:1, rotation:0})
                            ], '+=2').
                            staggerFromTo(_details.querySelectorAll('.design p'), 2, {y:50,autoAlpha:0}, {y:0,autoAlpha:1}, 1, '-=6').
                            addLabel('design').

                            add([
                                Tween.to(_details.querySelector('.background'), 4, {scale:1.4, rotation:-5}),
                                Tween.to(_details.querySelector('.design'), 2, {x:'-100%'}),
                                Tween.to(_details.querySelector('.tech'), 2, {x:'100%'})
                            ]).
                            staggerFromTo(_details.querySelectorAll('.tech p'), 4, {y:50,autoAlpha:0}, {y:0,autoAlpha:1}, 2, '-=1').
                            addLabel('tech').

                            fromTo(_video, 3, {scale:2,autoAlpha:0,y:'-100%'}, {scale:1,autoAlpha:1}, '+=2').
                            addLabel('final');
                    });
                });

                scope.$on('$destroy', function(){
                    $rootScope.bodyClasses['fixed-max'] = false;
                    if( angular.isObject(_timeline) ){
                        _timeline.destroy();
                    }
                });
            }

            return {
                restrict: 'A',
                link: _link,
                scope: true,
                controller: ['$scope', '$q', 'Preloader', 'Utilities',
                    function( $scope, $q, Preloader, Utilities ){
                        $scope.ready = $q.all([
                            Utilities.determineBodyScrollElement(),
                            Preloader.promise()
                        ]);

                    }
                ]
            };
        }
    ]);