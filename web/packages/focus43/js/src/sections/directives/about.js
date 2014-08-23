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
    }]).

    /**
     * Animation handler for the page entering/leaving
     */
    animation('.page-about', ['TweenLite', function( TweenLite ){
        return {
            enter: function($element, done){
                TweenLite.fromTo($element, 0.5, {scale:0.8, opacity:0}, {scale:1, opacity:1, onComplete:done});
            },
            leave: function($element, done){
                TweenLite.to($element, 0.5, {scale:0.8, opacity:0, onComplete:done});
            }
        };
    }]);