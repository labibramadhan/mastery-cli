import {
  Spinner,
} from 'cli-spinner';
import _ from 'lodash';
import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import gulpBabel from 'gulp-babel';
import gulpCopy from 'gulp-copy';
import path from 'path';
import util from 'util';

const ColorizeText = requireF('services/ColorizeText');
const {
  getServerName,
} = requireF('services/CommonServices');
const {
  validateRootDir,
} = requireF('services/CommonValidations');

/**
 * The main class that handles the 'build' command execution.
 *
 * @export
 * @class BuildCommand
 * @property {string} JS_GLOB A glob pattern where javascript files are
 * @property {string[]} COPY_GLOB Glob patterns where non javascript files are
 * @property {string} TARGET_DIR The build directory relative path from root project directory
 * @property {string} MK_BUILDING The translation key of 'building' phase message
 * @property {string} MK_BUILT The translation key of 'built' phase message
 * @property {string} MK_DELETING The translation key of 'deleting' phase message
 * @property {string} MK_COPYING_NON_JS The translation key of 'copying non javascript files' phase message
 * @property {string} MK_COPYING_JS The translation key of 'copying javascript files' phase message
 * @property {string} MK_WRITING_RUN_CONF The translation key of 'writing mastery.run.js file' phase message
 */
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
  MK_BUILDING = 'Building %s server..';
  MK_BUILT = '%s server build success';
  MK_DELETING = 'Deleting build directory..';
  MK_COPYING_NON_JS = 'Copying non javascript files..';
  MK_COPYING_JS = 'Copying javascript files..';
  MK_WRITING_RUN_CONF = 'Writing run configuration..';

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
        .pipe(gulpBabel({
          presets: [
            'babili',
            'es2015-node6',
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
        }))
        .pipe(gulp.dest(self.targetDir))
        .on('end', resolve);
    });
  }

  /**
   * Write mastery.run.json file, append 'name' key value from project name question answered by user before.
   */
  writeRunConf() {
    process.chdir('./build');
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
    this.targetDir = path.join(this.basePath, this.TARGET_DIR);
    this.serverName = getServerName(this.basePath);

    console.log(ColorizeText.info(util.format(this.MK_BUILDING, this.serverName)));
    console.log('');

    const loading = new Spinner(ColorizeText.info(util.format(this.MK_BUILDING, this.serverName)));
    loading.setSpinnerString(constants.DEFAULT_SPINNER);
    loading.start();

    loading.setSpinnerTitle(ColorizeText.info(this.MK_DELETING));
    del.sync(this.targetDir);

    loading.setSpinnerTitle(ColorizeText.info(this.MK_COPYING_NON_JS));
    await this.copyNonJS();

    loading.setSpinnerTitle(ColorizeText.info(this.MK_COPYING_JS));
    await this.copyJS();

    loading.setSpinnerTitle(ColorizeText.info(this.MK_WRITING_RUN_CONF));
    this.writeRunConf();

    loading.stop(true);
    console.log(ColorizeText.info(util.format(this.MK_BUILT, this.serverName)));
    console.log('');
  }
}
