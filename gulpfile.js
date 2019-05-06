'use strict';

const gulp = require('gulp'),
    ts = require('gulp-typescript'),
    spawn = require('child_process').spawn,
    log = require('fancy-log'),
    fileSync = require('gulp-file-sync'),
    sass = require('gulp-sass');

sass.compiler = require('node-sass');

let node;

const sourcePath = 'src';
const sourceMask = `${sourcePath}/*.ts`;
const distPath = 'dist';
const htmlDir = 'html';
const sourceHtmlPath = [sourcePath, htmlDir].join('/');
const stylesDir = 'styles';
const sourceStylesMask = [sourcePath, stylesDir, '*.scss'].join('/');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function () {
    return gulp.src(sourceMask)
        .pipe(tsProject())
        .pipe(gulp.dest(distPath));
});

gulp.task('html', function () {
    fileSync(sourceHtmlPath, [distPath, htmlDir].join('/'));

    return Promise.resolve();
});

gulp.task('sass', function () {
    return gulp.src(sourceStylesMask)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest([distPath, stylesDir].join('/')));
});

gulp.task('run', function () {
    if (node) node.kill();
    node = spawn('node', [`${distPath}/index.js`], { stdio: 'inherit' });
    node.on('close', function (code) {
        if (code) {
            log(`child process exited with code ${code}`);
        }
    });

    return Promise.resolve();
});

gulp.task('watch', function () {
    gulp.watch(`${sourcePath}/**/*`, gulp.series('build', 'sass', 'html', 'run'));

    return Promise.resolve();
});

gulp.task('serve', gulp.series('build', 'sass', 'html', 'run', 'watch'));

process.on('exit', function () {
    if (node) node.kill();
    log('Exit with code 0');
});
