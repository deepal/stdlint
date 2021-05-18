const { Octokit } = require('octokit');
const { parseRepoUrl } = require('./utils');

class RemoteRepositoryClient {
  constructor({ accessToken, repositoryConfig }) {
    this.accessToken = accessToken;
    const { url } = repositoryConfig;
    this.repo = parseRepoUrl(url);
    this.client = new Octokit({ auth: accessToken });
    this.cache = {
      pathContentCache: {},
    };
  }

  async getRepoConfig() {
    const { data } = await this.client.request('GET /repos/{owner}/{repo}', {
      owner: this.repo.owner,
      repo: this.repo.name,
    });
    return data;
  }

  async getBranchProtection(branchName) {
    try {
      const { data } = await this.client.request('GET /repos/{owner}/{repo}/branches/{branch}/protection', {
        owner: this.repo.owner,
        repo: this.repo.name,
        branch: branchName,
        mediaType: {
          previews: ['luke-cage'],
        },
      });

      return data;
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  async getPathContent(filePath) {
    // Return the result from the cache to avoid multiple API calls
    if (this.cache.pathContentCache[filePath]) {
      return this.cache.pathContentCache[filePath];
    }

    try {
      const { data } = await this.client.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: this.repo.owner,
        repo: this.repo.name,
        path: filePath,
      });
      const contentBuffer = Buffer.from(data.content, 'base64');
      this.cache.pathContentCache[filePath] = contentBuffer;
      return contentBuffer;
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  async checkPathExists(filePath) {
    // Return the result from the cache to avoid multiple API calls
    if (this.cache.pathContentCache[filePath]) {
      return this.cache.pathContentCache[filePath];
    }

    try {
      const content = await this.getPathContent(filePath);
      return !!content;
    } catch (err) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  async checkDependabotAlerts() {
    try {
      const result = await this.client.request('GET /repos/{owner}/{repo}/vulnerability-alerts', {
        owner: this.repo.owner,
        repo: this.repo.name,
        mediaType: {
          previews: ['dorian'],
        },
      });
      return result.status === 204;
    } catch (err) {
      if (err.status === 404) return false;
      throw err;
    }
  }

  async getRecentCommits(numberOfCommits) {
    const { data } = await this.client.request('GET /repos/{owner}/{repo}/commits', {
      owner: this.repo.owner,
      repo: this.repo.name,
      per_page: numberOfCommits,
    });
    return data.map((logItem) => logItem.commit.message);
  }
}

module.exports = RemoteRepositoryClient;
