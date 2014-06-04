'use strict';

var gulp        = require('gulp');
var watchify    = require('watchify');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var recess      = require('gulp-recess');
var less        = require('gulp-less');
var plumber     = require('gulp-plumber');
var watch       = require('gulp-watch');
var eslint      = require('gulp-eslint');
var react       = require('gulp-react');

gulp.task('watchify', function () {

    var bundler = watchify('./src/sampleCart.js');

    bundler.transform(require('reactify'));

    function rebundle () {
        return bundler.bundle()
            .pipe(source('sampleCart.js'))
            .pipe(gulp.dest('dist/'));
    }

    bundler.on('update', rebundle);
    bundler.on('log', console.log);
    bundler.on('error', console.log);

    return rebundle();
});

gulp.task('browserify', function () {
    var bundler = browserify('./src/sampleCart.js');
    bundler.transform(require('reactify'));
    return bundler.bundle()
        .pipe(source('sampleCart.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('uglify', function () {
    return gulp.src('dist/sampleCart.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/'));
});

var recessOptions = {
    strictPropertyOrder: true,
    noIDs: true,
    noJSPrefix: true,
    noOverqualifying: true,
    noUnderscores: true,
    noUniversalSelectors: true,
    zeroUnits: true
};

gulp.task('recess', function () {

    return gulp.src('./less/cart.less')
        .pipe(recess(recessOptions))
        .pipe(less())
        .pipe(gulp.dest('css'));
});

gulp.task('watchLess', function () {
    return gulp.src('less/**/*.less', { read: false })
        .pipe(watch())
        .pipe(plumber())
        .pipe(recess(recessOptions))
        .pipe(less())
        .pipe(gulp.dest('css'))
        .on('log', console.log)
        .on('error', console.log);
});

gulp.task('eslint', function () {
    gulp.src(['src/**/*.js'])
        .pipe(react())
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('build', ['browserify', 'uglify', 'recess']);