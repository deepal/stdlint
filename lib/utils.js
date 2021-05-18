const path = require('path');
const fs = require('fs');
const assert = require('assert');
const { URL } = require('url');
const { program } = require('commander');
const { RULE_SEVERITY } = require('./consts');
const { parseRepoUrl } = require('./clients/git/utils');

const getGithubUrl = ({ owner, name }) => {
  return `https://github.com/${owner}/${name}`;
};

const getRepositoryConfigFromUrl = (repositoryUrl) => {
  const { owner, name } = parseRepoUrl(repositoryUrl);
  return {
    name: name,
    url: getGithubUrl({ owner, name }),
    localPath: null,
  };
};

const getRepoConfigFromPath = (repositoryPath) => {
  const absolutePath = repositoryPath.startsWith('/') ? repositoryPath : path.join(process.cwd(), repositoryPath);
  const { repository } = JSON.parse(fs.readFileSync(path.join(absolutePath, 'package.json')));
  assert.ok(repository, 'repository field in package.json cannot be empty!');

  if (typeof repository === 'string') {
    const { owner, name } = repository.match(/^github:(?<owner>[^/]+)\/(?<name>[^/]+)$/i);
    assert.ok(name, 'cannot discern github repository name from package.json');
    return {
      name: name,
      url: getGithubUrl({ owner, name }),
      localPath: absolutePath,
    };
  } else {
    const { type, url } = repository;
    assert.strictEqual(type, 'git', `only git repositories are supported at the moment. found: ${repository}`);
    const { owner, name } = parseRepoUrl(url);
    return {
      name: name,
      url: getGithubUrl({ owner, name }),
      localPath: absolutePath,
    };
  }
};

const getRepositoryConfigFromArgs = (args) => {
  assert.ok(args.url || args.path, 'repository url or path is required');
  if (args.url) {
    return getRepositoryConfigFromUrl(args.url);
  }
  if (args.path) {
    return getRepoConfigFromPath(args.path);
  }
};

const getCLIArgs = () => {
  program
    .option('-p, --path <path>', 'local path of the project git repository')
    .option('-u, --url <url>', 'github repository URL')
    .option('-o, --output <output>', 'output format for the result. one of json, xml, pretty', 'pretty')
    .option('-l, --level <level>', 'maximum error tolerance level', RULE_SEVERITY.WARN);
  program.parse(process.argv);
  return program.opts();
};

const getStdlintConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), '.stdlintrc')));
  } catch {
    return null;
  }
};

module.exports = {
  getGithubUrl,
  getRepoConfigFromPath,
  getRepositoryConfigFromUrl,
  getRepositoryConfigFromArgs,
  getCLIArgs,
  getStdlintConfig,
};
