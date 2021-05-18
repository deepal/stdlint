const assert = require('assert');
const js2xmlparser = require('js2xmlparser');
const colors = require('colors/safe');
const { RULE_SEVERITY } = require('./consts');

const getStatusEmoji = (success, severity) => {
  if (success) return '🟢';
  switch (severity) {
    case RULE_SEVERITY.INFO:
      return '⚪️';
    case RULE_SEVERITY.WARN:
      return '🟡';
    default:
      return '🔴';
  }
};

const jsonOutput = (repositoryConfig, results) =>
  JSON.stringify(
    {
      repository: repositoryConfig,
      results,
    },
    null,
    2,
  );

const xmlOutput = (repositoryConfig, results) =>
  js2xmlparser.parse('Report', {
    repository: repositoryConfig,
    results,
  });

const prettyOutput = (repositoryConfig, results) => {
  const report = {};

  if (!results.length) {
    return 'No rules found. Exiting. \nTip: You can configure rules by installing a rule set and setting it in "extends" in .stdlintrc in your project';
  }

  results.forEach((ruleResult) => {
    const {
      rule: { name, category, severity },
      result,
    } = ruleResult;
    let output = null;
    if (result) {
      const { passed, message, score } = result;
      output = `${getStatusEmoji(passed, severity)} ${message} [score: ${score}%] ${colors.grey(name)}`;
    } else {
      output = `❌ An error occurred while running rule ${colors.grey(name)}`;
    }
    const categoryKey = category || 'Uncategorized';
    report[categoryKey] ? report[categoryKey].push(output) : (report[categoryKey] = [output]);
  });

  const heading = `
${colors.bold('Repository Details:')}
Name: ${colors.cyan(repositoryConfig.name)}
Remote URL: ${colors.cyan(repositoryConfig.url)}
Local Path: ${colors.cyan(repositoryConfig.localPath)}`;

  return (
    heading +
    Object.keys(report).reduce((output, category) => {
      return output + `\n\n${colors.bold(category)}:\n${report[category].join('\n')}`;
    }, '')
  );
};

module.exports = (outputFormat) => {
  assert.ok(
    ['json', 'xml', 'pretty'].includes(outputFormat),
    `output format should be one of "json", "xml" or "pretty". provided: "${outputFormat}"`,
  );
  switch (outputFormat) {
    case 'json':
      return jsonOutput;
    case 'xml':
      return xmlOutput;
    default:
      return prettyOutput;
  }
};
