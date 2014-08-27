angular.module('f43.sections').

    directive('sectionDefault', [function(){

        function _link( scope, $element ){

        }

        return {
            restrict: 'A',
            scope: true,
            link: _link,
            controller: ['$scope', '$route', '$http', function( $scope, $route, $http ){
                //$scope.pageContent = $route.params.section + '/' + $route.params.dynamic;
                //$scope.pageContent = 'some/route/to/something';

//                $http.get('/tools/packages/focus43/angularized', {
//                    params: {
//                        route: $route.current.params.section + '/' + $route.current.params.dynamic
//                    }
//                }).then(function( resp ){
//                    console.log(resp);
//                });
            }]
        };
    }]);