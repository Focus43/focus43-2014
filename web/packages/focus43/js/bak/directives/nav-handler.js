/**
 * All concerns for navigation.
 */
angular.module('focus-43').

    /**
     * Injectable service for managing navigation state.
     */
    factory('NavHandler', function(){
        var state = {
            parallaxIndex: 0
        };

        function _gotoParallaxIndex( index ){
            state.parallaxIndex = +(index);
        }

        return {
            state: state,
            gotoParallaxIndex: _gotoParallaxIndex
        };
    }).


    /**
     * Directive bound to <nav> tags on the page (of which there should only be one!)
     * @ref: NodeLists vs Array: http://toddmotto.com/a-comprehensive-dive-into-nodelists-arrays-converting-nodelists-and-understanding-the-dom/
     */
    directive('nav', ['Modernizr', function( modernizr ){

        // Cache DOM node selectors as *ARRAYS*; see the ref above about NodeList vs Array and conversions
        var layers          = Array.prototype.slice.call(document.querySelectorAll('.layer')),
            pageContainer   = document.querySelector('.pages'),
            pages           = Array.prototype.slice.call(document.querySelectorAll('.page')),
            pageCount       = pages.length;


        /**
         * Add vendor-prefixes to style declarations (ie. "transforms" specifically).
         * @param declaration
         * @returns {string}
         * @private
         */
        function _prefix( declaration ){
            return ['-webkit-', '-moz-', '-o-', '-ms-', ''].join(declaration + ';');
        }


        /**
         * Handle updating CSS on DOM elements to trigger parallax animations.
         */
        function parallaxTo( index ){
            // If 3d transforms are available...
            if( modernizr.csstransforms3d ){
                layers.forEach(function(_node){
                    var _percent = -((index * 0.2)*100)+'%';
                    _node.style.cssText = _prefix('transform:translateX('+_percent+')');
                });
                // Page layer transitions
                pageContainer.style.cssText = _prefix('transform:translateX('+ -((100/pageCount)*index) +'%)');
                return;
            }

            // If we're here, fallback to pos:left
            layers.forEach(function(_node){
                _node.style.left = -((index * 0.2)*100)+'%';
            });
            // Page layer transitions
            pageContainer.style.left = -(index*100)+'%';
        }


        /**
         * Directive configuration
         */
        return {
            restrict: 'E',
            scope: {},
            controller: ['$scope', 'NavHandler', function( $scope, NavHandler ){
                // Bind NavHandler to the scope
                $scope._handler = NavHandler;

                // Method on the controller, callable by child directive.
                this.updateNav = function(_index){
                    $scope.$apply(function(){
                        NavHandler.gotoParallaxIndex(_index);
                    });
                };
            }],
            link: function( $scope, element ){
                // Bind click listener to trigger nav open/closed.
                element.on('click', function(){
                    document.body.classList.toggle('nav-open');
                });

                // Watch NavHandler state, (_handler = NavHandler on the scope)
                $scope.$watchCollection('_handler.state', function(){
                    parallaxTo($scope._handler.state.parallaxIndex);
                });
            }
        };
    }]).


    /**
     * Child directives of 'nav' directive, which trigger updating the NavHandler service.
     */
    directive('navSlideTo', function(){
        return {
            restrict: 'A',
            scope: false,
            require: '^nav',
            link: function($scope, element, attrs, navCtrl){
                element.on('click', function(){
                    navCtrl.updateNav(attrs.navSlideTo);
                });
            }
        };
    });