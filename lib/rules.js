const fs = require('fs/promises');
const path = require('path');

const getAllRules = async (userConfig) => {
  const rulesExtended = Array.isArray(userConfig?.extends) && userConfig.extends.length > 0;
  if (!rulesExtended) return [];

  return userConfig.extends.reduce((extendedRules, ruleSetModuleName) => {
    try {
      const ruleSet = require(ruleSetModuleName);
      return [
        ...extendedRules,
        ...Object.keys(ruleSet).map((name) => {
          const ruleFactory = ruleSet[name];
          return {
            name,
            ruleFactory,
          };
        }),
      ];
    } catch (err) {
      // skip the failing rule
      return extendedRules;
    }
  }, []);
};

module.exports = {
  getAllRules,
};
