module.exports = {
    includes: 'src',
    exclude: [
        '**/index.ts',
        '**/support.d.ts',
        '**/*.test.ts'
    ],

    mode: 'file',
    module: 'commonjs',
    excludeExternals: true,
    excludeNotExported: false,
    excludePrivate: true,
    externalPattern: 'node_modules/@salesforce/**',
    includeDeclarations: true,
    target: 'ES6',
    hideGenerator: true
};
