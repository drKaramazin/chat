const gulp = require('gulp'),
    ts = require('gulp-typescript'),
    spawn = require('child_process').spawn,
    log = require('fancy-log'),
    fileSync = require('gulp-file-sync');

let node;

const sourcePath = 'src';
const sourceMask = `${sourcePath}/*.ts`;
const distPath = 'dist';
const htmlDir = 'html';

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function () {
    return gulp.src(sourceMask)
        .pipe(tsProject())
        .pipe(gulp.dest(distPath));
});

gulp.task('assets', function () {
    fileSync([sourcePath, htmlDir].join('/'), [distPath, htmlDir].join('/'));

    return Promise.resolve();
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
    gulp.watch(sourceMask, gulp.series('build', 'assets', 'run'));

    return Promise.resolve();
});

gulp.task('serve', gulp.series('build', 'assets', 'run', 'watch'));

process.on('exit', function () {
    if (node) node.kill();
});
