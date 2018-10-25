module.exports = {
  includes: 'src',
  exclude: ['**/index.ts', '**/index.d.ts', '**/*.test.ts'],

  mode: 'file',
  module: 'commonjs',
  excludeExternals: true,
  excludeNotExported: true,
  excludePrivate: true,
  excludeProtected: false,
  includeDeclarations: true,
  target: 'ES6',
  hideGenerator: true,
  theme: 'minimal'
};
