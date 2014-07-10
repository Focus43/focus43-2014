angular.module('f43.navigation').

    directive('nav', ['Modernizr', 'TweenLite', function factory( modernizr, TweenLite ){

        return {
            restrict: 'E',
            require:  '^scrollHandler',
            link: function( $scope, $element, attrs, ScrollHandlerCtrl ){
                // Swap 'active' class on <li> tags
                $element.find('a').on('click', function(){
                    $element.find('li').removeClass('active');
                    angular.element(this).parent().addClass('active');
                });

                // Listen for $routeChangeSuccess and perform scrolling navigation
                $scope.$on('$routeChangeSuccess', function(event, current){
                    var offset = 0;
                    if( angular.isDefined(current) ){
                        var $element = angular.element(document.querySelector('#section-'+current.params.section));
                        offset = $element[0].offsetTop;
                    }

                    ScrollHandlerCtrl.parallaxTo(offset).unwatchScrollUntil(function( _defer ){
                        TweenLite.to(window, 0.35, {scrollTo:{y:offset, autoKill:false}, onComplete: function(){
                            _defer.resolve();
                        }});
                    });
                });
            }
        };
    }]);