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
      '**  To kick start your installation, type the following commands:\n',
      `**  >_ cd ${this.destDir}\n`,
      '**  >_ mastery debug\n',
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
