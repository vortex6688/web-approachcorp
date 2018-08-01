// Require all the things
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var imagemin    = require('gulp-imagemin');
var shell       = require('gulp-shell');

// Static Server + watching scss/html files
// Build Dev 
gulp.task('serve', ['build-jekyll-dev', 'js', 'sass', 'images'], function() {

    browserSync.init({
        server: "./docs"
    });

    gulp.watch("src/scss/**/*.*", ['sass']).on('change', browserSync.reload);
    gulp.watch("src/images/**/*.*", ['images']).on('change', browserSync.reload);
    gulp.watch("src/jekyll/**/*.html", ['build-jekyll-dev']).on('change', browserSync.reload);
    gulp.watch("docs/**/*.html", ['build-jekyll-dev']).on('change', browserSync.reload);
});

// Build production version for GH pages
gulp.task('prod', ['build-jekyll-prod', 'js', 'sass', 'images']);

gulp.task('js', function(){
    return gulp.src('src/js/**/*.js')
      .pipe(gulp.dest('docs/js'))
  });

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/styles.scss")
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest("docs/css"))
        .pipe(browserSync.stream());
});

// Copy and reduce image size
gulp.task('images', () =>
    gulp.src('src/images/**/*')
        //.pipe(imagemin())
        .pipe(gulp.dest('docs/images'))
        .pipe(browserSync.stream())
);

// Build Jekyll Dev
gulp.task('build-jekyll-dev', shell.task(['bundle exec jekyll build --baseurl "" --incremental']));

// Build Jekyll Prod
gulp.task('build-jekyll-prod', shell.task(['bundle exec jekyll build --baseurl "/web-approach-corp" --incremental']));

// Project Build Options
gulp.task('default', ['serve']);