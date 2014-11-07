angular.module('redeaux.common').

    factory('Preloader', ['$rootScope', '$q',
        function( $rootScope, $q ){
            var staticID = 0;

            $rootScope.preload = {};

            function toggleLoading( bool ){
                $rootScope.$applyAsync(function(){
                    $rootScope.bodyClasses.loading = angular.isDefined(bool) ? bool : !($rootScope.bodyClasses.loading);
                });
            }

            function _onSuccess(){
                toggleLoading(false);
            }

            function _onFailure(){
                toggleLoading(false);
            }

            function _onNotify(){
                $rootScope.preload.completed++;
                $rootScope.preload.progress = Math.round(($rootScope.preload.completed / $rootScope.preload.collection.length) * 100);
            }

            function _reset(){
                //toggleLoading(true);
                $rootScope.preload.progress     = 0;
                $rootScope.preload.completed    = 0;
                $rootScope.preload.collection   = [];
                $rootScope.preload.deferred     = $q.defer();
                $rootScope.preload.deferred._id = staticID++;
                $rootScope.preload.deferred.promise.then(_onSuccess, _onFailure, _onNotify);
            }

            _reset();

            $rootScope.$watchCollection('preload.collection', function( list ){
                if( angular.isArray(list) && list.length ){
                    toggleLoading(true);
                    $q.all( list ).then(function(){
                        $rootScope.preload.deferred.resolve();
                    });
                }
            });

            return {
                toggleLoading: toggleLoading,
                reset: _reset,
                pushToCollection: function( promise ){
                    $rootScope.preload.collection.push(promise);
                },
                queue: function( _callback ){
                    _callback.apply($rootScope, [$rootScope.preload.deferred]);
                },
                promise: function(){
                    return $rootScope.preload.deferred.promise;
                }
            };
        }
    ]).

    directive('preload', ['$q', 'Preloader', function( $q, Preloader ){

        function _link( scope, $element, attrs ){

            Preloader.queue(function( deferQueue ){
                var deferInstance = $q.defer(),
                    elementType   = $element[0].tagName.toLowerCase();

                if( elementType === 'video' ){
                    $element.on('canplaythrough', function(){
                        deferQueue.notify();
                        deferInstance.resolve();
                    });

                }else{
                    var image = new Image();
                    image.onload = function(){
                        if( elementType === 'img' ){
                            $element.attr('src', attrs.preload);
                        }else{
                            $element.css('backgroundImage', 'url('+attrs.preload+')');
                        }
                        deferQueue.notify();
                        deferInstance.resolve();
                    };
                    image.src = attrs.preload;
                }

                if( angular.isDefined(attrs.blocking) ){
                    Preloader.pushToCollection(deferInstance.promise);
                }
            });
        }

        return {
            restrict:   'A',
            link:       _link,
            scope:      false
        };
    }]);