angular.module('redeaux.common').

    /**
     * @description Shared service for managing navigation state.
     * @returns {{open: boolean, working: boolean}}
     */
    factory('NavState', [function(){
        return {
            open: false,
            working: false
        };
    }]).

    /**
     * @description Nav element directive handler
     * @returns {{restrict: string, link: Function, scope: boolean, controller: Array}}
     */
    directive('nav', [function factory(){

        /**
         * @param scope
         * @param $element
         * @private
         */
        function _link( scope, $element ){
            var $trigger  = angular.element($element[0].querySelector('.trigger')),
                $level2   = angular.element(document.querySelector('#level-2'));

            $trigger.on('click', function(){
                scope.$apply(function(){
                    scope.navState.open = !scope.navState.open;
                });
            });

            scope.$watch('navState.open', function( _state ){
                // If sidebar is open, bind a one-time click listener on the track when its masked
                if( _state === true ){
                    $level2.one('click', function(){
                        scope.$apply(function(){
                            scope.navState.open = false;
                        });
                    });
                }
            });
        }

        return {
            restrict: 'E',
            link: _link,
            scope: true,
            /**
             * @param $rootScope
             * @param $scope
             * @param NavState
             */
            controller: ['$rootScope', '$scope', 'NavState',
                function( $rootScope, $scope, NavState ){
                    $scope.navState = NavState;

                    // Public method for toggling navigation open/closed
                    this.toggleSidebar = function(){
                        $scope.$apply(function(){
                            $scope.navState.open = !$scope.navState.open;
                        });
                    };

                    // Public method for toggling "working" spinner
                    this.toggleWorking = function(){
                        $scope.$apply(function(){
                            $scope.navState.working = !$scope.navState.working;
                        });
                    };

                    // Listen for route change and close nav if happens
                    $rootScope.$on('$routeChangeStart', function(){
                        $scope.navState.open = false;
                    });
                }
            ]
        };
    }]);