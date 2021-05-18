#!/usr/bin/env node
const assert = require('assert');
const { createGitClient } = require('./lib/clients/git');
const createOutputFormatter = require('./lib/output');
const run = require('./lib/run');
const { getCLIArgs, getRepositoryConfigFromArgs } = require('./lib/utils');

const cliArgs = getCLIArgs();
const repositoryConfig = getRepositoryConfigFromArgs(cliArgs);
const getFormattedResult = createOutputFormatter(cliArgs.output);

assert.ok(
  process.env.GITHUB_AUTH_TOKEN,
  'GITHUB_AUTH_TOKEN environment variable is not set. Please make sure you set a valid Github personal access token for GITHUB_AUTH_TOKEN environment variable',
);

const gitClient = createGitClient({
  accessToken: process.env.GITHUB_AUTH_TOKEN,
  repositoryConfig,
});

(async () => {
  const { success, results } = await run({ gitClient, cliArgs });
  console.log(getFormattedResult(repositoryConfig, results));

  if (!success) {
    process.exit(1);
  }
})();
