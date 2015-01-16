var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonMinify = require('gulp-jsonminify'),
    imageMin = require('gulp-imagemin'),
    pngCrush = require('imagemin-pngcrush'),
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
    gulp.watch('builds/development/*.html', ['html']); // esto lo hardcodeo porque el unico html base que hay no esta en ambos ambientes, no puedo usar outputDir
    gulp.watch('builds/development/js/*.json', ['json']);
    gulp.watch('builds/development/images/**/*.*', ['images']);
})

gulp.task('html', function(){
    gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

gulp.task('images', function(){
    gulp.src('builds/development/images/**/*.*')  // las 2 estrellas es '' cualquier subfolder ''
    .pipe(gulpif(env === 'production', imageMin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngCrush()]

    })))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
    .pipe(connect.reload())
})

gulp.task('json', function(){
    gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonMinify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
    .pipe(connect.reload())
});

gulp.task('connect', function(){
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('default',['coffee', 'js', 'compass', 'html', 'json','images', 'connect', 'watch']); // la que se llama default es la que se ejecuta cuando ejecutas gulp sin parametros.