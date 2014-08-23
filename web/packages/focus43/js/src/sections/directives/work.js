angular.module('f43.sections').

    directive('sectionWork', [function(){

        function _link( scope, $element ){

        }

        return {
            restrict: 'A',
            scope: true,
            link: _link
        };
    }]).

    /**
     * Animation handler for the page entering/leaving
     */
    animation('.page-work', ['TweenLite', function( TweenLite ){
        return {
            enter: function($element, done){
                TweenLite.fromTo($element, 1, {rotation:180, opacity:0}, {rotation:0, opacity:1, delay:1, onComplete: done}, 1);
            },
            leave: function($element, done){
                TweenLite.to($element, 1, {rotation:180, onComplete: done});
            }
        };
    }]);
