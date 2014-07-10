module.exports = function(grunt, _configs){

    // Generate path to file in package root
    function pkgPath( _path ){
        return './web/packages/focus43/%s'.replace('%s', _path);
    }


    /////////////////////////////// CONCAT FILES ///////////////////////////////
    _configs.concat.focus43 = { files: {} };

    // Angular and dependencies
    _configs.concat.focus43.files[ pkgPath('js/core.js') ] = [
        pkgPath('bower_components/angular/angular.js'),
        pkgPath('bower_components/angular-resource/angular-resource.js'),
        pkgPath('bower_components/angular-route/angular-route.js'),
        pkgPath('bower_components/gsap/src/uncompressed/TweenLite.js'),
        pkgPath('bower_components/gsap/src/uncompressed/TimelineLite.js'),
        pkgPath('bower_components/gsap/src/uncompressed/easing/EasePack.js'),
        pkgPath('bower_components/gsap/src/uncompressed/plugins/CSSPlugin.js'),
        pkgPath('bower_components/gsap/src/uncompressed/plugins/ScrollToPlugin.js'),
        pkgPath('js/3rd_party/*.js')
    ];

    // theme
    _configs.concat.focus43.files[ pkgPath('js/application.js') ] = [
        //pkgPath('js/app-src/main-bootstrap.js'),
        pkgPath('js/app-src/**/*.js'),
        pkgPath('js/app-src/main-bootstrap.js')
//        pkgPath('bower_components/gsap/src/uncompressed/TweenLite.js'),
//        pkgPath('bower_components/gsap/src/uncompressed/plugins/CSSPlugin.js'),
//        pkgPath('bower_components/gsap/src/uncompressed/easing/EasePack.js'),
//        pkgPath('js/src/modernizr.no-lint.js'),
//        pkgPath('js/src/application.js')
    ];

    // modernizr
//    _configs.concat.toj.files[ pkgPath('js/modernizr.js') ] = [
//        pkgPath('js/build_src/custom_components/modernizr.min.js')
//    ];


    /////////////////////////////// JS LINT ///////////////////////////////
    var _jsHintRcPath = pkgPath('.jshintrc');
    _configs.jshint.focus43 = {
        options: {jshintrc:_jsHintRcPath},
        files: {src: [pkgPath('js/app-src/**/*.js')]}
    };


    /////////////////////////////// UGLIFY FILES ///////////////////////////////
    _configs.uglify.focus43 = {
        options: {
            banner: '<%= banner %>',
            expand: true,
            compress: {drop_console: true}
        },
        files: {}
    };

    Object.keys(_configs.concat.focus43.files).forEach(function(script){
        _configs.uglify.focus43.files[ script ] = script;
    });


    /////////////////////////////// SASS BUILDS ///////////////////////////////
    _configs.sass.focus43 = {
        options: {
            style: 'compressed',
            compass: true
        },
        files : [
            {src: [pkgPath('css/src/manifest.scss')], dest: pkgPath('css/application.css')}
        ]
    }


    /////////////////////////////// WATCH TASKS ///////////////////////////////
    var _watchableJS = [].concat.apply([], Object.keys(_configs.concat.focus43.files).map(function(key){
        return _configs.concat.focus43.files[key];
    }));

    _configs.watch.options = {
        //spawn: false,
        //interval: 5007
    }

    _configs.watch.f43_js = {
        files : _watchableJS,
        tasks : ['jshint:focus43', 'newer:concat:focus43']
    };

    _configs.watch.f43_sass = {
        files : [pkgPath('css/src/*.scss')],
        tasks : ['sass:focus43']
    };

    _configs.watch.generated_css = {
        options : {livereload: 35729},
        files   : [pkgPath('css/*.css')],
        tasks   : []
    };


    /////////////////////////////// BUILD TASKS ///////////////////////////////
    grunt.registerTask('build', 'Building Focus43 Package...', function( _target ){
        var _baseTasks = ['jshint:focus43', 'concat:focus43', 'sass:focus43'];

        switch(_target){
            case 'dev':
                grunt.task.run(_baseTasks);
                break;
            case 'release':
                grunt.task.run(['bump'].concat(_baseTasks).concat(['uglify:focus43']));
                break;
            default:
                grunt.log.error("You fucked up and specified an invalid build target.");
        }
    });

}