angular.module('redeaux.pages').

    directive('tplExperiments', ['TweenLite', '$document', '$animate',
        function( TweenLite, $document, $animate ){

            var ANIMATION_CLASS = 'anim-experiments';

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