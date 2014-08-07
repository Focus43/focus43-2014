angular.module('f43.navigation').

    directive('scrollHandler', [ '$window', 'Modernizr', function factory( $window, modernizr ){

        var CONTROLLED_SCROLL = false,
            $target, windowHeight, windowWidth, contentHeight, parallaxLayers;

        function _prefix( declaration ){
            return ['-webkit-', '-moz-', '-o-', '-ms-', ''].join(declaration + ';');
        }

        function linkFn( scope, $element, attrs, Controller ){
            $target        = angular.element(document.querySelector(attrs.scrollTarget));
            windowHeight   = document.body.clientHeight;
            windowWidth    = document.body.clientWidth;
            contentHeight  = $target[0].clientHeight;
            parallaxLayers = Array.prototype.slice.call(document.querySelectorAll(attrs.scrollHandler));

            // Bind window.resize listener to update cached window/content height values.
            angular.element($window)
                // "onWindowScroll"
                .on('scroll', function(){
                    if( CONTROLLED_SCROLL ){ return; }
                    Controller.parallaxTo(this.pageYOffset);
                })
                // "onWindowResize"
                .on('resize', function(){
                    windowHeight  = document.body.clientHeight;
                    windowWidth   = document.body.clientWidth;
                    contentHeight = $target[0].clientHeight;
                });
        }

        return {
            restrict: 'A',
            link:     linkFn,
            controller: ['$rootScope', '$q', function( $rootScope, $q ){
                var _self = this;

                /**
                 * Pass in a page offset integer and this will trigger the parallax layers
                 * to transition to appropriate positions. This is a method on the controller
                 * so it can be used by other directives!
                 * @param pageOffset
                 * @returns {factory}
                 */
                _self.parallaxTo = function( pageOffset ){
                    var _scroll = (pageOffset / (contentHeight - windowHeight)),
                        _moveX  = _scroll * windowWidth;

                    // If 3d transforms are available...
                    if( modernizr.csstransforms3d ){
                        parallaxLayers.forEach(function(_node){
                            _node.style.cssText = _prefix('transform:translateX(-'+_moveX+'px)');
                        });
                        return _self;
                    }

                    // If we're here, fallback to pos:left
                    parallaxLayers.forEach(function(_node){
                        _node.style.left = -_moveX+'px';
                    });
                    return _self;
                };

                /**
                 * Using this method lets you pass in a callback to perform some animation (presumably
                 * that will adjust the scroll position), and make sure that the event bound to the
                 * window scroll above DOES NOT trigger anything. The callback will receive a deferred
                 * object as its only parameter, which MUST be resolved to resume the scroll event.
                 * @param _callback
                 * @returns {factory}
                 */
                _self.unwatchScrollUntil = function( _callback ){
                    // Set CONTROLLED_SCROLL to true (so scroll event on window doesn't do anything)
                    CONTROLLED_SCROLL = true;
                    // Create new deferred
                    var deferred = $q.defer();
                    // Invoke the callback, with the deferred object as an arg
                    _callback.apply(_self, [deferred]);
                    // When the deferred gets resolved...
                    deferred.promise.then(function(){
                        CONTROLLED_SCROLL = false;
                    });
                    return _self;
                };
            }]
        };
    }]);