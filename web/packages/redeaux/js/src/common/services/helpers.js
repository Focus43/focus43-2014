angular.module('redeaux.common').

    /**
     * @description Functions for easily working with common Timeline things.
     * @param Timeline
     * @returns {{randomInt: Function, suicidal: Function}}
     */
    factory('TimelineHelper', ['Timeline',
        function factory( Timeline ){
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
                 * Returns a new Timeline instance that is pre-configured with
                 * an onComplete callback to a) kill the timeline instance after
                 * completion (eg. play through then die), and b) process a
                 * _done callback function and/or a promise to resolve.
                 * @param done
                 * @param $defer
                 * @returns {Timeline(Max|Lite)}
                 */
                suicidal: function( config, onCompletes ){
                    return new Timeline(angular.extend(config, {
                        onComplete: function(){
                            this.kill();
                            if( angular.isArray(onCompletes) ){
                                for(var i = 0; i <= onCompletes.length; i++){
                                    if( angular.isObject(onCompletes[i]) && onCompletes[i]['resolve'] ){
                                        onCompletes[i].resolve();
                                    }
                                    if( angular.isFunction(onCompletes[i]) ){
                                        onCompletes[i]();
                                    }
                                }
                            }
                        }
                    }));
                }
            };
        }
    ]).

    /**
     * @returns {{parseRule: Function, determineBodyScrollElement: Function}}
     */
    factory('Utilities', [
        function(){

            /**
             * Get the value of a property defined in a stylesheet for a given selector.
             * @param ssObjOrIndex CSSStyleSheet | int Stylesheet Object or Index of the stylesheet to
             * get from the DOM
             * @param selectorRegex RegExp Pass in a regex rule to match against, eg: new RegExp(/body\.fixed-max*(.)+after/)
             * @param property string Property name to get from the matched rule
             * @returns {mixed|boolean}
             * @private
             */
            function _parseRule( ssObjOrIndex, selectorRegex, property ){
                var stylesheet = angular.isObject(ssObjOrIndex) ? ssObjOrIndex : document.styleSheets[ssObjOrIndex],
                    rules      = stylesheet.cssRules,
                    computed   = false;
                for(var _key in rules){
                    if( rules[_key].selectorText && selectorRegex.test(rules[_key].selectorText) ){
                        computed = rules[_key].style[property];
                        break;
                    }
                }
                return computed;
            }

            /**
             * Bug in webkit causes a) different height calculations, and b) which DOM
             * element emits scroll events on the body, ie. mousewheel. This is a quick
             * test that will return the proper element to bind listeners to.
             * @note Always use this inside of a timeout() with at least 15ms to ensure
             * that DOM rendering is complete before running this test!
             * @returns {HTMLElement}
             * @private
             * @ref: https://bugs.webkit.org/show_bug.cgi?id=106133
             */
            function _bodyScrollingElement(){
                if( document.body.scrollHeight > document.body.clientHeight ){
                    return document.body;
                }
                return document.documentElement;
            }

            return {
                parseRule                   : _parseRule,
                determineBodyScrollElement  : _bodyScrollingElement
            };
        }
    ]);