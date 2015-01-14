var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass');

var coffeeSources = ['components/coffee/tagline.coffee'];
var sassSources = ['components/sass/style.scss'];
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];


gulp.task('coffee', function(){
    gulp.src(coffeeSources)
        .pipe(coffee({bare : true})
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function(){
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))
});

gulp.task('compass', function(){
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded' // ver pagina de compass output styles
        })
            .on('error', gutil.log))
        .pipe(gulp.dest('builds/development/css'))
});

gulp.task('default',['coffee', 'js', 'compass']); // la que se llama default es la que se ejecuta cuando ejecutas gulp sin parametros.