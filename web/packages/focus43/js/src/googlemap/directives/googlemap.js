angular.module('f43.googlemap').

    directive('googlemap', ['GoogleMaps', function( GoogleMaps ){

        // If GoogleMaps not available, don't initialize the directive
        if( ! GoogleMaps ){ return {}; }

        var _defaults = {
            zoom: 12,
            mapTypeId: GoogleMaps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            styles:
            // Snazzy
            // [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#333739"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#2ecc71"}]},{"featureType":"poi","stylers":[{"color":"#2ecc71"},{"lightness":-7}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-28}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"visibility":"on"},{"lightness":-15}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-18}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2ecc71"},{"lightness":-34}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#333739"},{"weight":0.8}]},{"featureType":"poi.park","stylers":[{"color":"#2ecc71"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#333739"},{"weight":0.3},{"lightness":10}]}]
            // Cobalt
            [{"featureType":"all","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":10},{"lightness":30},{"gamma":0.5},{"hue":"#435158"}]}]
        };

        return {
            restrict: 'A',
            scope: {
                mapOptions: '=googlemap',
                mapInstance: '=?'
            },
            replace: true,
            template: '<div></div>',
            link: function( scope, $element, attrs ){
                scope.mapInstance = new GoogleMaps.Map(
                    $element[0],
                    angular.extend(_defaults, (scope.mapOptions || {}))
                );

                // Enable weather layer on the map?
                if( angular.isDefined(attrs.weather) ){
                    var weatherLayer = new GoogleMaps.weather.WeatherLayer({
                        temperatureUnits: GoogleMaps.weather.TemperatureUnit.FAHRENHEIT
                    });
                    weatherLayer.setMap(scope.mapInstance);
                }

                // Enable cloud layer?
                if( angular.isDefined(attrs.clouds) ){
                    var cloudLayer = new GoogleMaps.weather.CloudLayer();
                    cloudLayer.setMap(scope.mapInstance);
                }

            }
        };
    }]);