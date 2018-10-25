const { join } = require('path');
const packageRoot = require('../utils/package-root');

module.exports = (() => {
  let config = {};
  try {
    const configPath = join(packageRoot, '.sfdx-dev-config.json');
    config = require(configPath);
    console.warn(`found config at ${configPath}`);
  } catch (err) { /* The repository doesn't have a config */ }
  return config;
})();