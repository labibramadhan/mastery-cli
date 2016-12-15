import path from 'path';
import simpleGit from 'simple-git';

export default class NewCommand {
  execute = async (destination) => {
    const git = simpleGit();
    const repoUrl = conf.get('mastery:repoUrl');
    await git.clone(repoUrl, path.resolve(destination));
  }
}
