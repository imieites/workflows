var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass');

var env,
    coffeeSources,
    sassSources,
    jsSources,
    htmlSources,
    jsonSources,
    sassStyle, // gulp-compass not working very well, styles aren't working.
    outputDir;

env = process.env.NODE_ENV || 'development';
console.log(env)

if (env=='development'){
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/tagline.coffee'];
sassSources = ['components/sass/style.scss'];
jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
htmlSources = [ outputDir + '*.html'];
jsonSources = [ outputDir + 'js/*.json'];


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
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('compass', function(){
    gulp.src(sassSources)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'images',
            style: sassStyle // ver pagina de compass output styles. parece que el gulp-compass plugin funciona mal.
        })
            .on('error', gutil.log))
        .pipe(gulp.dest( outputDir + 'css'))
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
        root: outputDir,
        livereload: true
    });
});

gulp.task('default',['coffee', 'js', 'compass', 'html', 'json', 'connect', 'watch']); // la que se llama default es la que se ejecuta cuando ejecutas gulp sin parametros.