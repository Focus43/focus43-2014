/* global Power2 */
angular.module('f43.sections').

    directive('sectionContact', ['$animate', 'GoogleMaps', function factory( $animate, GoogleMaps ){

        function _linker( scope, $element, attrs ){
            scope.mapOptions = {
                center: new GoogleMaps.LatLng(43.479634, -110.760234)
            };

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
            controller: ['$scope', '$http', 'AppPaths', function( $scope, $http, AppPaths ){
                $scope.processing = false;

                $scope.isValid = function(){
                    return $scope.contactForm.$invalid;
                };

                $scope.submit = function(){
                    $scope.processing = true;
                    // POST the form data
                    $http.post(AppPaths.toolsHandler('contact'), $scope.form_data)
                        .success(function( response ){
                            $scope.processing = false;
                            $scope.response   = response;
                        });
                };
            }]
        };
    }]).


    /**
     * Animation
     */
    animation('.page-contact-animation', ['TimelineHelper', function( TimelineHelper ){
        return {
            addClass: function($element, className, done){
                var $rows = $element[0].querySelectorAll('.row');
                TimelineHelper.suicidal(done)
                    .set($rows, {y:'100%', autoAlpha:0})
                    .set($element, {autoAlpha:1})
                    .staggerTo($rows, 0.25, {y:0, autoAlpha:1}, 0.15);

            }
        };
    }]).


    /**
     * Animation handler for when the form is sent successfully.
     */
    animation('.form-sent', ['TimelineHelper', function( TimelineHelper ){
        return {
            addClass: function( $element, className, done ){
                var _rows = $element[0].querySelectorAll('.row');
                // Create a new timeline and run it right away
                TimelineHelper.suicidal(done)
                    .set($element, {overflow:'hidden'})
                    .staggerTo(_rows, 0.25, {y:-500, opacity:0, scale:0.8, ease:Power2.easeOut}, 0.15)
                    .to($element, 0.35, {height:0, ease:Power2.easeOut});
            }
        };
    }]);