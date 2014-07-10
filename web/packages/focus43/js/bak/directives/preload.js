/**
 * Directive for preloading image files.
 */
angular.module('focus-43').

    /**
     * DOM binding to queue up preloading
     */
    directive('preload', ['$rootScope', '$q', function( $rootScope, $q ){

        var queued = [];

        function preloadImage( imageSource ){
            // Create Defer and image object
            var deferred = $q.defer(),
                imageObj = new Image();
            // Onload callback for the image
            imageObj.onload = function(){
                deferred.resolve(imageObj);
            };
            // Set the source
            imageObj.src = imageSource;
            // Return promise
            return deferred.promise;
        }

        return {
            restrict:   'A',
            scope: false,
            link: function($scope, element, attrs){
                // Add to the queue
                queued.push(attrs.preload);
                // Trigger preloading of the image
                preloadImage(attrs.preload).then(function(data){
                    queued.splice(queued.indexOf(attrs.preload), 1);
                    $rootScope.$emit('PRELOAD_UPDATE', queued);
                });
            }
        };
    }]);