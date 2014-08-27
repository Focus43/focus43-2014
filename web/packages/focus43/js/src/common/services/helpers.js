angular.module('f43.common').

    /**
     * Functions for easily working with common TimelineLite things.
     */
    factory('TimelineHelper', ['TimelineLite', function factory( TimelineLite ){
        return {
            /**
             * Return a random integer b/w min -> max (can be negatives).
             * @param min
             * @param max
             * @returns {number}
             */
            randomInt: function(min, max){
                return Math.floor(Math.random() * (max-min+1)+min);
            },

            /**
             * Returns a new TimelineLite instance that is pre-configured with
             * an onComplete callback to a) kill the timeline instance after
             * completion (eg. play through then die), and b) process a
             * _done callback function and/or a promise to resolve.
             * @param done
             * @param $defer
             * @returns {TimelineLite}
             */
            suicidal: function( done, $defer ){
                return new TimelineLite({
                    onComplete: function(){
                        this.kill();
                        if( angular.isFunction(done) ){ done(); }
                        if( angular.isObject($defer) ){ $defer.resolve(); }
                    }
                });
            }
        };
    }]).


    /**
     * Since ngView animation lets the enter/leave animations run concurrently, we
     * need some way to make sure they run in proper order, eg:
     * 1) leave animation COMPLETES
     * 2) enter animation BEGINS
     * This service uses an internally tracked _currentDefer (whereas a new one is
     * created every time viewChanged() gets called!) to keep track of the order in
     * which things get run.
     */
    service('ViewHelper', ['$q', 'TimelineHelper', function factory( $q, TimelineHelper ){
        var _currentDefer = $q.defer();

        /**
         * Create a new _currentDefer object.
         * @return {$.defer()}
         */
        this.viewChanged = function(){
            _currentDefer = $q.defer();
            return _currentDefer;
        };

        /**
         * Enter and Leave functions used to register with animations.
         * @type {{enter: Function, leave: Function}}
         */
        this.whenReady = {
            enter: function( _done, _animations ){
                var timeline = TimelineHelper.suicidal(_done);

                _currentDefer.promise.then(function(){
                    _animations.apply(timeline, [timeline]);
                });
            },
            leave: function( _done, _animations ){
                var timeline = TimelineHelper.suicidal(_done, _currentDefer);
                _animations.apply(timeline, [timeline]);
            }
        };
    }]);