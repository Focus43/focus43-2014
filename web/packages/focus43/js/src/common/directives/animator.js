angular.module('f43.common')

    .directive('animator', ['$window', '$animate',
        function( $window, $animate ){

            var $track      = angular.element(document.querySelector('#track')),
                $sections   = angular.element(document.querySelectorAll('section')),
                $layers     = angular.element(document.querySelectorAll('#parallax .layer'));


            function _linker( scope, $element, attrs ){
                scope.$watch('sectionIndex', function( _index, _prevIndex ){
                    $animate.removeClass($sections[_prevIndex], 'section-active');
                    $animate.addClass($sections[_index], 'section-active');
                });
            }


            return {
                restrict: 'A',
                scope: true,
                link: _linker,
                controller: ['$scope', function( $scope ){
                    // Publicly accessible method of the controller
                    this.parallaxTo = function( index ){
                        $scope.sectionIndex = index;
                    };
                }]
            };
        }
    ]).

    animation('.section-active', function(){
        return {
            addClass: function( $element, className, done ){
                if( $element.data('timeline') ){
                    $element.data('timeline').tweenFromTo(0, 'enter');
                }
            },
            removeClass: function( $element, className, done ){
                if( $element.data('timeline') ){
                    $element.data('timeline').tweenFromTo('enter', 'leave');
                }
            }
        };
    });