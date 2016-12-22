import {
  Spinner,
} from 'cli-spinner';
import _ from 'lodash';
import del from 'del';
import {
  execSync,
} from 'child_process';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import simpleGit from 'simple-git';

const ColorizeText = requireF('services/ColorizeText');
const {
  getTargetPackage,
} = requireF('services/CommonServices');

/**
 * The main class that handles the 'new' command execution.
 *
 * @export
 * @class NewCommand
 * @property {string} MK_INTRO The translation key of 'initializing' phase message
 * @property {string} MK_CLONING The translation key of 'cloning' phase message
 * @property {string} MK_INSTALLING The translation key of 'installing' phase message
 * @property {string} CK_REPO The configuration hierarchical key to retrieve from nconf
 * @property {string[]} DELETE_FILES Files to delete after cloning
 * @property {Object[]} QUESTIONS Inquirer questions objects
 */
export default class NewCommand {
  MK_INTRO = 'new.intro';
  MK_CLONING = 'new.cloning'
  MK_INSTALLING = 'new.installing';
  CK_REPO = 'repoUrl';
  DELETE_FILES = [
    '.git',
    '.travis.yml',
    'README.md',
  ];

  /**
   * Give user some questions to fill some package.json keys.
   *
   * @returns {Promise.<Object[]>} User answers, with question key as its key and answer as its value
   */
  async querying() {
    this.questions = [{
      name: 'name',
      message: i18n.t('questions.project.name'),
      default: _.kebabCase(path.basename(this.resolvedDestination)),
    }, {
      name: 'version',
      message: i18n.t('questions.project.version'),
      default: '0.1.0',
    }, {
      name: 'license',
      message: i18n.t('questions.project.license'),
    }, {
      name: 'author',
      message: i18n.t('questions.project.author'),
    }, {
      name: 'email',
      message: i18n.t('questions.project.email'),
    }, {
      name: 'url',
      message: i18n.t('questions.project.url'),
    }];
    return await inquirer.prompt(this.questions);
  }

  /**
   * Clone latest project version from MasteryJS github repo.
   *
   * @returns {Promise}
   */
  async clone() {
    const git = simpleGit();
    const repoUrl = conf.get(this.CK_REPO);

    await git.clone(repoUrl, path.resolve(this.resolvedDestination));
  }

  /**
   * Install npm packages for both dev and production dependencies.
   */
  install() {
    execSync('npm install', {
      stdio: 'inherit',
    });
  }
  /**
   * Write a new package.json file merged with user answers before.
   */
  writeJSONPackage() {
    const questionKeys = _.map(this.questions, 'name');
    const answerValues = _.pick(this.answers, questionKeys);
    const targetPackage = getTargetPackage(this.resolvedDestination);

    _.forEach(answerValues, (val, key) => {
      _.unset(targetPackage, key); // delete keys that exists in question
    });

    // merge answer values with default package.json from repo
    const newPackage = _.merge(_.clone(answerValues), targetPackage);

    fs.writeFileSync(
      path.join(this.resolvedDestination, 'package.json'),
      JSON.stringify(newPackage, null, 2),
    );
  }

  /**
   * Delete unnecessary files after cloning.
   */
  cleanFiles = () => {
    del.sync(this.DELETE_FILES);
  }

  /**
   * Show some guidance text to help user deciding what to do next.
   */
  guidance() {
    console.log(ColorizeText.info(
      ' *************************************************************\n',
      '*************************************************************\n',
      '**                                                         **\n',
      '**                  WELCOME TO MASTERYJS                   **\n',
      '**                                                         **\n',
      '*************************************************************\n',
      '*************************************************************\n',
      '**\n',
      '**  To kick start your installation, type the following command first:\n',
      `**  >_ cd ${this.destDir}\n`,
      '**\n',
      '**  A few tips to running your project in development mode:\n',
      '**  >_ mastery serve (running from source)\n',
      '**  >_ mastery serve -i (running & debugging from source using chrome inspector)\n',
      '**  >_ mastery serve -p <debug-port> (running & debugging from source using any IDE debugger)\n',
      '**\n',
      '**  To deploy your project, first you need to build using the following command:\n',
      '**  >_ mastery build\n',
      '**\n',
      '**  This commands will be available inside build directory:\n',
      '**  >_ mastery start\n',
      '**  >_ mastery stop\n',
      '**  >_ mastery reload\n',
      '**\n',
      '**  Remember to always type the following command if you get lost!\n',
      '**  >_ mastery --help\n',
      '**\n',
      '*************************************************************\n',
      '*************************************************************\n',
    ));
  }

  /**
   * The main method to call another methods sequentially, including decorations output.
   *
   * @param {string} destDir A relative destination directory path
   * @returns {Promise}
   */
  async execute(destDir: string) {
    this.destDir = destDir;
    this.resolvedDestination = path.resolve(path.join(destDir));

    console.log(ColorizeText.info(i18n.t(this.MK_INTRO)));
    console.log('');

    this.answers = await this.querying();

    console.log('');

    const loading = new Spinner(ColorizeText.info(i18n.t(this.MK_CLONING)));
    loading.setSpinnerString(constants.DEFAULT_SPINNER);
    loading.start();

    await this.clone();

    loading.stop(true);

    console.log(ColorizeText.info(i18n.t(this.MK_INSTALLING)));
    console.log('');

    // for next actions, we have to be inside the build directory
    process.chdir(this.resolvedDestination);

    this.cleanFiles();

    this.writeJSONPackage();

    this.install();

    console.log('');
    this.guidance();
  }
}
