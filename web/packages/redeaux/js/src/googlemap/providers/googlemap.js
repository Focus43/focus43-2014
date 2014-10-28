angular.module('GoogleMap').

    /**
     * GoogleMapsAPI provider definition
     */
    provider('GoogleMapsAPI', function(){

        /**
         * @type {{callback: string, api_key: string, sensor: boolean, weather: boolean}}
         */
        var configs = {
            callback : 'google_map_loaded',
            api_key  : 'API_KEY',
            sensor   : true,
            weather  : false
        };

        /**
         * @description build the URI to load google maps from
         * @param _configs
         * @returns {string}
         * @private
         */
        function _scriptSrc( _configs ){
            var _uri = 'https://maps.googleapis.com/maps/api/js?';
            _uri += 'key=' + _configs.api_key;
            _uri += '&sensor=' + ((_configs.sensor) ? 'TRUE' : 'FALSE');
            _uri += (_configs.weather) ? '&libraries=weather' : '';
            _uri += '&callback=' + _configs.callback;
            return _uri;
        }

        /**
         * @description pass in an array of configuration options
         * @param configObj
         */
        this.setup = function( configObj ){
            angular.extend(configs, configObj);
        };


        /**
         * @description GoogleMapsAPI provider. Note, we're binding the Deferred to
         * the $window.data because of the callback for google maps that has to be placed
         * into the global scope. We don't want the global function to have to reference an
         * internal variable and create a memory leak, so bind it with angular.element(window).data
         * and access it via getters and setters.
         * @param $window
         * @param $q
         * @returns {{promise: (*|promise|Function|promise|promise|promise), available: Function}}
         */
        this.$get = ['$window', '$q',
            function( $window, $q ){
                // Create deferred object
                angular.element($window).data('mapDeferred', $q.defer());

                // Bind globally scoped callback for Google Maps onload
                $window[configs.callback] = function(){
                    angular.element($window).data('mapDeferred').resolve($window['google']['maps']);
                };

                // Initialize the script loading
                var script  = document.createElement('script');
                script.type = 'text/javascript';
                script.src  = _scriptSrc(configs); // inject to make sure we're using merged configs
                document.body.appendChild(script);

                // Provider methods
                return {
                    promise: angular.element($window).data('mapDeferred').promise,
                    available: function( _success ){
                        this.promise.then(_success);
                    }
                };
            }
        ];
    });
