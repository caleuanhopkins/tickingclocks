// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer= require('gulp-autoprefixer');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var del = require('del');
var cache = require('gulp-cache');

var gulp = require('gulp');

var connect = require('gulp-connect');


// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


gulp.task('scripts', function() {
    return gulp.src(
            'js/mods/**.js'
        )
        .pipe(concat('all.js'))
        .pipe(gulp.dest('js/dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js/dist'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/mods/**', ['scripts']);
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('imgs/svgs/*.svg', ['svgs']);
    gulp.watch('imgs/*', ['images']);
});

gulp.task('connect', function() {
  connect.server({
    port: 3000,
    livereload: false
  });
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'connect', 'watch']);
