const RemoteRepositoryClient = require('./remote-repository-client');
const LocalRepositoryClient = require('./local-repository-client');

class GitClient {
  constructor({ accessToken, repositoryConfig }) {
    const remoteOnly = !repositoryConfig.localPath;
    this.remoteClient = new RemoteRepositoryClient({ accessToken, repositoryConfig });

    if (!remoteOnly) {
      this.localClient = new LocalRepositoryClient({ accessToken, repositoryConfig });
    }

    this.getRepoConfig = this.remoteClient.getRepoConfig.bind(this.remoteClient);
    this.getBranchProtection = this.remoteClient.getBranchProtection.bind(this.remoteClient);
    this.checkDependabotAlerts = this.remoteClient.checkDependabotAlerts.bind(this.remoteClient);
    this.getPathContent = remoteOnly
      ? this.remoteClient.getPathContent.bind(this.remoteClient)
      : this.localClient.getPathContent.bind(this.localClient);
    this.checkPathExists = remoteOnly
      ? this.remoteClient.checkPathExists.bind(this.remoteClient)
      : this.localClient.checkPathExists.bind(this.localClient);
    this.getRecentCommits = remoteOnly
      ? this.remoteClient.getRecentCommits.bind(this.remoteClient)
      : this.localClient.getRecentCommits.bind(this.localClient);
  }
}

const createGitClient = (config) => {
  return new GitClient(config);
};

module.exports = {
  GitClient,
  createGitClient,
};
