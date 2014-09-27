angular.module('redeaux.pages', []).

    animation('.anim-about',[function(){
        return {
            addClass: function(el, className, done){
                console.log('about_view_ready');
                done();
            }
        };
    }]).

    animation('.anim-work',[function(){
        return {
            addClass: function(el, className, done){
                console.log('work_view_ready');
                done();
            }
        };
    }]);