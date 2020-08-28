module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'references-empty': [2, 'never'],
    'scope-case': [0],
  },
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['@W-', '#'],
    },
  },
};
