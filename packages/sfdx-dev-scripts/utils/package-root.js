const { accessSync } = require('fs');
const { dirname, join } = require('path');

module.exports = (cwd => {
  let currentPath = cwd;
  if (!currentPath) {
    currentPath = process.cwd();
  }

  let projectRootPath;
  while (!projectRootPath) {
    try {
      const path = join(currentPath, 'package.json');
      accessSync(path);
      projectRootPath = currentPath;
    } catch (err) {
      // Pop one off
      currentPath = dirname(currentPath);
      if (currentPath === '/') {
        throw new Error('package root not found');
      }
    }
  }
  return projectRootPath;
})();
