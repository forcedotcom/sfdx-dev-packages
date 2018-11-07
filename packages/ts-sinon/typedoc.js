module.exports = {
    includes: 'src',
    exclude: [
        '**/*.test.ts'
    ],

    mode: 'file',
    module: 'commonjs',
    excludeExternals: true,
    excludeNotExported: false,
    excludePrivate: true,
    includeDeclarations: true,
    target: 'ES6',
    hideGenerator: true
};
