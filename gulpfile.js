(function( gulp, glob ){

    // Path to packages directory
    var _packages = __dirname + '/web/packages/';

    // Search all packages for gulp.js at the root level
    glob("**/gulp.js", {cwd: _packages, sync:true}, function(err, files){
        files.forEach(function(filename){
            require(_packages + filename)(gulp);
        });
    });

    // Register 'watch' as the default task
    gulp.task('default', ['watch']);

})( require('gulp'), require('glob') );