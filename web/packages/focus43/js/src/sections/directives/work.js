angular.module('f43.sections').

    directive('sectionWork', [function(){

        function _link( scope, $element ){

        }

        return {
            restrict: 'A',
            scope: true,
            link: _link
        };
    }]);
