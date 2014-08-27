angular.module('f43.common').

    directive('animator', ['$window', 'TweenLite', function factory( $window, TweenLite ){

        var pageCount = document.querySelectorAll('nav li').length,
            $layers   = document.querySelectorAll('#parallax .layer'),
            winW      = document.body.clientWidth;

        function updateLayers( _index ){
            var _percent = (_index === 0) ? 0 : (_index+1)/pageCount,
                _moveX   = winW * _percent;
            TweenLite.set($layers, {x:-(_moveX)});
        }

        function _link( scope ){
            // If window gets resized, reset the winW
            angular.element($window).on('resize', function(){
                winW = document.body.clientWidth;
                updateLayers(scope.parallaxIndex);
            });

            // Watch for changes to the parallaxIndex
            scope.$watch('parallaxIndex', function( _index ){
                if( angular.isDefined(_index) ){
                    updateLayers(_index);
                }
            });
        }

        return {
            restrict: 'A',
            link: _link,
            controller: ['$scope', function( $scope ){
                this.parallaxTo = function( _index ){
                    $scope.parallaxIndex = _index;
                };
            }]
        };
    }]);