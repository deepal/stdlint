const path = require('path');
const fs = require('fs/promises');
const createClient = require('simple-git/promise');

class LocalRepositoryClient {
  constructor({ repositoryConfig }) {
    const { localPath } = repositoryConfig;
    this.repositoryPath = localPath;
    this.client = createClient(localPath);
  }

  /**
   * Return the content of a file
   * @param {string} filePath
   * @returns {Buffer}
   */
  async getPathContent(filePath) {
    try {
      const content = await fs.readFile(path.join(this.repositoryPath, filePath));
      return content;
    } catch (err) {
      if (err.code === 'ENOENT') return null;
      throw err;
    }
  }

  /**
   * Check if a file/directory exists at the given path
   * @param {string} filePath
   * @returns {Boolean}
   */
  async checkPathExists(filePath) {
    try {
      await fs.stat(path.join(this.repositoryPath, filePath));
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') return null;
      throw err;
    }
  }

  async getRecentCommits(numberOfCommits) {
    // TODO: how can we limit the number of commit message read
    const log = await this.client.log();
    return log.all.slice(0, numberOfCommits).map((logItem) => logItem.message);
  }
}

module.exports = LocalRepositoryClient;
