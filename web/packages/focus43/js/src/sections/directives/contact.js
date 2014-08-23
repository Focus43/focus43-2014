/* global Power2 */

angular.module('f43.sections').

    /**
     * Handler specifically for contact section.
     */
    directive('sectionContact', ['$animate', function factory( $animate ){

        function _linker( scope, $element, attrs ){
            scope.$watch('response', function( _response ){
                if( angular.isObject(_response) && _response.ok === true ){
                    $animate.addClass($element[0].querySelector('.form-body'), 'form-sent');
                }
            });
        }

        /**
         * Scope properties: contactForm, form_data, processing, response {ok:'',msg:''}
         */
        return {
            restrict: 'A',
            scope:    true,
            link:     _linker,
            controller: ['$scope', '$http', 'Ajax', function( $scope, $http, Ajax ){
                $scope.processing = false;

                $scope.isValid = function(){
                    return $scope.contactForm.$invalid;
                };

                $scope.submit = function(){
                    $scope.processing = true;
                    // POST the form data
                    $http.post(Ajax.toolsHandler('contact'), $scope.form_data)
                        .success(function( response ){
                            $scope.processing = false;
                            $scope.response   = response;
                        });
                };
            }]
        };
    }]).

    /**
     * Animation handler for the page entering/leaving
     */
    animation('.page-contact', ['SIDEBAR_ANIMATE_TIME', 'TimelineHelpers', function( SIDEBAR_ANIMATE_TIME, TimelineHelpers ){
        return {
            enter: function($element, done){
                setTimeout(function(){
                    var _rows = $element[0].querySelectorAll('.row');
                    TimelineHelpers.suicidal(done)
                        .set($element, {visibility:'visible'})
                        .set(_rows, {y:'100%', opacity:0})
                        .staggerTo(_rows, 0.25, {y:0, opacity:1}, 0.15);
                }, SIDEBAR_ANIMATE_TIME);
            },
            leave: function($element, done){
                var _rows = Array.prototype.slice.call($element[0].querySelectorAll('.row')).reverse();
                TimelineHelpers.suicidal(done)
                    .staggerTo(_rows, 0.25, {y:500, opacity:0}, 0.1);
            }
        };
    }]).

    /**
     * Animation handler for when the form is sent successfully.
     */
    animation('.form-sent', ['TimelineHelpers', function( TimelineHelpers ){
        return {
            addClass: function( $element, className, done ){
                var _rows = $element[0].querySelectorAll('.row');
                // Create a new timeline and run it right away
                TimelineHelpers.suicidal(done)
                    .set($element, {overflow:'hidden'})
                    .staggerTo(_rows, 0.25, {y:-500, opacity:0, scale:0.8, ease:Power2.easeOut}, 0.15)
                    .to($element, 0.35, {height:0, ease:Power2.easeOut});
            }
        };
    }]);