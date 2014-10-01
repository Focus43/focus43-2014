angular.module('GoogleMap').

    provider('GoogleMapsAPI', function(){

        var _callback = 'google_map_loaded';

        // Create init callback function in global scope!
        window[_callback] = function(){
            angular.element(document.body).data('gmap_defer').resolve(window['google']['maps']);
        };

        this.$get = ['$window', '$log', '$q',
            function( $window, $log, $q ){
                // Create deferred object
                var Defer = $q.defer();

                // If Maps API is loaded, resolve imemdiately
                if( angular.isDefined($window['google']) ){
                    Defer.resolve($window['google']['maps']);

                // Otherwise load script dynamically, *with callback name bound to global scope*
                }else{
                    var script  = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src  = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyANFxVJuAgO4-wqXOeQnIfq38x7xmhMZXY&sensor=TRUE&libraries=weather&callback=' + _callback;
                    document.body.appendChild(script);
                }

                // Bind the Deferred object to the body via data attributes
                angular.element(document.body).data('gmap_defer', Defer);

                // Get the Deferred's promise.
                var _promise = Defer.promise;

                return {
                    promise: _promise,
                    available: function( _success ){
                        _promise.then(_success);
                    }
                };
            }
        ];
    });
