angular.module('redeaux.pages').

    directive('tplHome', ['TweenLite', '$document',
        function( TweenLite, $document ){

            function _link( scope, $element ){
                var $bgPrlx = angular.element(document.querySelector('#parallax'));

                // Initialize the background parallax layer
                if( angular.isDefined($bgPrlx.data('$scope')) ){
                    $bgPrlx.data('$scope').handler.init();
                }

                // Destruct on removal
                scope.$on('$destroy', function(){
                    if( angular.isDefined($bgPrlx.data('$scope')) ){
                        $bgPrlx.data('$scope').handler.destroy();
                    }
                });
            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);