angular.module('redeaux.pages').

    directive('tplWork', ['TweenLite', '$document', '$animate',
        function( TweenLite, $document, $animate ){

            var ANIMATION_CLASS = 'anim-work';

            function _link( scope, $element ){
                $animate.enter($element[0].parentNode, $element[0].parentNode.parentNode).then(function(){
                    scope.$apply(function(){
                        scope.animClass = ANIMATION_CLASS;
                    });
                });
            }

            return {
                restrict: 'A',
                link: _link
            };
        }
    ]);