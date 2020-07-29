const gulp = require('gulp');
const merge = require('merge-stream');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

gulp.task('copy-indexHtml', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-views', function () {
    return gulp.src('src/views/**/*')
        .pipe(gulp.dest('dist/views'));
});

// These PWA files must go to the web-root to work properly.
gulp.task('copy-pwa-roots', function () {
    return gulp.src('src/pwa-root/*')
        .pipe(gulp.dest('dist'));
});

/* Copies the 'assets' directory into build directory.
Rarely used, so it's not included in our standard build tasks. */
gulp.task('copy-assets', function () {
    const assetsDirectory = gulp.src(['src/assets/**/*', '!**/favicon.ico'])
        .pipe(gulp.dest('dist/assets'));

    // favicon must go to the web-root per www convention.
    const favicon = gulp.src('src/assets/favicon.ico')
        .pipe(gulp.dest('dist'));

    return merge(assetsDirectory, favicon);
});

/* Builds a debug version without copying "assets" directory. */
gulp.task('build-debug', gulp.series(gulp.parallel('copy-indexHtml', 'copy-views', 'copy-pwa-roots'), function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/ts/App.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist/js'));
}));