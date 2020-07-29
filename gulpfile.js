const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

gulp.task('copy-indexHtml', function () {
    return gulp.src('index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-views', function () {
    return gulp.src('views/**/*')
        .pipe(gulp.dest('dist/views'));
});

gulp.task('copy-pwa-roots', function () {
    return gulp.src('pwa-*.*')
        .pipe(gulp.dest('dist'));
});

/* Copies the 'assets' directory into build directory.
 * Rarely used, so it's not included in our standard build tasks. */
gulp.task('copy-assets', function () {
    return gulp.src('assets/**/*')
        .pipe(gulp.dest('dist/assets'));
});

/* Builds a debug version without copying "assets" directory. */
gulp.task('build-debug', gulp.series(gulp.parallel('copy-indexHtml', 'copy-views', 'copy-pwa-roots'), function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/App.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/js'));
}));