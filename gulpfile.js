/*
This is Gulp's build file.
**/

const gulp = require('gulp'),
    browserify = require('browserify'),
    tsify = require('tsify'),
    uglify = require('gulp-terser'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream');

class Helper {
    static TASKNAME = {
        indexHtml: "copy-indexHtml",
        views: "copy-views",
        pwaRoots: "copy-pwa-roots"
    }

    static runParallelCopyTasks = () => {
        return gulp.parallel(
            Helper.TASKNAME.indexHtml,
            Helper.TASKNAME.views,
            Helper.TASKNAME.pwaRoots);
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

    static UGLIFY_PRODUCTION_OPTIONS = {
        warnings: "verbose",
        sourceMap: false,
        compress: {
            drop_console: true
        }
    }
}

gulp.task(Helper.TASKNAME.indexHtml, () => {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task(Helper.TASKNAME.views, () => {
    return gulp.src('src/views/**/*')
        .pipe(gulp.dest('dist/views'));
});

// These PWA files must go to the web-root to work properly.
gulp.task(Helper.TASKNAME.pwaRoots, () => {
    const serviceWorker = gulp.src('src/pwa-root/pwa-serviceworker.js')
        .pipe(uglify(Helper.UGLIFY_PRODUCTION_OPTIONS))
        .pipe(gulp.dest('dist'));

    const manifest = gulp.src('src/pwa-root/pwa-manifest.json')
        .pipe(gulp.dest('dist'));

    return merge(serviceWorker, manifest);
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
        .pipe(buffer())
        .pipe(uglify(Helper.UGLIFY_PRODUCTION_OPTIONS))
        .pipe(gulp.dest('dist/js'));
}));