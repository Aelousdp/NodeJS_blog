/**
 * Created by Administrator on 2016/11/9 0009.
 */
var gulp = require('gulp'),
    filter = require('gulp-filter');

gulp.task('default', function() {
    var allfilte = filter('**/*', {restore: true});

    return gulp.src('./public/**')
       .pipe(gulp.dest('static/public/'));
});