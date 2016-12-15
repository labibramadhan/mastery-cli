import _ from 'lodash';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import simpleGit from 'simple-git';

export default class NewCommand {
  execute = async (destination) => {
    const resolvedDestination = path.resolve(destination);

    console.log(chalk.yellow('Creating a new MasteryJS project'));

    const questions = [{
      name: 'name',
      message: 'Project name:',
      default: _.kebabCase(path.basename(resolvedDestination)),
    }];

    const git = simpleGit();
    const repoUrl = conf.get('mastery:repoUrl');
    await inquirer.prompt(questions);

    await git.clone(repoUrl, path.resolve(resolvedDestination));
  }
}
