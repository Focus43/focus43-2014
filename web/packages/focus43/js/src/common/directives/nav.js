angular.module('f43.common').

    /**
     * @sets $rootScope.sidebar
     */
    directive('nav', ['$rootScope', function factory( $rootScope ){

        function _link( scope, $element, attrs, AnimatorController ){

            // Elements
            var $trigger    = angular.element($element[0].querySelector('.trigger')),
                $listItems  = angular.element($element[0].querySelectorAll('li')),
                $track      = angular.element(document.querySelector('#content-l2'));

            // Click handler on the nav
            $trigger.on('click', function(){
                scope.$apply(function(){
                    scope.status.open = !scope.status.open;
                });
            });

            scope.$watch('status.open', function( status ){
                // Set sidebar status on the rootScope
                $rootScope.sidebar = status;

                // If sidebar is open, bind a one-time click listener on the track when its masked
                if( status === true ){
                    $track.one('click', function(){
                        scope.$apply(function(){
                            scope.status.open = false;
                        });
                    });
                }
            });

            // Route change (handles setting current route to active and closing sidebar)
            scope.$on('$routeChangeStart', function( event, current ){
                var href    = current && angular.isDefined(current.params.section) ? '/' + current.params.section : '/',
                    element = $element[0].querySelector('[href="'+href+'"]');

                // @todo: implement fallback
                if( ! element ){
                    return;
                }

                var index = Array.prototype.indexOf.call($listItems, element.parentNode); //_active ? Array.prototype.indexOf.call($listItems, _active.parentNode) : 0;
                // Change active class
                $listItems.removeClass('active').eq(index).addClass('active');
                // Trigger parallax background
                AnimatorController.parallaxTo(index);
                // Close the nav sidebar (if was open)
                scope.status.open = false;
            });
        }

        return {
            restrict: 'E',
            link: _link,
            scope: true,
            require: '^animator',
            controller: ['$scope', function( $scope ){
                // Initialize scope (nav) status as open = false
                $scope.status = {
                    open: false
                };

                // Publicly accessible methods on the controller
                this.toggle = function(){
                    $scope.$apply(function(){
                        $scope.status.open = !$scope.status.open;
                    });
                };
            }]
        };
    }]);