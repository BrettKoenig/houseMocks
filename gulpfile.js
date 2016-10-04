var gulp = require('gulp'),
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
concat = require('gulp-concat'),
wrapper = require('gulp-wrapper'),
htmlclean = require('gulp-htmlclean'),
open = require('gulp-open'),
inject = require('gulp-inject'),
htmlreplace = require('gulp-html-replace'),
connect = require('gulp-connect'),
fs = require('fs');

gulp.task('connect', function () {
    connect.server({
        livereload: true
    });
});

gulp.task('inject', function () {
    gulp.src('./*.html')
  .pipe(inject(gulp.src(['js/templates.js', 'js/jquery.js', 'js/bootstrap.min.js', 'css/app.css', 'css/custom.css', 'font-awesome/css/font-awesome.min.css'], { read: false }), {relative:true}))
  .pipe(gulp.dest('./'));
});

gulp.task('recompile', function () {
    gulp.src('./')
      .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(['./*.html'], ['recompile']);
    gulp.watch(['./*.js'], ['recompile']);
    gulp.watch('sass/**/*.scss', ['styles']);
});

gulp.task('styles', function () {
    return gulp.src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'))
    .pipe(connect.reload());
});

gulp.task('express', function () {
    var express = require('express');
    var app = express();
    app.use(express.static(__dirname));
    app.listen(8080, '0.0.0.0');
});

gulp.task('templates', function () {
    gulp.src('templates/*.html')
        .pipe(htmlclean())
        .pipe(wrapper({
            header: function (file) {
                var name = file.path.substring(file.path.lastIndexOf("\\") + 1, file.path.lastIndexOf("."));
                return 'this["templates"] = this["templates"] || {}; \n this["templates"]["' + name + '"] = function () { \n return "'
            },
            footer: '";};'
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('js/'));
});

gulp.task('app', function () {
    var options = {
        uri: 'http://localhost:8080',
        app: 'chrome'
    };
    gulp.src('./index.html')
    .pipe(open(options));
});

gulp.task('default', ['styles', 'templates', 'inject', 'express', 'connect', 'watch', 'app'], function () {

});