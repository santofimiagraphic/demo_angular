// File: Gulpfile.js
'use strict';

var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    historyApiFallback = require('connect-history-api-fallback'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream;
 
// gulp.task('browserSync', function() {
//   browserSync({
//     server: {
//       baseDir: 'app'
//     }
//   })
// })

// gulp.task('server', function(){
//   gulp.src('app')
//     .pipe(webserver({
//       port : 8080,
//       livereload : true,
//       fallback : 'index.html',
//       open : true,
//       middleware : [historyApiFallback]
//     }));
// });

gulp.task('webserver', function() {
  gulp.src('./app')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      fallback : 'index.html',
      open: true,
      middleware : [historyApiFallback]
    }));
});

// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});
// Pre-procesa archivos Stylus a CSS y recarga los cambios
gulp.task('css', function() {
  gulp.src('app/stylesheets/*.styl')
    .pipe(stylus({ use: nib() }))
    .pipe(gulp.dest('app/stylesheets'))
    .pipe(webserver());
});
// Recarga el navegador cuando hay cambios en el HTML
gulp.task('html', function() {
  gulp.src('app/**/*.html')
    .pipe(webserver());
});
// Vigila cambios que se produzcan en el código
// y lanza las tareas relacionadas
gulp.task('watch', function() {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/stylesheets/**/*.styl'], ['css', 'inject']);
  gulp.watch(['./app/scripts/**/*.js', './Gulpfile.js'], ['jshint', 'inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
});

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function() {
  var sources = gulp.src([ 'app/scripts/**/*.js', 'app/stylesheets/**/*.css' ]);
  return gulp.src('index.html', { cwd: 'app' })
    .pipe(inject(sources, {
      read: false,
      ignorePath: 'app'
    }))
    .pipe(gulp.dest('app'));
});
// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory: './app/lib'
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('default', ['webserver', 'inject', 'wiredep', 'watch']);