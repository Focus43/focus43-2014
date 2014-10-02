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
    directive('tplAbout', ['$document', '$animate', 'TweenLite', 'ApplicationPaths', 'Breakpoints',
        function( $document, $animate, TweenLite, ApplicationPaths, Breakpoints ){

            var ANIMATION_CLASS     = 'anim-about',
                INSTAGRAM_INCLUDE   = ApplicationPaths.tools + 'instagram/client';


            /**
             * @param injectedURI
             * @returns {string}
             * @private
             */
            function _getInstagramInclude( injectedURI ){
                return injectedURI + '?count=' + ((window.innerWidth <= Breakpoints.lg) ? 9 : 16);
            }


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
                        scope._instagram = _getInstagramInclude(INSTAGRAM_INCLUDE);
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
                controller: ['$scope', function( $scope ){
                    // Immediately set instagram value on scope
                    $scope._instagram = _getInstagramInclude(INSTAGRAM_INCLUDE);
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