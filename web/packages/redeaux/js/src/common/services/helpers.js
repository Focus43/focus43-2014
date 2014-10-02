angular.module('redeaux.common').

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
    }]);