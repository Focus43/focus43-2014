angular.module('redeaux.pages').

    /**
     * @description Template handler
     * @param $document
     * @param $animate
     * @param TweenLite
     * @param ApplicationPaths
     * @param Breakpoints
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('tplAbout', ['$document', '$animate', 'TweenLite', 'Breakpoints',
        function( $document, $animate, TweenLite, Breakpoints ){

            var ANIMATION_CLASS = 'anim-about';

            /**
             * Directive linker.
             * @param scope
             * @param $element
             * @private
             */
            function _link( scope, $element ){
                // Trigger addClass animations
                $animate.enter($element[0].parentNode, $element[0].parentNode.parentNode).then(function(){
                    scope.$apply(function(){
                        scope.animClass = ANIMATION_CLASS;
                    });
                });

                // On window resize event callback, to adjust instagram include
                function onWindowResize(){
                    scope.$apply(function(){
                        scope.gramCount = (window.innerWidth <= Breakpoints.lg) ? 9 : 16;
                    });
                }

                // Bind to window resize event
                angular.element(window).on('resize', onWindowResize);

                // On nav to different page, destroy window resize watcher
                scope.$on('$destroy', function(){
                    angular.element(window).off('resize', onWindowResize);
                });
            }

            return {
                restrict: 'A',
                link: _link,
                scope: true,
                controller: ['$scope', '$http', 'ApplicationPaths', 'Breakpoints', function( $scope, $http, ApplicationPaths, Breakpoints ){
                    $scope.gramCount = (window.innerWidth <= Breakpoints.lg) ? 9 : 16;

                    $http.get(ApplicationPaths.tools + 'instagram/json').then(function(resp){
                        if( resp.status >= 200 && resp.status <= 300 ){
                            $scope.instagramList = resp.data;
                        }
                    });

                }]
            };
        }
    ]).

    /**
     * @description Animation handler
     * @returns {{addClass: Function}}
     */
    animation('.anim-about', [function(){
        return {
            addClass: function(el, className, done){
                console.log('about_view_ready');
                done();
            }
        };
    }]);