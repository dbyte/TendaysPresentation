/*
This is Gulp's build file.
**/

const gulp = require('gulp'),
    merge = require('merge-stream'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    tsify = require('tsify');

class Helper {
    static taskname = {
        indexHtml: "copy-indexHtml",
        views: "copy-views",
        pwaRoots: "copy-pwa-roots"
    }

    static runParallelCopyTasks = () => {
        return gulp.parallel(
            Helper.taskname.indexHtml,
            Helper.taskname.views,
            Helper.taskname.pwaRoots);
    }

    static runBrowserify = (isDebug) => {
        return browserify({
            basedir: '.',
            debug: isDebug,
            entries: ['src/ts/App.ts'],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .bundle()
    }
}

gulp.task(Helper.taskname.indexHtml, () => {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task(Helper.taskname.views, () => {
    return gulp.src('src/views/**/*')
        .pipe(gulp.dest('dist/views'));
});

gulp.task(Helper.taskname.pwaRoots, () => {
    // These PWA files must go to the web-root to work properly.
    return gulp.src('src/pwa-root/*')
        .pipe(gulp.dest('dist'));
});

/* Task called by custom VSCode task!
Copies the 'assets' directory into build directory.
Rarely used, so it's not included in our standard build tasks. */
gulp.task('copy-assets', () => {
    const assetsDirectory = gulp.src(['src/assets/**/*', '!**/favicon.ico'])
        .pipe(gulp.dest('dist/assets'));

    // favicon must go to the web-root per www convention.
    const favicon = gulp.src('src/assets/favicon.ico')
        .pipe(gulp.dest('dist'));

    return merge(assetsDirectory, favicon);
});

/* Task called by custom VSCode task!
Builds a debug version without copying "assets" directory. */
gulp.task('build-debug', gulp.series(Helper.runParallelCopyTasks(), () => {
    return Helper.runBrowserify(true)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist/js'));
}));

/* Task called by custom VSCode task!
Builds a production version without copying "assets" directory. */
gulp.task('build-production', gulp.series(Helper.runParallelCopyTasks(), () => {
    return Helper.runBrowserify(false)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist/js'));
}));