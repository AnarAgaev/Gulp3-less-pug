// PACKAGE CONNECTION
const gulp          = require('gulp')
const less          = require('gulp-less')
const concat        = require('gulp-concat')
const sourcemaps    = require('gulp-sourcemaps')
const autoprefixer  = require('gulp-autoprefixer')
const cleanCss      = require('gulp-clean-css')
const cleanhtml     = require('gulp-cleanhtml')
const imagemin      = require('gulp-imagemin')
const plumber       = require('gulp-plumber')
const notify        = require('gulp-notify')
const browserSync   = require('browser-sync').create()
const pug           = require('gulp-pug')
const del           = require('del')
const runSequence   = require('run-sequence')

// TASKS FOR GULP
gulp.task('less', function () {
    return gulp.src([
      'src/less/main.less',
      'src/less/media.less'
    ])
        .pipe(plumber({
            errorHandler: notify.onError( function(err){
                return {
                    title: 'Styles',
                    message: err.message
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCss())
        .pipe(sourcemaps.write('../maps'))
        .pipe(plumber.stop())
        .pipe(gulp.dest('web/style'))
        .pipe(browserSync.stream())
})

gulp.task('copy:resetcss', function () {
    return gulp.src(['src/less/reset.css'])
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('web/style'))
        .pipe(browserSync.stream())
})

gulp.task('pug', function() {
  return gulp.src('./src/pug/pages/**/*.pug')
      .pipe(plumber({
          errorHandler: notify.onError( function(err){
              return {
                  title: 'Pug',
                  message: err.message
              }
          })
      }))
    .pipe(pug({
        pretty: true
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('web'))
    .pipe(browserSync.stream())
})

gulp.task('copy:js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('web/js'))
        .pipe(browserSync.stream())
})

gulp.task('copy:img', function () {
    return gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('web/images'))
        .pipe(browserSync.stream())
})

gulp.task('serve', ['less', 'copy:resetcss', 'pug', 'copy:js', 'copy:img'], function () {
    browserSync.init({
        server: {
            baseDir: './web'
        }
    })
    gulp.watch('src/less/**/*.less', ['less'])
    gulp.watch('src/less/reset.css', ['copy:resetcss'])
    gulp.watch('src/pug/pages/**/*.pug', ['pug'])
    gulp.watch('src/js/**/*.js', ['copy:js'])
    gulp.watch('src/img/**/*', ['copy:img'])
})

gulp.task('default', ['serve'])
