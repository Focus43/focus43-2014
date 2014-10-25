angular.module('redeaux.pages').

    /**
     * @description Template handler
     * @param $animate
     * @returns {{restrict: string, link: Function}}
     */
    directive('tplWork', ['$animate',
        function( $animate ){

            var ANIMATION_CLASS = 'anim-work';

            /**
             * @param scope
             * @param $element
             * @private
             */
            function _link( scope, $element ){
                $animate.enter($element[0].parentNode, $element[0].parentNode.parentNode).then(function(){
                    scope.$apply(function(){
                        scope.animClass = ANIMATION_CLASS;
                    });
                });

                angular.forEach($element[0].querySelectorAll('[data-bg]'), function( node ){
                    node.style.backgroundImage = 'url('+node.getAttribute('data-bg')+')';
                });
            }

            return {
                restrict: 'A',
                link: _link,
                controller: ['$scope', '$route', 'ApplicationPaths',
                    function( $scope, $route, ApplicationPaths ){
//                        $scope._route = $route;
//
//                        $scope.$watch('_route.current.params', function( params ){
//                            if( angular.isDefined(params.project) ){
//                                $scope._include = ApplicationPaths.tools + 'work/' + params.project;
//                            }
//                        });
                    }
                ]
            };
        }
    ]).


    /**
     * @description Animation handler
     * @returns {{addClass: Function}}
     */
    animation('.anim-work', [function(){
        return {
            addClass: function(el, className, done){
                console.log('work_view_ready');
                done();
            }
        };
    }]);