var gulp = require('gulp');
var sass = require('gulp-ruby-sass')
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var express = require('express');
var livereload = require('connect-livereload');

gulp.task('clean', function () {
    return gulp.src('dist', { read: false })
        .pipe(clean());
});

gulp.task('js', function () {
    gulp.src('src/js/main.js')
        .pipe(plumber())
        .pipe(browserify({debug: true, extensions: ['.jsx'], transform: 'reactify'}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function () {
    gulp.src('src/css/*.scss')
        .pipe(plumber())
        .pipe(sass({sourcemap: true, sourcemapPath: '.', compass: true}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
    gulp.src('src/images/**/*.*')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('express', function () {
  var app = express();
  app.use(livereload({port: 35729}));
  app.use(express.static(__dirname + '/dist'));
  app.get(/^[^?#]*/, function (req, res) {
      res.sendFile(__dirname + '/dist/index.html');
  });
  app.listen(4000);
});

var tinylr;
gulp.task('livereload', function () {
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);

    tinylr && tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('default', ['js', 'sass', 'copy']);
gulp.task('server', ['default', 'express', 'livereload', 'watch']);

gulp.task('watch', function () {
    gulp.watch('src/**/*.*', ['default']);
    gulp.watch('dist/**/*.*', notifyLiveReload);
});
