var gulp = require('gulp');
var runSequence = require('run-sequence');
var to5 = require('gulp-babel');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var changed = require('gulp-changed');

gulp.task('build-html', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output + 'es2015'))
    .pipe(gulp.dest(paths.output + 'commonjs'))
    .pipe(gulp.dest(paths.output + 'amd'))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-es2015', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.es2015())))
    .pipe(gulp.dest(paths.output + 'es2015'));
});

gulp.task('build-commonjs', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.commonjs())))
    .pipe(gulp.dest(paths.output + 'commonjs'));
});

gulp.task('build-amd', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.amd())))
    .pipe(gulp.dest(paths.output + 'amd'));
});

gulp.task('build-system', function () {
  return gulp.src(paths.source)
    .pipe(to5(assign({}, compilerOptions.system())))
    .pipe(gulp.dest(paths.output + 'system'));
});

gulp.task('build-css', function () {
  return gulp.src(paths.style)
    .pipe(changed(paths.output, { extension: '.css' }))
    .pipe(gulp.dest(paths.output+ 'es2015'))
    .pipe(gulp.dest(paths.output+ 'commonjs'))
    .pipe(gulp.dest(paths.output+ 'amd'))
    .pipe(gulp.dest(paths.output+ 'system'));
});

gulp.task('build', function (callback) {
  return runSequence(
    'clean',
    ['build-html', 'build-es2015', 'build-commonjs', 'build-amd', 'build-system', 'build-css'],
    callback
  );
});
