angular.module('focus-43').

    directive('scrollNav', ['TweenLite', 'TimelineLite', 'Modernizr', '$window', function( TweenLite, TimelineLite, Modernizr, $window ){

        var _windowHeight   = document.body.clientHeight,
            _windowWidth    = document.body.clientWidth,
            _contentHeight  = document.querySelector('#content').clientHeight,
            _layers         = Array.prototype.slice.call(document.querySelectorAll('.layer'));


        // Bind window.resize listener to update cached window/content height values.
        angular.element($window).on('resize', function(){
            _windowHeight  = document.body.clientHeight;
            _windowWidth   = document.body.clientWidth;
            _contentHeight = document.querySelector('#content').clientHeight;
        });


        function _prefix( declaration ){
            return ['-webkit-', '-moz-', '-o-', '-ms-', ''].join(declaration + ';');
        }


        return {
            restrict: 'A',
            scope: false,
            link: function( $scope, element, attrs ){
                angular.element($window).on('scroll', function(){
                    var _scroll = (this.pageYOffset / (_contentHeight - _windowHeight)),
                        _moveX  = _scroll * _windowWidth;
                    console.log(_scroll);

                    // If 3d transforms are available...
                    if( Modernizr.csstransforms3d ){
                        _layers.forEach(function(_node){
                            _node.style.cssText = _prefix('transform:translateX(-'+_moveX+'px)');
                        });
                        return;
                    }

                    // If we're here, fallback to pos:left
                    _layers.forEach(function(_node){
                        _node.style.left = -_moveX+'px';
                    });

//                    TweenLite.to(_layers.butte, 0.8, {x:-(_moveX), overwrite: 'concurrent', ease: 'Power1.easeOut'});
//                    TweenLite.to(_layers.clouds, 1.4, {x:-(_moveX), overwrite: 'concurrent', ease: 'Power2.easeOut'});
//                    TweenLite.to(_layers.moon, 2.2, {x:-(_moveX), overwrite: 'concurrent', ease: 'Power1.easeOut'});
                });
            }
        };
    }]);