const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
// const watch = require('gulp-watch');
const browserSync = require('browser-sync').create();

// Подключение CSS файлов
const cssFiles = ['./src/css/main.css', './src/css/styles.css'];

// Подключение JS файлов
const jsFiles = ['./src/js/lib.js', './src/js/main.js'];

// Style task CSS
function styles() {
  return gulp
    .src(cssFiles)
    .pipe(concat('style.css'))
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

// Task for JS
function scripts() {
  return (
    gulp
      .src(jsFiles)
      //Concatenation of two js file into one
      .pipe(concat('script.js'))
      .pipe(uglify())
      //Destination files
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream())
  );
}

//Task for del
function clean() {
  return del(['build/*']);
}

// This is watching if any changes in css and js files
function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('./src/css/**/*.css', styles);
  gulp.watch('./src/js/**/*.js', scripts);
  // When html file is changed -> start sync
  gulp.watch('./*.html').on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);

//This task cleans up build folder
gulp.task('del', clean);
//This task is calling for watch function that is watching for changes in css, js files.
gulp.task('watch', watch);
//Task to clean up build folder and launch styles and scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
//Launches build and watch
gulp.task('dev', gulp.series('build', 'watch'));
