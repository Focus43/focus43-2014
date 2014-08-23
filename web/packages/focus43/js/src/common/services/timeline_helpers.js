angular.module('f43.common').

    factory('TimelineHelpers', ['TimelineLite', function factory( TimelineLite ){
        return {
            // Return a random integer between min-max
            randomInt: function(min, max){
                return Math.floor(Math.random() * (max-min+1)+min);
            },

            // Automatically sets up the onComplete function to kill the instance
            // after its done running, *and* optionally takes a done callback from
            // angulars animation functions
            suicidal: function( done ){
                return new TimelineLite({
                    onComplete: function(){
                        this.kill();
                        if( angular.isFunction(done) ){ done(); }
                    }
                });
            }
        };
    }]);