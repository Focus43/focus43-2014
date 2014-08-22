/* global Power2 */

angular.module('f43.sections').

    directive('sectionAbout', ['$animate', 'TweenLite', 'TimelineMax', 'TimelineLite', function( $animate, TweenLite, TimelineMax, TimelineLite ){

        function _linker( scope, $element, attrs, AnimatorController ){
            var tlMaster = new TimelineMax({paused:true}),
                tlEnter  = new TimelineLite(),
                tlLeave  = new TimelineLite();

            tlEnter.fromTo($element, 1, {opacity:0,scale:0.6,rotationZ:-72}, {opacity:1,scale:1,rotationZ:0});

            tlLeave.to($element, 1, {opacity:0,rotationZ:-70});

            tlMaster.add(tlEnter, 'enter').add(tlLeave, 'leave');

            $element.data('timeline', tlMaster);
        }

        return {
            restrict: 'C',
            scope:    true,
            require:  '^animator',
            link:     _linker
        };
    }]);