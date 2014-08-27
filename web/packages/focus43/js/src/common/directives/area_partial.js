angular.module('f43.common').

    directive('areaPartial', [function(){

        function _link( scope, $element, attrs ){
            scope.areaHandle = attrs.areaPartial;
        }

        return {
            restrict: 'A',
            scope: true, // **** DO NOT create isolateScope w/ {...} ****
            link: _link,
            controller: ['$scope', 'AppPaths', function( $scope, AppPaths ){
                // Watch for the areaHandle to be set from the link fn
                $scope.$watch('areaHandle', function( _val ){
                    $scope._partial = {
                        path: AppPaths.toolsHandler('angularized') + '?route=' + window.location.pathname + '&area=' + _val
                    };
                });
            }]
        };
    }]);