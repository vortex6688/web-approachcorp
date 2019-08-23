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
        .src("./src/scss/styles.scss")
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
