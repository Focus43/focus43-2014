/* global Power2 */

angular.module('f43.sections').

    directive('sectionHome', ['$animate', 'TweenLite', 'TimelineMax', 'TimelineLite', function( $animate, TweenLite, TimelineMax, TimelineLite ){

        function _linker( scope, $element, attrs, AnimatorController ){
            var tlMaster = new TimelineMax({paused:true}),
                tlEnter  = new TimelineLite(),
                tlLeave  = new TimelineLite();

            tlEnter.fromTo($element, 1, {opacity:0,scale:0.6,rotationZ:-72}, {opacity:1,scale:1,rotationZ:0});

            tlLeave.to($element, 1, {opacity:0,rotationZ:-70});

            tlMaster.add(tlEnter, 'enter').add(tlLeave, 'leave');

            $element.data('timeline', tlMaster);

//            var tlEnter = new TimelineLite({paused:true});
//            tlEnter.fromTo($element, 1, {opacity:0,scale:0.6,rotationZ:-72}, {opacity:1,scale:1,rotationZ:0});
//            $element.data('enter', tlEnter);
//
//            var tlLeave = new TimelineLite({paused:true});
//            tlLeave.to($element, 1, {opacity:0,rotationZ:-70});
//            $element.data('leave', tlLeave);


//            AnimatorController.addSectionTimeline($element, function(index){
//                var tl = new TimelineLite();
//                tl.fromTo($element, 1, {opacity:0,scale:0.6,rotationZ:-72}, {opacity:1,scale:1,rotationZ:0});
//                tl.to($element, 0.5, {rotationZ:180,opacity:0});
//
//                return tl;
//            });

//            var masterTimeline  = AnimatorController._timeline,
//                sectionTimeline = new TimelineLite(),
//                sectionEnter    = new TimelineLite(),
//                sectionLeave    = new TimelineLite();
//
//            sectionEnter.fromTo($element, 1, {opacity:0,scale:0.6,rotationZ:-72}, {opacity:1,scale:1,rotationZ:0});
//
//            sectionTimeline.add(sectionEnter).add(sectionLeave);
//            masterTimeline.add(sectionTimeline);

//            var tlSection = $element.data('timeline'),
//                tlEnter   = tlSection.getChildren(false,false,true)[0],
//                tlLeave   = tlSection.getChildren(false,false,true)[1];
//
//            tlEnter.fromTo($element, 1, {opacity:0,scale:0.6,rotationZ:-72}, {opacity:1,scale:1,rotationZ:0});
//            tlLeave.to($element, 0.5, {rotationZ:180,opacity:0,delay:1});
//
//            AnimatorController._timeline.add(tlSection, 'section-' + tlSection.data.index);
        }

        return {
            restrict: 'C',
            scope:    true,
            require:  '^animator',
            link:     _linker
        };
    }]);