'use strict';

// //////////////////////////////
// Required
// //////////////////////////////
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),
    mainBowerFiles = require('main-bower-files'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    sourceMaps = require('gulp-sourcemaps'),
    gulpPlumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    browserSync = require('browser-sync').create(),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    changed = require('gulp-changed');

// //////////////////////////////
// Settings
// //////////////////////////////

var g_app = {
    scss: ['src/scss/**/*.scss', 'src/css/**/*.css'],
    js: ['src/js/**/*.js', '!src/js/**/*.min.js'],
    img: []
}

var g_dest = {
    css: [],
    js: [],
    img: [],
    html: [],
    min_css: [],
    min_js: []
}


// //////////////////////////////
// Move Image
// //////////////////////////////
gulp.task('moveImg', function() {
    return gulp.src('src/images/**/*.+(png|jpg|gif|svg)', {
            base: "./src/"
        })
        .pipe(gulp.dest('./dev/'));
});

// //////////////////////////////
// CSS Task
// //////////////////////////////
gulp.task('clean-css', function() {
    console.log("************************* clean-css *************************");
    return gulp.src(['dev/css/**/*.css', 'dev/maps/**/*.css.map'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('sass', ['sass-vendor'], function() {
    console.log("************************* css *************************");
    return gulp.src(g_app.scss)
        .pipe(sourceMaps.init())
        .pipe(gulpPlumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourceMaps.write('../maps', {
            mapFile: function(mapFilePath) {
                return mapFilePath.replace('.css.map', '.map');
            }
        }))
        .pipe(gulp.dest('dev/css'));
});

gulp.task('sass-vendor', ['clean-css'], function() {
    console.log("************************* vendor-css *************************");
    return gulp.src(mainBowerFiles('**/*.css'))
        .pipe(sourceMaps.init())
        .pipe(cleanCSS())
        .pipe(concat('vendor.min.css'))
        .pipe(sourceMaps.write('../maps', {
            mapFile: function(mapFilePath) {
                return mapFilePath.replace('.css.map', '.map');
            }
        }))
        .pipe(gulp.dest('dev/css'));
});

// //////////////////////////////
// Script Task
// //////////////////////////////
gulp.task('clean-script', function() {
    console.log("************************* clean-script *************************");
    return gulp.src(['dev/js/**/*.js', 'dev/maps/**/*.js.map'], {
            read: false
        })
        .pipe(clean());
});

gulp.task('script', ['script-vendor'], function() {
    console.log("************************* script *************************");
    return gulp.src(g_app.js)
        .pipe(sourceMaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        //.pipe(concat('app.min.js'))
        //.pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourceMaps.write('../maps', {
            mapFile: function(mapFilePath) {
                return mapFilePath.replace('.js.map', '.map');
            }
        }))
        .pipe(gulp.dest('dev/js'));
});

gulp.task('script-vendor', ['clean-script'], function() {
    console.log("************************* vendor-script *************************");
    return gulp.src(mainBowerFiles('**/*.js'))
        .pipe(sourceMaps.init())
        //.pipe(concat('vendor.min.js'))
        //.pipe(uglify())
        .pipe(sourceMaps.write('../maps', {
            mapFile: function(mapFilePath) {
                return mapFilePath.replace('.js.map', '.map');
            }
        }))
        .pipe(gulp.dest('dev/js'));
});

// //////////////////////////////
// Inject Task
// //////////////////////////////
gulp.task('inject', function() {
    console.log("************************* inject *************************");
    var target = gulp.src('html/*.+(html|php)');
    //var target = gulp.src(['html/include/include-css.html', 'html/include/include-js.html']);
    var sources = gulp.src(['dev/**/*.js', 'dev/**/*.css'], {
        read: false
    });
    return target.pipe(inject(sources, {
            relative: true
        }))
        .pipe(gulp.dest('html'));
    //.pipe(gulp.dest('html/include/'));
});

// //////////////////////////////
// Watch Task
// //////////////////////////////
gulp.task('watch', function() {
    console.log("************************* watch *************************");
    gulp.watch(['src/js/**/*.js'], ['script']);
    gulp.watch(['src/scss/**/*.scss', 'src/css/**/*.css'], ['sass']);

});

// //////////////////////////////
// Default Task
// //////////////////////////////
gulp.task('default', function(callback) {
    runSequence(['script', 'sass', 'moveImg'], 'inject', 'watch', callback);
});
