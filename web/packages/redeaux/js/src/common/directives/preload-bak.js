angular.module('redeaux.common').

    directive('preloadHandlerZ', ['$q',
        function( $q ){

            function processPreloadCollection(mainDefer, list){
                var promises = [];

                angular.forEach(list, function( data ){
                    var nodeDefer = $q.defer(),
                        nodeType  = data.element.tagName.toLowerCase();

                    if( nodeType === 'video' ){
                        angular.element(data.element).on('canplaythrough', function(){
                            data.loaded = true;
                            mainDefer.notify(data);
                            nodeDefer.resolve();
                        });

                    }else{
                        var img = new Image();
                        img.onload = function(){
                            if( nodeType === 'img' ){
                                data.element.setAttribute('src', data.element.getAttribute('preload'));
                            }else{
                                data.element.style.backgroundImage = 'url('+data.element.getAttribute('preload')+')';
                            }
                            data.loaded = true;
                            mainDefer.notify(data);
                            nodeDefer.resolve();
                        };
                        img.onerror = function(){
                            data.loaded = false;
                            mainDefer.notify(data);
                            mainDefer.reject();
                        };
                        img.src = data.element.getAttribute('preload');
                    }

                    if( data.blocking === true ){
                        promises.push(nodeDefer.promise);
                    }
                });

                $q.all(promises).then(function(){
                    mainDefer.resolve();
                });
            }


            function _link( scope, $element, attrs, CtrlPreloadHandler ){

                function onSuccess(){
                    CtrlPreloadHandler.toggleLoading(false);
                }

                function onFailure(){
                    CtrlPreloadHandler.toggleLoading(false);
                }

                function onNotify( data ){
                    if( ! data.loaded ){
                        console.log('ERROR LOADING: ', data);
                        return;
                    }
                    scope.preloadData.currentDefer.notifications++;
                    scope.preloadData.progress = Math.round((scope.preloadData.currentDefer.notifications / scope.preloadData.currentDefer.listLength) * 100);
                    console.log(scope.preloadData.progress, scope.preloadData.currentDefer.notifications + '/' + scope.preloadData.currentDefer.listLength, data);
                }

//                scope.$watchCollection('preloadData.collection', function( list ){
//                    if( list.length ){
//                        CtrlPreloadHandler.toggleLoading(true);
//                        scope.preloadData.currentDefer               = $q.defer();
//                        scope.preloadData.currentDefer.notifications = 0;
//                        scope.preloadData.currentDefer.listLength    = list.length;
//                        scope.preloadData.currentDefer.promise.then(
//                            onSuccess, onFailure, onNotify
//                        );
//                        processPreloadCollection(scope.preloadData.currentDefer, list);
//                    }
//                }, true);
            }

            return {
                restrict: 'A',
                link: _link,
                scope: false,
                controller: ['$rootScope', '$scope', '$q',
                    function( $rootScope, $scope, $q ){
                        var instanceCount = 1;

                        $scope.testable = $q.defer();
                        $scope.testable._count = instanceCount++;

                        $rootScope.$on('$routeChangeStart', function(){
                            $scope.testable = $q.defer();
                            $scope.testable._count = instanceCount++;
                            console.log($scope.testable);
                        });

                        this.getSomething = function(){
                            console.log($scope.testable);
                        };


                        $scope.preloadData = {
                            collection: [],
                            progress: null,
                            currentDefer: null
                        };

                        $scope.$watchCollection('preloadData.collection', function( list ){
                            if( list.length ){
                                console.log(list);
                            }
                        });

                        $rootScope.$on('$routeChangeSuccess', function(){
                            $scope.preloadData.collection   = [];
                            $scope.preloadData.progress     = 0;
                            $scope.preloadData.currentDefer = null;
                        });

                        this.pushToCollection = function( element ){
                            $scope.preloadData.collection.push(element);
                        };

                        this.toggleLoading = function( bool ){
                            $rootScope.$applyAsync(function(){
                                $rootScope.bodyClasses.loading = angular.isDefined(bool) ? bool : !($rootScope.bodyClasses.loading);
                            });
                        };

                        this.bindToPromise = function( _callback ){
                            _callback.apply(this, [$scope.preloadData.currentDefer.promise]);
                        };
                    }
                ]
            };
        }
    ]).

    directive('preloadZ', [function(){

        function _link( scope, $element, attrs, CtrlPreloadHandler ){
            CtrlPreloadHandler.pushToCollection({
                element: $element[0],
                blocking: angular.isDefined(attrs.blocking)
            });
        }

        return {
            restrict: 'A',
            link: _link,
            scope: false,
            require: '^preloadHandler'
        };
    }]);

//    directive('preloadable', ['$q',
//        function( $q ){
//
//            function _link( scope, $element, attrs ){
//                var promises = [],
//                    preloads = $element[0].querySelectorAll('[preload]');
//
//                if( preloads.length ){
//                    angular.forEach(preloads, function( node ){
//                        var defer = $q.defer();
//
//                        switch( node.tagName.toLowerCase() ){
//                            case 'video':
//                                angular.element(node).on('canplaythrough', function(){
//                                    defer.resolve();
//                                });
//                                break;
//
//                            case 'img':
//                                var img = new Image();
//                                img.onload = function(){
//                                    node.setAttribute('src', node.getAttribute('data-src'));
//                                    defer.resolve();
//                                };
//                                img.src = node.getAttribute('data-src');
//                                break;
//
//                            default:
//                                var img2 = new Image();
//                                img2.onload = function(){
//                                    node.style.backgroundImage = 'url('+node.getAttribute('data-src')+')';
//                                    defer.resolve();
//                                };
//                                img2.src = node.getAttribute('data-src');
//                        }
//
//                        promises.push(defer.promise);
//                    });
//                }
//
//                $q.all(promises).then(function(){
//                    scope.status.resolve();
//                });
//            }
//
//            return {
//                restrict: 'A',
//                link: _link,
//                controller: ['$scope', '$q', function( $scope, $q ){
//                    $scope.status = $q.defer();
//                    this.promise  = $scope.status.promise;
//                }]
//            };
//        }
//    ]);