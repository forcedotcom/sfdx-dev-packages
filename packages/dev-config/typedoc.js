module.exports = {
  includes: 'src',

  mode: 'file',
  module: 'commonjs',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true,

  includeDeclarations: true,
  target: 'ES6',
  hideGenerator: true,
  theme: 'minimal'
};
