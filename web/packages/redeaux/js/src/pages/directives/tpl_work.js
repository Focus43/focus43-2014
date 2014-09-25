angular.module('redeaux.pages').

    directive('tplWork', ['TweenLite', '$document',
        function( TweenLite, $document ){

            function _link( scope, $element ){

            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);