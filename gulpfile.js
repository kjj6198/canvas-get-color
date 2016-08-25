var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', () => {
  connect.server({
  	root: '',
  	livereload: true
  });
});

gulp.task('livereload', () => {
  return gulp.src(['./index.html', './main.js'])
  					 .pipe(connect.reload())
});

gulp.task('watch', () => {
	gulp.watch(['./main.js', './index.html'], ['livereload']);
});

gulp.task('default', ['connect', 'watch']);