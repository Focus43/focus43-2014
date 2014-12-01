(function( gulp, glob ){

    // Path to packages directory
    var _packages = __dirname + '/web/packages/';

    // Search all packages for gulp.js file
    glob.sync('**/gulp.js', {cwd: __dirname + '/web/packages/'}).forEach(function(fileName){
        require(_packages + fileName)(gulp);
    });

    // Register 'watch' as the default task
    gulp.task('default', ['watch']);

})( require('gulp'), require('glob') );