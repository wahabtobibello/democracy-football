'use strict';

const gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  minify = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  maps = require('gulp-sourcemaps'),
  util = require('gulp-util'),
  babel = require('gulp-babel'),
  changed = require('gulp-changed'),
  imagemin = require('gulp-imagemin'),
  del = require('del');

gulp.task("compileScripts", function () {
  gulp.src('./src/js/_index.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(rename('index.js'))
    .pipe(gulp.dest('./src/js'));

  gulp.src('./external/_share2social.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(rename('share2social.js'))
    .pipe(gulp.dest('./external'));
});

gulp.task("concatScripts", ["compileScripts"], function () {
  return gulp
    .src([
      './node_modules/jquery/dist/jquery.js',
      './external/jquery-ui-1.12.1.custom/jquery-ui.js',
      './node_modules/popper.js/dist/umd/popper.js',
      './node_modules/bootstrap/dist/js/bootstrap.js',
      './node_modules/izimodal/js/iziModal.js',
      './node_modules/setasap/setAsap.js',
      './node_modules/promise-polyfill/promise.js',
      './external/Blob.js',
      './external/canvas-toBlob.js',
      './node_modules/file-saver/FileSaver.js',
      './node_modules/fabric/dist/fabric.js',
      './external/share2social.js',
      './src/js/index.js',
    ])
    .on('error', function (err) { util.log(util.colors.red('[Error]'), err.toString()); })
    .pipe(concat('index.js'))
    .pipe(gulp.dest('./docs/js'));
});

gulp.task("minifyScripts", ["concatScripts"], function () {
  return gulp.src("./docs/js/index.js")
    .pipe(uglify())
    // .on('error', function (err) { util.log(util.colors.red('[Error]'), err.toString()); })
    .pipe(rename('index.min.js'))
    .pipe(gulp.dest('./docs/js'));
});

gulp.task('concatCss', function () {
  gulp.src([
    './external/jquery-ui-1.12.1.custom/jquery-ui.css',
    './external/jquery-ui-1.12.1.custom/jquery-ui.theme.css',
    "./node_modules/bootstrap/dist/css/bootstrap.css",
    "./node_modules/font-awesome/css/font-awesome.css",
    "./node_modules/izimodal/css/iziModal.css",
    './src/css/styles.css'])
    .pipe(concat('index.css'))
    .pipe(gulp.dest('./docs/css/'));
});

gulp.task('minifyCss', ['concatCss'], function () {
  gulp.src('./docs/css/index.css')
    .pipe(minify())
    .on('error', function (err) { util.log(util.colors.red('[Error]'), err.toString()); })
    .pipe(rename('index.min.css'))
    .pipe(gulp.dest('./docs/css'));
});

/*gulp.task('optimizeImages', function () {
  var imgSrc = './src/img/*.+(png|jpg|gif)',
    imgDst = './docs/img';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});*/

gulp.task('default', ["minifyScripts", "minifyCss"/*, "optimizeImages"*/], function () {
  console.log("Done...");
});