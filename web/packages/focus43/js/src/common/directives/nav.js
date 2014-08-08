angular.module('f43.common').

    directive('nav', ['$rootScope', '$location', function factory( $rootScope, $location ){

        var $arrows = angular.element(document.querySelectorAll('#content .arrow')),
            $trigger, $listItems, $navLinks;


        function setActiveByIndex( index ){
            $listItems.removeClass('active').eq(index).addClass('active');
        }


        function _linker( scope, $element, attrs, AnimatorController ){
            $trigger   = angular.element(document.querySelector('nav .trigger'));
            $listItems = $element.find('li');
            $navLinks  = angular.element(document.querySelectorAll('.section-nav a'));


            // Instead of listening for clicks on the <a> tags in the nav list, just
            // let the $routeChangeSuccess event update the active index to trigger this
            scope.$watch('activeIndex', function( _index, _prevIndex ){
                if( _index === _prevIndex ){
                    return;
                }
                setActiveByIndex(_index || 0);
                AnimatorController.parallaxTo(_index);
            });

            // Nav trigger (toggle open/close)
            $trigger.on('click', function( event ){
                scope.$apply(function(){
                    $rootScope.sidebar.open = !$rootScope.sidebar.open;
                });
            });

            // If sidebar is open, bind a one-time click listener on the track when its masked
            $rootScope.$watch('sidebar.open', function( status ){
                if( status === true ){
                    angular.element(document.querySelector('#track')).one('click', function(){
                        scope.$apply(function(){
                            $rootScope.sidebar.open = false;
                        });
                    });
                }
            });

            // Arrow clicks; instead of updating just the active index, we update the
            // *route* (by finding the prev/next <a> tag and getting its href) so that the
            // $routeChangeStart event gets triggered accordingly.
            $arrows.on('click', function(){
                if( angular.element(this).hasClass('left') && scope.activeIndex > 0 ){
                    scope.$apply(function(){
                        $location.path($navLinks.eq(scope.activeIndex-1).attr('href'));
                        //scope.activeIndex--;
                    });
                }

                if( angular.element(this).hasClass('right') && scope.activeIndex < ($listItems.length - 1) ){
                    scope.$apply(function(){
                        $location.path($navLinks.eq(scope.activeIndex+1).attr('href'));
                        //scope.activeIndex++;
                    });
                }
            });
        }


        return {
            restrict: 'E',
            require:  '^animator',
            scope:    true,
            link:     _linker,
            controller: ['$rootScope', '$scope', function( $rootScope, $scope ){
                // Default activeIndex of 0 = home section
                $scope.activeIndex = 0;

                /**
                 * Get the current activeIndex
                 * @returns {number}
                 */
                this.activeIndex = function(){
                    return $scope.activeIndex;
                };

                /**
                 * Watch for route changes and update the scope's active index - which triggers
                 * all subsequent navigation stuff.
                 */
                $scope.$on('$routeChangeStart', function(event, current){
                    var href = '/';
                    if( angular.isDefined(current) && angular.isDefined(current.params.section) ){
                        href += current.params.section;
                    }
                    var navElement = document.querySelector('nav [href="'+href+'"]');
                    $scope.activeIndex = navElement ? Array.prototype.indexOf.call($listItems, navElement.parentNode) : 0;
                    $rootScope.sidebar.open = false;
                });

            }]
        };
    }]);

