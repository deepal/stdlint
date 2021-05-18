const cliProgress = require('cli-progress');
const colors = require('colors/safe');
const consts = require('./consts');
const { getAllRules } = require('./rules');
const { getStdlintConfig } = require('./utils');

module.exports = async ({ gitClient, cliArgs }) => {
  const progress = new cliProgress.SingleBar(
    {
      format: 'Running Checks... {bar} {percentage}% | {value}/{total} Checks | ETA: {eta}s',
      stopOnComplete: true,
      clearOnComplete: true,
    },
    cliProgress.Presets.shades_classic,
  );
  const stdlintConfig = getStdlintConfig();
  const rules = await getAllRules(stdlintConfig);
  const repoConfig = await gitClient.getRepoConfig();
  const { default_branch: defaultBranch } = repoConfig;
  const defaultBranchProtectionConfig = await gitClient.getBranchProtection(defaultBranch);

  progress.start(rules.length, 0);
  const results = [];
  let success = true;

  for (const rule of rules) {
    const { name, ruleFactory } = rule;
    const errorToleranceLevel = +cliArgs.level;
    const { category, severity, checkFunction } = ruleFactory({
      consts,
      gitClient,
      repoConfig,
      defaultBranchProtectionConfig,
      ruleConfig: stdlintConfig?.rules?.[name],
    });

    const userRuleConfig = stdlintConfig?.rules?.[name];
    if (userRuleConfig === false) {
      // Rule is disabled. skip.
      progress.increment();
      continue;
    }
    try {
      const { passed, score, message } = await checkFunction();
      results.push({
        rule: {
          name,
          category,
          severity,
        },
        result: {
          passed,
          message,
          score,
        },
      });
      if (!passed && severity > errorToleranceLevel) {
        success = false;
      }
    } catch (err) {
      results.push({
        rule: {
          name,
          category,
          severity,
        },
        result: null,
      });

      if (severity > errorToleranceLevel) {
        success = false;
      }
    }

    progress.increment();
  }

  progress.stop();

  return {
    success,
    results,
  };
};
