module.exports = function( gulp ){

    /**
     * Return full path on the file system.
     * @param _path
     * @returns {string}
     */
    function _packagePath(_path){
        return __dirname + '/' + _path;
    }

    var utils   = require('gulp-util'),
        concat  = require('gulp-concat'),
        uglify  = require('gulp-uglify'),
        sass    = require('gulp-ruby-sass'),
        jshint  = require('gulp-jshint');
//        livereload = require('gulp-livereload');


    var sourcePaths = {
        css: {
            core: _packagePath('css/src/core.scss'),
            app: _packagePath('css/src/app.scss')
        },
        js: {
            core: [
                //_packagePath('bower_components/fastclick/lib/fastclick.js'),
                _packagePath('bower_components/angular/angular.js'),
                _packagePath('bower_components/angular-resource/angular-resource.js'),
                _packagePath('bower_components/angular-route/angular-route.js'),
                _packagePath('bower_components/angular-animate/angular-animate.js'),
                _packagePath('bower_components/gsap/src/uncompressed/TweenMax.js'),
                _packagePath('bower_components/gsap/src/uncompressed/TimelineMax.js'),
                _packagePath('bower_components/gsap/src/uncompressed/easing/EasePack.js'),
                _packagePath('bower_components/gsap/src/uncompressed/plugins/CSSPlugin.js'),
                _packagePath('bower_components/gsap/src/uncompressed/plugins/ScrollToPlugin.js'),
                _packagePath('js/3rd_party/*.js')
            ],
            app: [
                _packagePath('js/src/**/*.js')
            ]
        }
    };


    /**
     * Sass compilation
     * @param _style
     * @returns {*|pipe|pipe}
     */
    function runSass( files, _style ){
        return gulp.src(files)
            .pipe(sass({compass:true, style:(_style || 'nested')}))
            .on('error', function( err ){
                utils.log(utils.colors.red(err.toString()));
                this.emit('end');
            })
            .pipe(gulp.dest(_packagePath('css/')));
    }


    /**
     * Javascript builds (concat, optionally minify)
     * @param files
     * @param fileName
     * @param minify
     * @returns {*|pipe|pipe}
     */
    function runJs( files, fileName, minify ){
        return gulp.src(files)
            .pipe(concat(fileName))
            .pipe(minify === true ? uglify() : utils.noop())
            .pipe(gulp.dest(_packagePath('js/')));
    }


    /**
     * JS-Linter using JSHint library
     * @param files
     * @returns {*|pipe|pipe}
     */
    function runJsHint( files ){
        return gulp.src(files)
            .pipe(jshint(_packagePath('.jshintrc')))
            .pipe(jshint.reporter('jshint-stylish'));
    }


    /**
     * Individual tasks
     */
    gulp.task('sass:core:dev', function(){ return runSass(sourcePaths.css.core); });
    gulp.task('sass:core:prod', function(){ return runSass(sourcePaths.css.core, 'compressed'); });
    gulp.task('sass:app:dev', function(){ return runSass(sourcePaths.css.app); });
    gulp.task('sass:app:prod', function(){ return runSass(sourcePaths.css.app, 'compressed'); });
    gulp.task('jshint', function(){ return runJsHint(sourcePaths.js.app); });
    gulp.task('js:core:dev', function(){ return runJs(sourcePaths.js.core, 'core.js') });
    gulp.task('js:core:prod', function(){ return runJs(sourcePaths.js.core, 'core.js', true) });
    gulp.task('js:app:dev', ['jshint'], function(){ return runJs(sourcePaths.js.app, 'app.js') });
    gulp.task('js:app:prod', ['jshint'], function(){ return runJs(sourcePaths.js.app, 'app.js', true) });


    /**
     * Grouped tasks (by environment target)
     */
    gulp.task('build:dev', ['sass:core:dev', 'sass:app:dev', 'js:core:dev', 'js:app:dev'], function(){
        utils.log(utils.colors.bgGreen('Dev build OK'));
    });

    gulp.task('build:prod', ['sass:core:prod', 'sass:app:prod', 'js:core:prod', 'js:app:prod'], function(){
        utils.log(utils.colors.bgGreen('Prod build OK'));
    });


    /**
     * Watch tasks
     */
    gulp.task('watch', function(){
        //livereload.listen();
        gulp.watch(_packagePath('css/src/**/*.scss'), {interval:1000}, ['sass:app:dev']);
        gulp.watch(_packagePath('js/src/**/*.js'), {interval:1000}, ['js:app:dev']);

        // Livereload only on *.css (NOT .scss) file changes!
//        gulp.watch(_packagePath('css/*.css')).on('change', function(file){
//            livereload.changed(file.path);
//        });
    });

};