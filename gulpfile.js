// Require all the things
const gulp = require('gulp');
const browsersync = require("browser-sync").create();
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const imagemin = require('gulp-imagemin');
const newer = require("gulp-newer");
const del = require("del");
const cp = require("child_process");

// BrowserSync
// Server output
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./docs/"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean assets
function clean() {
    return del(["./docs/**/*"]);
}

function images() {
    return gulp
        .src("./src/images/**/*")
        .pipe(gulp.dest("./docs/images"));
}

// Compile SASS to CSS
function css() {
    return gulp
        .src("./src/scss/**/*.scss")
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(gulp.dest("./docs/css/"))
        .pipe(browsersync.stream());
}

// Jekyll build
function jekyll() {
    //return shell.task(['bundle exec jekyll build']);
    return cp.spawn("bundle.bat", ["exec", "jekyll", "build"], { stdio: "inherit" });
}

// Watch Documents
function watchFiles() {
    gulp.watch("./src/scss/**/*", css);
    gulp.watch(
        [
            "./src/jekyll/_includes/**/*",
            "./src/jekyll/_layouts/**/*",
            "./src/jekyll/*",
            "./src/jekyll/_posts/**/*",
            "./src/jekyll/about/**/*",
            "./src/jekyll/portfolio/**/*",
        ],
        gulp.series(jekyll, browserSyncReload)
    );
    gulp.watch("./src/images/**/*", images);
}

const build = gulp.series(clean, gulp.parallel(css, jekyll, images, watchFiles, browserSync));

// export tasks
exports.images = images;
exports.css = css;
exports.jekyll = jekyll;
exports.clean = clean;
exports.build = build;
exports.browserSync = browserSync;
exports.default = build;

// // Static Server + watching scss/html files
// // Build Dev 
// gulp.task('serve', ['build-jekyll-dev', 'js', 'sass', 'images'], function() {

//     browserSync.init({
//         server: "./docs"
//     });

//     gulp.watch("src/scss/**/*.*", ['sass']).on('change', browserSync.reload);
//     gulp.watch("src/images/**/*.*", ['images']).on('change', browserSync.reload);
//     gulp.watch("src/jekyll/**/*.html", ['build-jekyll-dev']).on('change', browserSync.reload);
//     gulp.watch("docs/**/*.html", ['build-jekyll-dev']).on('change', browserSync.reload);
// });

// // Build production version for GH pages
// gulp.task('prod', ['build-jekyll-prod', 'js', 'sass', 'images']);

// gulp.task('js', function(){
//     return gulp.src('src/js/**/*.js')
//       .pipe(gulp.dest('docs/js'))
//   });

// // Compile sass into CSS & auto-inject into browsers
// gulp.task('sass', function() {
//     return gulp.src("src/scss/styles.scss")
//         .pipe(sass.sync().on('error', sass.logError))
//         .pipe(gulp.dest("docs/css"))
//         .pipe(browserSync.stream());
// });

// // Copy and reduce image size
// gulp.task('images', () =>
//     gulp.src('src/images/**/*')
//         //.pipe(imagemin())
//         .pipe(gulp.dest('docs/images'))
//         .pipe(browserSync.stream())
// );

// // Build Jekyll Dev
// gulp.task('build-jekyll-dev', shell.task(['bundle exec jekyll build --baseurl "" --incremental']));

// // Build Jekyll Prod
// gulp.task('build-jekyll-prod', shell.task(['bundle exec jekyll build --baseurl "/web-approach-corp" --incremental']));

// // Project Build Options
// gulp.task('default', ['serve']);