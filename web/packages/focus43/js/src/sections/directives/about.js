/* global Power2 */

angular.module('f43.sections').

    directive('sectionAbout', ['$animate', 'TimelineLite', function( $animate, TimelineLite ){

        function _linker( scope, $element, attrs ){

        }

        return {
            restrict: 'C',
            scope:    true,
            link:     _linker,
            controller: ['$scope', function( $scope ){

            }]
        };
    }]);