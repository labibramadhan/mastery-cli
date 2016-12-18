import del from 'del';
import gulp from 'gulp';
import gulpBabel from 'gulp-babel';
import gulpCopy from 'gulp-copy';

gulp.task('build', () => {
  del.sync('./build');

  gulp
    .src('./src/**/*.js')
    .pipe(gulpBabel())
    .pipe(gulp.dest('./build'));

  gulp
    .src('./src/**/*.json')
    .pipe(gulpCopy('./build', {
      prefix: 1,
    }))
    .pipe(gulp.dest('./build'));
});
