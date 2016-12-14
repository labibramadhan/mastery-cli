import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import gulpBabel from 'gulp-babel';
import gulpCopy from 'gulp-copy';
import gulpUglify from 'gulp-uglify';
import path from 'path';

export default class BuildCommand {
  JS_GLOB = 'src/**/*.js';
  COPY_GLOB = [
    'src/config/**/*.json',
    'src/core/config/**/*.json',
    'src/core/components/**/*.config.json',
    'src/main/components/**/*.config.json',
    'src/core/locales/**/*.json',
    'src/main/locales/**/*.json',
  ]
  TARGET_DIR = 'build';

  execute = async () => {
    const basePath = '.';
    const targetDir = path.resolve(path.join(basePath, this.TARGET_DIR));
    const jsGlobs = _.map(_.castArray(this.JS_GLOB), val => path.resolve(path.join(basePath, val)));
    const copyGlobs = _.map(
      _.castArray(this.COPY_GLOB), val => path.resolve(path.join(basePath, val)),
    );

    del.sync(targetDir);

    gulp
      .src(jsGlobs)
      .pipe(gulpBabel())
      .pipe(gulpUglify())
      .pipe(gulp.dest(targetDir));

    gulp
      .src(copyGlobs)
      .pipe(gulpCopy(targetDir, {
        prefix: 1,
      }));
  }
}
