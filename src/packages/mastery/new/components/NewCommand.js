import simpleGit from 'simple-git';

export default class NewCommand {
  execute = async () => {
    const git = simpleGit();
    const repoUrl = conf.get('mastery:repoUrl');
    await git.clone(repoUrl, '/Users/labibramadhan/Desktop/MasteryJS');
  }
}
