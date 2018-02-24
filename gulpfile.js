const gulp      = require("gulp");
const gutil     = require("gulp-util");
const plumber   = require('gulp-plumber');
const notify    = require("gulp-notify");
const webserver = require('gulp-webserver');
const compass   = require("gulp-compass");
const webpack   = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConf = require('./webpack.config.js');

// Gulp Webserver
gulp.task('webserver', () => {
  gulp.src('./')
    .pipe(notify("Starting Server"))
    .pipe(webserver({
      port : 8080,
      livereload: true,
      directoryListing: false,
      open: true,
      // path : '/dev'
    }));
});

// Gulp Compass
gulp.task('compass', () => {
  gulp.src('./src/sass/**/*.scss')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(compass({
      config_file: 'config.rb',
      css: './dist/css',
      sass:'./src/sass'
    }))
    .pipe(gulp.dest('./dist/css'));
});

// Webpack task 
gulp.task('webpack', () => {
	gulp.src(webpackConf.entry)
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(webpackStream(webpackConf), webpack)
	.pipe(gulp.dest(webpackConf.output.publicPath))
});

// Live watch
gulp.task('watch', () => {
    gulp.watch('./src/sass/**/*.scss', ['compass']);
    gulp.watch('./src/js/**/*.js', ['webpack']);
});

// Gulp default task list
gulp.task('default',['webserver', 'compass', 'webpack', 'watch']);