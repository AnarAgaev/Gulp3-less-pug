// CONNECTING GULP MODULES
const gulp = require('gulp')
const less = require('gulp-less')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const cleanCss = require('gulp-clean-css')
const cleanhtml = require('gulp-cleanhtml')
const imagemin = require('gulp-imagemin')
const browserSync = require('browser-sync').create()

// GULP TASKS
gulp.task('less', function () {
    return gulp.src([
      'src/less/main.less',
      'src/less/media.less'
    ])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCss())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('web/style'))
        .pipe(browserSync.stream())
})

gulp.task('resetcss', function () {
    return gulp.src(['src/less/reset.less'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCss())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('web/style'))
        .pipe(browserSync.stream())
})

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(sourcemaps.init())
        .pipe(cleanhtml())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('web'))
        .pipe(browserSync.stream())
})

gulp.task('js', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('web/js'))
        .pipe(browserSync.stream())
})

gulp.task('imagemin', function () {
    return gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('web/images'))
        .pipe(browserSync.stream())
})

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './web'
        }
    })
    gulp.watch('src/less/**/*.less', ['less'])
    gulp.watch('src/less/reset.less', ['resetcss'])
    gulp.watch('src/*.html', ['html'])
    gulp.watch('src/js/**/*.js', ['js'])
    gulp.watch('src/img/**/*', ['imagemin'])
})

gulp.task('default', ['less', 'resetcss', 'html', 'js', 'imagemin', 'serve'])
