angular.module('redeaux.common').

    /**
     * @description Generic body controller
     * @param $rootScope
     * @param $scope
     * @param $location
     */
    controller('CtrlRoot', ['$rootScope', '$scope', '$location',
        function( $rootScope, $scope, $location ){
            // Because SVG clip-paths reference the doc internally, and we HAVE to set
            // a <base /> tag for angular's router, we need to add the absolute URL in
            // the paths referenced by SVGs
            $rootScope.$on('$routeChangeSuccess', function(){
                $scope.absUrl = $location.absUrl();
            });

            // Available transition classes
            var _transitions = ['trnztn-1', 'trnztn-2', 'trnztn-3', 'trnztn-4', 'trnztn-5'];

            // When ng-view changes, set a new transition class
            $rootScope.$on('$viewContentLoaded', function(){
                console.log('-- content loaded --');
                $scope.transitionClass = _transitions[Math.floor(Math.random() * _transitions.length)];
            });
        }
    ]);