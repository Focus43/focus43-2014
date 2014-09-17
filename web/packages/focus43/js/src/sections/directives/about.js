/* global Power2 */

angular.module('f43.sections').

    directive('sectionAbout', [function(){

        function _link( scope, $element ){

        }

        return {
            restrict: 'A',
            scope: true,
            link: _link
        };
    }]);
