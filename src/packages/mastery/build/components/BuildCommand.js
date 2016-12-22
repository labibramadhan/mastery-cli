import {
  Spinner,
} from 'cli-spinner';
import _ from 'lodash';
import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import gulpBabel from 'gulp-babel';
import gulpCopy from 'gulp-copy';
import gulpUglify from 'gulp-uglify';
import path from 'path';

const ColorizeText = requireF('services/ColorizeText');
const {
  getServerName,
  getTargetBabelRecipe,
} = requireF('services/CommonServices');
const {
  validateRootDir,
} = requireF('services/CommonValidations');

/**
 * The main class that handles the 'build' command execution.
 *
 * @export
 * @class BuildCommand
 * @property {string} BUILD_DIR Build directory relative path
 * @property {string} JS_GLOB A glob pattern where javascript files are
 * @property {Object} BABEL_RECIPES Babel configuration for transforming es6 MasteryJS source codes
 * @property {string[]} COPY_GLOB Glob patterns where non javascript files are
 * @property {string} MK_INTRO The translation key of 'initializing' phase message
 * @property {string} MK_BUILD_SUCCESS The translation key of 'build success' phase message
 * @property {string} MK_CLEANING The translation key of 'cleaning' phase message
 * @property {string} MK_COPYING_NON_JS The translation key of 'copying non javascript files' phase message
 * @property {string} MK_COPYING_JS The translation key of 'copying javascript files' phase message
 * @property {string} MK_WRITING_RUN_CONF The translation key of 'writing mastery.run.js file' phase message
 */
export default class BuildCommand {
  BUILD_DIR = 'build';
  JS_GLOB = 'src/**/*.js';
  COPY_GLOB = [
    'src/config/**/*.json',
    'src/core/config/**/*.json',
    'src/core/components/**/*.config.json',
    'src/main/components/**/*.config.json',
    'src/core/locales/**/*.json',
    'src/main/locales/**/*.json',
  ]
  BABEL_RECIPES = {
    presets: [
      'es2015',
      'stage-3',
    ],
    plugins: [
      'add-module-exports',
      'transform-runtime',
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-es2015-classes',
      'transform-flow-strip-types',
    ],
  }
  MK_INTRO = 'build.intro';
  MK_BUILD_SUCCESS = 'build.success';
  MK_CLEANING = 'build.cleaning';
  MK_COPYING_NON_JS = 'build.copying.nonJS';
  MK_COPYING_JS = 'build.copying.JS';
  MK_WRITING_RUN_CONF = 'build.writing.conf';

  /**
   * Copy none javascript files such as json configuration files, etc.
   *
   * @returns {Promise}
   */
  async copyNonJS() {
    const copyGlobs = _.map(
      _.castArray(this.COPY_GLOB), val => path.join(this.basePath, val),
    );
    await new Promise((resolve) => {
      gulp
        .src(copyGlobs)
        .pipe(gulpCopy(this.targetDir, {
          prefix: 1,
        }))
        .pipe(gulp.dest(this.targetDir))
        .on('end', resolve);
    });
  }

  /**
   * Copy javascript files -> transform using babel -> babili.
   *
   * @returns {Promise}
   */
  async copyJS() {
    const self = this;
    const jsGlobs = _.map(_.castArray(self.JS_GLOB), val => path.join(self.basePath, val));
    await new Promise((resolve) => {
      gulp
        .src(jsGlobs)
        .pipe(gulpBabel(getTargetBabelRecipe()))
        .pipe(gulpUglify())
        .pipe(gulp.dest(self.targetDir))
        .on('end', resolve);
    });
  }

  /**
   * Write mastery.run.json file, append 'name' key value from project name question answered by user before.
   */
  writeRunConf() {
    process.chdir(this.BUILD_DIR);
    const runConf = _.merge(constants.DEFAULT_RUN_CONF, {
      name: this.serverName,
    });
    fs.writeFileSync(constants.RUN_FILE, JSON.stringify({
      apps: runConf,
    }, null, 2));
  }

  /**
   * The main method to call another methods sequentially, including decorations output.
   *
   * @returns {Promise}
   */
  async execute() {
    validateRootDir();

    this.basePath = path.resolve('.');
    this.targetDir = path.join(this.basePath, this.BUILD_DIR);
    this.serverName = getServerName(this.basePath);

    console.log(ColorizeText.info(i18n.t(this.MK_INTRO, {
      serverName: this.serverName,
    })));
    console.log('');

    const loading = new Spinner(ColorizeText.info(i18n.t(this.MK_CLEANING)));
    loading.setSpinnerString(constants.DEFAULT_SPINNER);
    loading.start();

    del.sync(this.targetDir);

    loading.setSpinnerTitle(ColorizeText.info(i18n.t(this.MK_COPYING_NON_JS)));
    await this.copyNonJS();

    loading.setSpinnerTitle(ColorizeText.info(i18n.t(this.MK_COPYING_JS)));
    await this.copyJS();

    loading.setSpinnerTitle(ColorizeText.info(i18n.t(this.MK_WRITING_RUN_CONF)));
    this.writeRunConf();

    loading.stop(true);
    console.log(ColorizeText.info(i18n.t(this.MK_BUILD_SUCCESS, {
      serverName: this.serverName,
    })));
    console.log('');
  }
}
