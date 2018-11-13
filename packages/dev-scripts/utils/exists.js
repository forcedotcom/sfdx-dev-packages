const { accessSync } = require('fs');

module.exports = path => {
  try {
    accessSync(path);
    return true;
  } catch (err) {}
  return false;
};
