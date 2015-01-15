var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    compass = require('gulp-compass');

var coffeeSources = ['components/coffee/tagline.coffee'];
var sassSources = ['components/sass/style.scss'];
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
var htmlSources = ['builds/development/*.html'];
var jsonSources = ['builds/development/js/*.json'];


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
        .pipe(connect.reload())
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
        .pipe(connect.reload())
});

gulp.task('watch', function(){
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
})

gulp.task('html', function(){
    gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task('json', function(){
    gulp.src(jsonSources)
    .pipe(connect.reload())
});

gulp.task('connect', function(){
    connect.server({
        root: 'builds/development/',
        livereload: true
    });
});

gulp.task('default',['coffee', 'js', 'compass', 'html', 'json', 'connect', 'watch']); // la que se llama default es la que se ejecuta cuando ejecutas gulp sin parametros.