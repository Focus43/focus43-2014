angular.module('f43.sections').

    directive('sectionHome', [function(){

        function _link( scope, $element ){

        }

        return {
            restrict: 'A',
            scope: true,
            link: _link
        };
    }]);//.

    /**
     * Animation handler for the page entering/leaving
     */
//    animation('.page-home', ['ViewHelper', function( ViewHelper ){
//        return {
//            enter: function($element, _done){
//                ViewHelper.whenReady.enter(_done, function( timeline ){
//                    timeline.fromTo($element, 0.75, {x:'200%', autoAlpha:0}, {x:0, autoAlpha:1});
//                });
//            },
//            leave: function($element, _done){
//                ViewHelper.whenReady.leave(_done, function( timeline ){
//                    timeline.to($element, 0.45, {scale:1.5, rotationZ:180, autoAlpha:0, ease:Power2.easeOut});
//                });
//            }
//        };
//    }]);