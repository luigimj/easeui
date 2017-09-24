/* Required modules */
var del = require('del');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');


/* Development tasks */

// Start browserSync server
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'src'
    }
  });
});

// Compile sass
gulp.task('sass', function () {
  return gulp.src('src/scss/main.scss')
    // Passes it through a gulp-sass, log errors to console
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Watchers
gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/main.js', browserSync.reload);
  gulp.watch('*.html', browserSync.reload);
});

/* Production tasks */

// Optimizing css, js and images
gulp.task('minify:css', function () {
  return gulp.src('src/css/main.css')
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('minify:js', function () {
  return gulp.src('src/js/main.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/img'))
});

// Cleaning
gulp.task('clean', function() {
  return [del(['dist/**/*']), cache.clearAll()]
})

gulp.task('clean:dist', function () {
  return del(['dist/**/*', '!dist/img', '!dist/img/**/*']);
});

// Build sequences
gulp.task('default', ['watch']);
gulp.task('build', ['clean:dist', 'minify:css', 'minify:js', 'images']);
