angular.module('redeaux.common').

    controller('CtrlRoot', ['$rootScope', '$scope', '$location', 'NavState',
        function( $rootScope, $scope, $location, NavState ){
            // Because SVG clip-paths reference the doc internally, and we HAVE to set
            // a <base /> tag for angular's router, we need to add the absolute URL in
            // the paths referenced by SVGs
            $rootScope.$on('$routeChangeSuccess', function(){
                $scope.absUrl = $location.absUrl();
            });
        }
    ]);