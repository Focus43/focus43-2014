angular.module('f43.common').

    directive('preloader', ['$window', '$q', 'TweenLite', function factory( $window, $q, TweenLite ){

        function getImagePromises( $element ){
            var promises = [],
                images   = Array.prototype.slice.call($element[0].querySelectorAll('img'));

            images.forEach(function( imgNode ){
                var defer       = $q.defer(),
                    synthImage  = new Image();
                synthImage.onload = function(){
                    defer.resolve();
                };
                synthImage.src = imgNode.getAttribute('src');
                promises.push( defer.promise );
            });

            return promises;
        }

        function _link( scope, $element, attrs ){
//            scope.$watch('preloading', function( status ){
//                if( status === true ){
//                    var promises = getImagePromises( $element );
//                    $q.all(promises).then(function(){
//                        console.log('all resolved!');
//                    });
//                }
//                scope.preloading = false;
//            });
        }

        return {
            restrict: 'A',
            link: _link,
            controller: ['$scope', function( $scope ){
                $scope.preloading = false;

                $scope.$on('$viewContentLoaded', function(){
                    $scope.preloading = true;
                });
            }]
        };
    }]);