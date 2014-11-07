/* global $script */
angular.module('redeaux.common').

    directive('lazyCompile', ['$http', '$compile', function factory( $http, $compile ){

        function _link( scope, $element, attrs ){
            //$http.get(attrs.lazyCompile);
            $script('/packages/redeaux/js/test.js', function(){
                $compile($element.contents())(scope);
                scope.lazily.resolve();
            });

        }


        return {
            restrict: 'A',
            link: _link,
            scope: true,
            controller: ['$scope', '$q', function( $scope, $q ){
                $scope.lazily = $q.defer();
                this.promise  = $scope.lazily.promise;
            }]
        };
    }]);