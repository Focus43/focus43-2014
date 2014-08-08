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
            restrict: 'C',
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
     * Animation handler for when the form is sent successfully.
     */
    animation('.form-sent', ['TimelineLite', function( TimelineLite ){
        return {
            addClass: function( $element, className, done ){
                // Create a new timeline and run it right away
                (new TimelineLite())
                    .set($element, {overflow:'hidden'})
                    .staggerTo($element[0].querySelectorAll('.row'), 0.35, {y:-500, opacity:0, scale:0.8, ease:Power2.easeOut}, 0.15)
                    .to($element, 0.45, {height:0, ease:Power2.easeOut})
                    .eventCallback('onComplete', function(){
                        done();
                        this.kill();
                    });
            }
        };
    }]);