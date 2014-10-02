angular.module('redeaux.pages', []).

    animation('.anim-about', [function(){
        return {
            addClass: function(el, className, done){
                console.log('about_view_ready');
                done();
            }
        };
    }]).

    animation('.anim-work', [function(){
        return {
            addClass: function(el, className, done){
                console.log('work_view_ready');
                done();
            }
        };
    }]).

    /**
     * @todo: figure out why video autoplay doesn't work with animations set here
     */
    animation('.anim-contact', [function(){
        return {
            addClass: function(el, className, done){
                console.log('contact_view_ready');
                //el[0].querySelector('video').play();
                done();
            }
        };
    }]);