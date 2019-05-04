var gulp = require('gulp'),
    fileSync = require('gulp-file-sync'),
    watch = require('gulp-watch'),
    typescript = require('gulp-tsc');

gulp.task('sync', function() {
   watch('src/html/**/*.html', { ignoreInitial: false }).pipe(gulp.dest('built/html'));
   watch('src/**/*.ts', { ignoreInitial: false }, function (events) {
       // console.log(events);
       gulp.src('src/*.ts')
           .pipe(typescript({ emitError: false, noEmitOnError: true }))
           .pipe(gulp.dest('built/'));
   });
});
