angular.module('f43.sections').

    directive('sectionHome', [function(){

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
    animation('.page-home', ['SIDEBAR_ANIMATE_TIME', 'TimelineHelpers', function( SIDEBAR_ANIMATE_TIME, TimelineHelpers ){
        return {
            enter: function($element, done){
                setTimeout(function(){
                    TimelineHelpers.suicidal(done)
                        //.set($element, {visibility:'visible'})
                        .fromTo($element, 1, {scale:0.8, opacity:0}, {scale:1, opacity:1, visibility: 'visible'});
                }, SIDEBAR_ANIMATE_TIME);
            },
            leave: function($element, done){
                TimelineHelpers.suicidal(done)
                    .to($element, 0.5, {scale:0.8, opacity:0});
            }
        };
    }]);