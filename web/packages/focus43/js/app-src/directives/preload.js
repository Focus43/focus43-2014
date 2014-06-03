/**
 * Injectable service and directive for preloading image files.
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


        function broadcast(data){
            $rootScope.$emit('PRELOAD_UPDATE', data);
        }

        return {
            restrict:   'A',
            scope: false,
            link: function($scope, element, attrs){
                queued.push(attrs.preload);

                preloadImage(attrs.preload).then(function(data){
                    queued.splice(queued.indexOf(attrs.preload), 1);
                    broadcast(queued);
                });
            }
        };
    }]);