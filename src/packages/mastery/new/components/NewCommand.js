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

export default class NewCommand {
  MK_INTRO = 'Creating a new MasteryJS project..';
  MK_CLONING = 'Cloning latest MasteryJS package..'
  MK_INSTALLING = 'Installing your project..';
  CK_REPO = 'mastery:repoUrl';

  querying = async () => {
    this.questions = [{
      name: 'name',
      message: 'Project name:',
      default: _.kebabCase(path.basename(this.resolvedDestination)),
    }, {
      name: 'version',
      message: 'Your project starting version number:',
      default: '0.1.0',
    }, {
      name: 'license',
      message: 'License:',
    }, {
      name: 'author',
      message: 'Author:',
    }, {
      name: 'email',
      message: 'Email:',
    }, {
      name: 'url',
      message: 'Url:',
    }];

    return await inquirer.prompt(this.questions);
  }

  clone = async () => {
    const git = simpleGit();
    const repoUrl = conf.get(this.CK_REPO);

    await git.clone(repoUrl, path.resolve(this.resolvedDestination));
  }

  install = () => {
    execSync('npm install', {
      stdio: 'inherit',
    });
  }

  writeJSONPackage() {
    const questionKeys = _.map(this.questions, 'name');
    const answerValues = _.pick(this.answers, questionKeys);
    const targetPackage = getTargetPackage(this.resolvedDestination);
    _.forEach(answerValues, (val, key) => {
      _.unset(targetPackage, key);
    });
    const newPackage = _.merge(_.clone(answerValues), targetPackage);
    fs.writeFileSync(
      path.join(this.resolvedDestination, 'package.json'),
      JSON.stringify(newPackage, null, 2),
    );
  }

  cleanFiles = () => {
    del.sync('.git');
    del.sync('.travis.yml');
    del.sync('README.md');
  }

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

  execute = async (destDir: string) => {
    this.destDir = destDir;
    this.resolvedDestination = path.resolve(path.join(destDir));

    console.log(ColorizeText.info(this.MK_INTRO));
    console.log('');

    this.answers = await this.querying();

    console.log('');

    const loading = new Spinner(ColorizeText.info(this.MK_CLONING));
    loading.setSpinnerString(constants.DEFAULT_SPINNER);
    loading.start();

    await this.clone();

    loading.stop(true);

    console.log(ColorizeText.info(this.MK_INSTALLING));
    console.log('');

    process.chdir(this.resolvedDestination);

    this.cleanFiles();

    this.writeJSONPackage();

    this.install();

    console.log('');
    this.guidance();
  }
}
