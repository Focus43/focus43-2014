angular.module('redeaux.pages').

    /**
     * @description Template handler
     * @param $animate
     * @returns {{restrict: string, link: Function}}
     */
    directive('tplWork', [
        function(){

            /**
             * @param scope
             * @param $element
             * @private
             */
            function _link( scope, $element ){
//                var t = 150, i = 1;
//                angular.forEach($element[0].querySelectorAll('[data-bg]'), function( node ){
//                    node.style.backgroundImage = 'url('+node.getAttribute('data-bg')+')';
//                    setTimeout(function(){
//                        node.removeAttribute('data-bg');
//                    }, (t * i));
//                    i++;
//                });
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
    ]);