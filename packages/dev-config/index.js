const path = require('path');
const tslint = require(path.join(__dirname, 'tslint'));
const tsconfig = require(path.join(__dirname, 'tsconfig'));

module.exports = {
  tslint,
  tsconfig
};
